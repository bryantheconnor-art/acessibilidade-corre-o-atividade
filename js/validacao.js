/*
 * Validação acessível do formulário de cadastro (contato.html)
 * Harmonia Instrumentos Musicais – Atividade 5, Parte 2
 *
 * Estrutura: uma lista (CAMPOS) com a regra de cada campo, percorrida por
 * laços "for" para registrar eventos, validar e montar o resumo de erros.
 *
 * Comportamento exigido pela atividade:
 *  1. valida cada campo ao perder o foco (blur);
 *  2. mensagem de erro ligada ao campo por aria-describedby (já no HTML);
 *  3. atualiza aria-invalid nos campos com erro;
 *  4. após tentativa de envio, resumo de erros no topo com role="alert";
 *  5. o resumo tem links âncora para cada campo com problema;
 *  6. ao corrigir, remove o estado de erro e a mensagem.
 */
(function () {
  'use strict';

  var form = document.getElementById('form-cadastro');
  if (!form) { return; }

  var resumo = document.getElementById('resumo-erros');
  var sucesso = document.getElementById('msg-sucesso');

  /* ------------------------------------------------------------------
   * 1. REGRAS DE VALIDAÇÃO
   * Cada regra recebe o valor já tratado e devolve a mensagem de erro,
   * ou '' (texto vazio) quando o valor é válido.
   * ------------------------------------------------------------------ */

  function soDigitos(texto) {
    return texto.replace(/\D/g, '');
  }

  function validarNome(valor) {
    if (valor === '') { return 'Informe seu nome completo.'; }
    if (!/\S+\s+\S+/.test(valor)) { return 'Informe nome e sobrenome.'; }
    return '';
  }

  function validarEmail(valor) {
    if (valor === '') { return 'Informe seu e-mail.'; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) {
      return 'E-mail inválido. Use o formato nome@dominio.com.';
    }
    return '';
  }

  /* CPF: 11 dígitos + 2 dígitos verificadores (cálculo oficial). */
  function digitoVerificadorCpf(digitos, tamanho) {
    var soma = 0;
    for (var i = 0; i < tamanho; i++) {
      soma += parseInt(digitos.charAt(i), 10) * (tamanho + 1 - i);
    }
    var resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  }

  function validarCpf(valor) {
    if (valor === '') { return 'Informe seu CPF.'; }
    if (/[^\d.\-\s]/.test(valor)) {
      return 'O CPF deve ter apenas números, pontos e traço. Exemplo: 123.456.789-09.';
    }
    var d = soDigitos(valor);
    if (d.length !== 11) {
      return 'O CPF deve ter 11 números. Exemplo: 123.456.789-09.';
    }
    var repetidos = true;
    for (var i = 1; i < 11; i++) {
      if (d.charAt(i) !== d.charAt(0)) { repetidos = false; break; }
    }
    if (repetidos ||
        digitoVerificadorCpf(d, 9) !== parseInt(d.charAt(9), 10) ||
        digitoVerificadorCpf(d, 10) !== parseInt(d.charAt(10), 10)) {
      return 'CPF inválido. Confira os números digitados.';
    }
    return '';
  }

  function validarNascimento(valor) {
    if (valor === '') { return 'Informe sua data de nascimento.'; }
    var partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
    if (!partes) {
      return 'Use o formato dd/mm/aaaa, por exemplo 25/12/1990.';
    }
    var dia = parseInt(partes[1], 10);
    var mes = parseInt(partes[2], 10);
    var ano = parseInt(partes[3], 10);
    var data = new Date(ano, mes - 1, dia);
    // Confere se a data existe de verdade (ex.: 31/02/2000 não existe).
    if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
      return 'Essa data não existe. Confira o dia e o mês.';
    }
    if (ano < 1900) { return 'Informe um ano a partir de 1900.'; }
    if (data.getTime() > Date.now()) {
      return 'A data de nascimento não pode estar no futuro.';
    }
    return '';
  }

  /* Telefone é opcional: vazio é válido; preenchido precisa de DDD + número. */
  function validarTelefone(valor) {
    if (valor === '') { return ''; }
    var d = soDigitos(valor);
    if (d.length < 10 || d.length > 11) {
      return 'Telefone inválido. Informe DDD e número, como (11) 91234-5678.';
    }
    return '';
  }

  /* Requisitos da senha: lista percorrida por "for". */
  var REQUISITOS_SENHA = [
    { texto: 'no mínimo 8 caracteres',     ok: function (v) { return v.length >= 8; } },
    { texto: '1 letra maiúscula',          ok: function (v) { return /[A-Z]/.test(v); } },
    { texto: '1 letra minúscula',          ok: function (v) { return /[a-z]/.test(v); } },
    { texto: '1 número',                   ok: function (v) { return /\d/.test(v); } }
  ];

  function validarSenha(valor) {
    if (valor === '') { return 'Informe uma senha.'; }
    var faltando = [];
    for (var i = 0; i < REQUISITOS_SENHA.length; i++) {
      if (!REQUISITOS_SENHA[i].ok(valor)) { faltando.push(REQUISITOS_SENHA[i].texto); }
    }
    if (faltando.length > 0) {
      return 'A senha precisa ter ' + faltando.join(', ') + '.';
    }
    return '';
  }

  function validarConfirmacao(valor) {
    if (valor === '') { return 'Confirme sua senha.'; }
    if (valor !== document.getElementById('senha').value) {
      return 'As senhas não coincidem. Digite a mesma senha nos dois campos.';
    }
    return '';
  }

  function validarTermos(marcado) {
    return marcado ? '' : 'Você precisa aceitar os Termos de uso para continuar.';
  }

  /* ------------------------------------------------------------------
   * 2. LISTA DE CAMPOS
   * id      → id do input (a mensagem fica em "erro-" + id)
   * rotulo  → nome do campo usado no resumo de erros
   * tipo    → 'texto' (usa .value) ou 'marcar' (usa .checked)
   * validar → regra que devolve a mensagem de erro ('' = válido)
   * ------------------------------------------------------------------ */
  var CAMPOS = [
    { id: 'nome',            rotulo: 'Nome completo',         tipo: 'texto',  validar: validarNome },
    { id: 'email',           rotulo: 'E-mail',                tipo: 'texto',  validar: validarEmail },
    { id: 'cpf',             rotulo: 'CPF',                   tipo: 'texto',  validar: validarCpf },
    { id: 'nascimento',      rotulo: 'Data de nascimento',    tipo: 'texto',  validar: validarNascimento },
    { id: 'telefone',        rotulo: 'Telefone',              tipo: 'texto',  validar: validarTelefone },
    { id: 'senha',           rotulo: 'Senha',                 tipo: 'texto',  validar: validarSenha },
    { id: 'confirmar-senha', rotulo: 'Confirmação de senha',  tipo: 'texto',  validar: validarConfirmacao },
    { id: 'termos',          rotulo: 'Aceite dos termos',     tipo: 'marcar', validar: validarTermos }
  ];

  // [[PROXIMA-ETAPA]]
})();
