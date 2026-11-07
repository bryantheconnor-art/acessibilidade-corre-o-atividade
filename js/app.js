(function () {
  'use strict';

  var storageKey = 'gestao-escolar.alunos.v1';
  var app = document.getElementById('app');
  var notice = document.getElementById('mensagem-aplicacao');
  if (!app || !notice) { return; }

  app.innerHTML = [
    '<section class="metricas" aria-label="Resumo de alunos">',
    '  <article class="metrica"><span class="metrica-icone" aria-hidden="true">#</span><div><p>Total de alunos</p><strong id="total-alunos">0</strong></div></article>',
    '  <article class="metrica"><span class="metrica-icone" aria-hidden="true">✓</span><div><p>Alunos ativos</p><strong id="alunos-ativos">0</strong></div></article>',
    '  <article class="metrica"><span class="metrica-icone" aria-hidden="true">▦</span><div><p>Turmas cadastradas</p><strong id="total-turmas">0</strong></div></article>',
    '</section>',
    '<section class="painel" id="cadastro" aria-labelledby="titulo-formulario">',
    '  <div class="painel-cabecalho"><div><p class="eyebrow">DADOS ESCOLARES</p><h2 id="titulo-formulario">Cadastrar aluno</h2></div></div>',
    '  <div id="resumo-erros" class="resumo-erros" role="alert" tabindex="-1"></div>',
    '  <form id="form-aluno" novalidate>',
    '    <input type="hidden" id="aluno-id" name="id">',
    '    <div class="form-grid">',
    '      <div class="campo campo-largo"><label class="rotulo-campo" for="nome">Nome completo <span class="marcador-obrigatorio" aria-hidden="true">*</span></label><input id="nome" name="nome" type="text" autocomplete="name" required aria-describedby="erro-nome"><p id="erro-nome" class="erro" aria-live="polite"></p></div>',
    '      <div class="campo"><label class="rotulo-campo" for="email">E-mail <span class="marcador-obrigatorio" aria-hidden="true">*</span></label><input id="email" name="email" type="email" autocomplete="email" required aria-describedby="erro-email"><p id="erro-email" class="erro" aria-live="polite"></p></div>',
    '      <div class="campo"><label class="rotulo-campo" for="telefone">Telefone</label><input id="telefone" name="telefone" type="tel" autocomplete="tel"></div>',
    '      <div class="campo"><label class="rotulo-campo" for="turma">Turma <span class="marcador-obrigatorio" aria-hidden="true">*</span></label><input id="turma" name="turma" type="text" placeholder="Ex.: 1º ano A" required aria-describedby="erro-turma"><p id="erro-turma" class="erro" aria-live="polite"></p></div>',
    '      <div class="campo"><label class="rotulo-campo" for="situacao">Situação</label><select id="situacao" name="situacao"><option value="ativo">Ativo</option><option value="inativo">Inativo</option></select></div>',
    '    </div>',
    '    <fieldset class="endereco">',
    '      <legend>Endereço <span class="obrigatorio">(opcional)</span></legend>',
    '      <div class="form-grid">',
    '        <div class="campo"><label class="rotulo-campo" for="cep">CEP</label><div class="consulta-cep"><input id="cep" name="cep" type="text" inputmode="numeric" autocomplete="postal-code" maxlength="9" aria-describedby="dica-cep estado-cep"><button type="button" class="botao botao-secundario" id="consultar-cep">Buscar CEP</button></div><p class="dica" id="dica-cep">A consulta pública ViaCEP envia somente o CEP.</p><p class="dica" id="estado-cep" role="status" aria-live="polite"></p></div>',
    '        <div class="campo"><label class="rotulo-campo" for="logradouro">Rua</label><input id="logradouro" name="logradouro" type="text" autocomplete="address-line1"></div>',
    '        <div class="campo"><label class="rotulo-campo" for="bairro">Bairro</label><input id="bairro" name="bairro" type="text"></div>',
    '        <div class="campo"><label class="rotulo-campo" for="cidade">Cidade</label><input id="cidade" name="cidade" type="text" autocomplete="address-level2"></div>',
    '        <div class="campo"><label class="rotulo-campo" for="uf">Estado</label><input id="uf" name="uf" type="text" maxlength="2" autocomplete="address-level1"></div>',
    '      </div>',
    '    </fieldset>',
    '    <div class="acoes-formulario"><button type="submit" class="botao" id="salvar-aluno">Salvar aluno</button><button type="button" class="botao botao-secundario" id="cancelar-edicao" hidden>Cancelar edição</button></div>',
    '  </form>',
    '</section>',
    '<section class="painel" id="alunos" aria-labelledby="titulo-alunos">',
    '  <div class="painel-cabecalho painel-cabecalho-lista"><div><p class="eyebrow">GERENCIAMENTO</p><h2 id="titulo-alunos" tabindex="-1">Alunos cadastrados</h2></div><label class="busca-alunos" for="buscar-alunos"><span>Buscar por nome, e-mail ou turma</span><input id="buscar-alunos" type="search" autocomplete="off" placeholder="Digite para buscar"></label></div>',
    '  <div class="tabela-responsiva"><table><caption>Lista de alunos cadastrados. Use os botões de ação para editar ou excluir um registro.</caption><thead><tr><th scope="col">Aluno</th><th scope="col">E-mail</th><th scope="col">Turma</th><th scope="col">Situação</th><th scope="col">Ações</th></tr></thead><tbody id="lista-alunos"></tbody></table></div>',
    '  <p id="lista-vazia" class="lista-vazia" hidden>Nenhum aluno encontrado. Cadastre um aluno ou ajuste a busca.</p>',
    '</section>',
    '<p class="nota-privacidade">Os cadastros ficam salvos somente no armazenamento local deste navegador. Não use dados reais ou sensíveis neste protótipo.</p>'
  ].join('');

  var form = document.getElementById('form-aluno');
  var errorSummary = document.getElementById('resumo-erros');
  var cepStatus = document.getElementById('estado-cep');
  var cepInput = document.getElementById('cep');
  var cepButton = document.getElementById('consultar-cep');
  var search = document.getElementById('buscar-alunos');
  var tableBody = document.getElementById('lista-alunos');
  var storageReady = true;
  var students = [];
  var lookupId = 0;
  var resolvedCep = '';
  var fields = [
    { id: 'nome', label: 'Nome completo', validate: function (input) {
      return input.value.trim() ? '' : 'Informe o nome completo.';
    } },
    { id: 'email', label: 'E-mail', validate: function (input) {
      if (!input.value.trim()) { return 'Informe o e-mail.'; }
      return input.validity.valid ? '' : 'Informe um endereço de e-mail válido.';
    } },
    { id: 'turma', label: 'Turma', validate: function (input) {
      return input.value.trim() ? '' : 'Informe a turma do aluno.';
    } }
  ];

  function showNotice(message, isError) {
    notice.textContent = message;
    notice.className = isError ? 'mensagem-aplicacao erro-aplicacao' : 'mensagem-aplicacao';
  }

  function loadStudents() {
    try {
      var saved = window.localStorage.getItem(storageKey);
      if (!saved) { return []; }
      var parsed = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.some(function (student) {
        return !student || ['id', 'nome', 'email', 'telefone', 'turma', 'situacao',
          'cep', 'logradouro', 'bairro', 'cidade', 'uf'].some(function (key) {
            return typeof student[key] !== 'string';
          }) ||
          (student.situacao !== 'ativo' && student.situacao !== 'inativo');
      })) {
        throw new Error('Os dados salvos não têm o formato esperado.');
      }
      return parsed;
    } catch (error) {
      storageReady = false;
      console.error('Não foi possível carregar os cadastros locais:', error);
      showNotice('Não foi possível ler os dados salvos. O cadastro está bloqueado para evitar sobrescrever registros.', true);
      return [];
    }
  }

  function persist(nextStudents) {
    if (!storageReady) {
      showNotice('O armazenamento local está indisponível. Nenhuma alteração foi salva.', true);
      return false;
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextStudents));
      students = nextStudents;
      return true;
    } catch (error) {
      console.error('Não foi possível salvar os cadastros locais:', error);
      showNotice('Falha ao salvar neste navegador. Verifique o espaço disponível e tente novamente.', true);
      return false;
    }
  }

  function createCell(row, text) {
    var cell = document.createElement('td');
    cell.textContent = text;
    row.appendChild(cell);
    return cell;
  }

  function renderStudents() {
    var query = search.value.trim().toLocaleLowerCase('pt-BR');
    var visibleStudents = students.filter(function (student) {
      return [student.nome, student.email, student.turma].some(function (value) {
        return value.toLocaleLowerCase('pt-BR').includes(query);
      });
    });

    tableBody.textContent = '';
    visibleStudents.forEach(function (student) {
      var row = document.createElement('tr');
      createCell(row, student.nome);
      createCell(row, student.email);
      createCell(row, student.turma);

      var situationCell = createCell(row, student.situacao === 'ativo' ? 'Ativo' : 'Inativo');
      var badge = document.createElement('span');
      badge.className = 'situacao situacao-' + student.situacao;
      badge.textContent = situationCell.textContent;
      situationCell.textContent = '';
      situationCell.appendChild(badge);

      var actions = document.createElement('td');
      actions.className = 'acoes-tabela';
      var editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'botao-acao';
      editButton.setAttribute('data-acao', 'editar');
      editButton.setAttribute('data-id', student.id);
      editButton.setAttribute('aria-label', 'Editar cadastro de ' + student.nome);
      editButton.textContent = 'Editar';
      var deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'botao-acao botao-excluir';
      deleteButton.setAttribute('data-acao', 'excluir');
      deleteButton.setAttribute('data-id', student.id);
      deleteButton.setAttribute('aria-label', 'Excluir cadastro de ' + student.nome);
      deleteButton.textContent = 'Excluir';
      actions.appendChild(editButton);
      actions.appendChild(deleteButton);
      row.appendChild(actions);
      tableBody.appendChild(row);
    });

    document.getElementById('lista-vazia').hidden = visibleStudents.length !== 0;
    document.getElementById('total-alunos').textContent = String(students.length);
    document.getElementById('alunos-ativos').textContent = String(students.filter(function (student) {
      return student.situacao === 'ativo';
    }).length);
    document.getElementById('total-turmas').textContent = String(new Set(students.map(function (student) {
      return student.turma.trim().toLocaleLowerCase('pt-BR');
    })).size);
  }

  function setFieldError(field, message) {
    var input = document.getElementById(field.id);
    input.setAttribute('aria-invalid', 'true');
    document.getElementById('erro-' + field.id).textContent = 'Erro: ' + message;
  }

  function clearFieldError(field) {
    var input = document.getElementById(field.id);
    input.removeAttribute('aria-invalid');
    document.getElementById('erro-' + field.id).textContent = '';
    var item = errorSummary.querySelector('li[data-field="' + field.id + '"]');
    if (item) { item.remove(); }
    if (!errorSummary.querySelector('li')) { errorSummary.textContent = ''; }
  }

  function validateField(field) {
    var message = field.validate(document.getElementById(field.id));
    if (message) { setFieldError(field, message); } else { clearFieldError(field); }
    return message;
  }

  function showErrors(errors) {
    errorSummary.textContent = '';
    var box = document.createElement('div');
    box.className = 'resumo-conteudo';
    var heading = document.createElement('h2');
    heading.textContent = 'Revise os campos destacados';
    box.appendChild(heading);
    var list = document.createElement('ul');
    errors.forEach(function (error) {
      var item = document.createElement('li');
      item.setAttribute('data-field', error.field.id);
      var link = document.createElement('a');
      link.href = '#' + error.field.id;
      link.textContent = error.field.label + ': ' + error.message;
      link.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById(error.field.id).focus();
      });
      item.appendChild(link);
      list.appendChild(item);
    });
    box.appendChild(list);
    errorSummary.appendChild(box);
    errorSummary.focus();
  }

  fields.forEach(function (field) {
    var input = document.getElementById(field.id);
    input.addEventListener('blur', function () { validateField(field); });
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true' && !field.validate(input)) {
        clearFieldError(field);
      }
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorSummary.textContent = '';
    var errors = fields.map(function (field) {
      return { field: field, message: validateField(field) };
    }).filter(function (result) {
      return result.message;
    });
    if (errors.length) {
      showErrors(errors);
      return;
    }

    var data = new FormData(form);
    var id = data.get('id');
    var email = String(data.get('email')).trim().toLocaleLowerCase('pt-BR');
    var duplicate = students.some(function (student) {
      return student.email.toLocaleLowerCase('pt-BR') === email && student.id !== id;
    });
    if (duplicate) {
      var emailField = fields[1];
      setFieldError(emailField, 'Este e-mail já está cadastrado.');
      showErrors([{ field: emailField, message: 'Este e-mail já está cadastrado.' }]);
      return;
    }

    var student = {
      id: id || (window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : String(Date.now()) + '-' + Math.random().toString(16).slice(2)),
      nome: String(data.get('nome')).trim(),
      email: String(data.get('email')).trim(),
      telefone: String(data.get('telefone')).trim(),
      turma: String(data.get('turma')).trim(),
      situacao: String(data.get('situacao')),
      cep: String(data.get('cep')).trim(),
      logradouro: String(data.get('logradouro')).trim(),
      bairro: String(data.get('bairro')).trim(),
      cidade: String(data.get('cidade')).trim(),
      uf: String(data.get('uf')).trim().toUpperCase()
    };
    var nextStudents = id
      ? students.map(function (item) { return item.id === id ? student : item; })
      : students.concat(student);

    if (!persist(nextStudents)) { return; }
    renderStudents();
    form.reset();
    document.getElementById('aluno-id').value = '';
    resolvedCep = '';
    document.getElementById('titulo-formulario').textContent = 'Cadastrar aluno';
    document.getElementById('salvar-aluno').textContent = 'Salvar aluno';
    document.getElementById('cancelar-edicao').hidden = true;
    document.getElementById('estado-cep').textContent = '';
    errorSummary.textContent = '';
    showNotice(id ? 'Cadastro atualizado com sucesso.' : 'Aluno cadastrado com sucesso.', false);
    document.getElementById('titulo-alunos').focus();
  });

  function beginEdit(student) {
    Object.keys(student).forEach(function (key) {
      var input = document.getElementById(key);
      if (input) { input.value = student[key]; }
    });
    resolvedCep = student.cep.replace(/\D/g, '');
    document.getElementById('titulo-formulario').textContent = 'Editar aluno';
    document.getElementById('salvar-aluno').textContent = 'Salvar alterações';
    document.getElementById('cancelar-edicao').hidden = false;
    document.getElementById('estado-cep').textContent = '';
    showNotice('Editando cadastro de ' + student.nome + '.', false);
    document.getElementById('nome').focus();
  }

  tableBody.addEventListener('click', function (event) {
    var button = event.target.closest('button[data-acao]');
    if (!button) { return; }
    var student = students.find(function (item) {
      return item.id === button.getAttribute('data-id');
    });
    if (!student) { return; }

    if (button.getAttribute('data-acao') === 'editar') {
      beginEdit(student);
      document.getElementById('cadastro').scrollIntoView();
      return;
    }
    if (window.confirm('Excluir o cadastro de ' + student.nome + '?')) {
      var nextStudents = students.filter(function (item) { return item.id !== student.id; });
      if (persist(nextStudents)) {
        renderStudents();
        if (document.getElementById('aluno-id').value === student.id) {
          form.reset();
          document.getElementById('aluno-id').value = '';
          document.getElementById('titulo-formulario').textContent = 'Cadastrar aluno';
          document.getElementById('salvar-aluno').textContent = 'Salvar aluno';
          document.getElementById('cancelar-edicao').hidden = true;
          resolvedCep = '';
        }
        showNotice('Cadastro excluído.', false);
      }
    }
  });

  document.getElementById('cancelar-edicao').addEventListener('click', function () {
    form.reset();
    document.getElementById('aluno-id').value = '';
    resolvedCep = '';
    document.getElementById('titulo-formulario').textContent = 'Cadastrar aluno';
    document.getElementById('salvar-aluno').textContent = 'Salvar aluno';
    this.hidden = true;
    errorSummary.textContent = '';
    document.getElementById('estado-cep').textContent = '';
    showNotice('Edição cancelada.', false);
  });

  search.addEventListener('input', renderStudents);

  async function lookupCep() {
    var currentLookup = ++lookupId;
    var digits = cepInput.value.replace(/\D/g, '');
    cepStatus.textContent = '';
    if (!/^\d{8}$/.test(digits)) {
      cepButton.disabled = false;
      cepStatus.textContent = 'Digite um CEP com 8 números.';
      cepInput.focus();
      return;
    }

    cepButton.disabled = true;
    cepStatus.textContent = 'Consultando ViaCEP…';
    try {
      var response = await fetch('https://viacep.com.br/ws/' + digits + '/json/');
      if (!response.ok) {
        throw new Error('ViaCEP respondeu com HTTP ' + response.status + '.');
      }
      var address = await response.json();
      if (currentLookup !== lookupId) { return; }
      if (address.erro) {
        cepStatus.textContent = 'CEP não encontrado. Confira os números e tente novamente.';
        return;
      }
      document.getElementById('logradouro').value = address.logradouro || '';
      document.getElementById('bairro').value = address.bairro || '';
      document.getElementById('cidade').value = address.localidade || '';
      document.getElementById('uf').value = address.uf || '';
      resolvedCep = digits;
      cepStatus.textContent = 'Endereço preenchido pela API ViaCEP.';
    } catch (error) {
      if (currentLookup !== lookupId) { return; }
      console.error('Falha ao consultar o ViaCEP:', error);
      cepStatus.textContent = 'Não foi possível consultar o CEP. Verifique a conexão e tente novamente.';
    } finally {
      if (currentLookup === lookupId) { cepButton.disabled = false; }
    }
  }

  cepButton.addEventListener('click', lookupCep);
  cepInput.addEventListener('input', function () {
    var digits = cepInput.value.replace(/\D/g, '');
    if (digits === resolvedCep) { return; }
    lookupId++;
    cepButton.disabled = false;
    if (resolvedCep) {
      ['logradouro', 'bairro', 'cidade', 'uf'].forEach(function (id) {
        document.getElementById(id).value = '';
      });
    }
    resolvedCep = '';
    cepStatus.textContent = '';
  });
  cepInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      lookupCep();
    }
  });

  students = loadStudents();
  renderStudents();
})();
