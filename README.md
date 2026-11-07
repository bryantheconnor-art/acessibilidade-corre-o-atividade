# Sistema de Gestão Escolar

Aplicação web simples para cadastrar e acompanhar alunos. A interface usa fundo branco,
menu direto, formulário e tabela, seguindo o estilo comum de sistemas escolares.

**Referência visual:** [Gestão de escolar no Figma](https://www.figma.com/design/AqeRrrub0y6LCOFv372aV4/Gest%C3%A3o-de-escolar?node-id=2-680).

## Funcionalidades

- Cadastrar alunos com nome, e-mail, telefone, turma e situação.
- Preencher endereço manualmente ou consultar pelo CEP no ViaCEP.
- Listar alunos em uma tabela e buscar por nome, e-mail ou turma.
- Editar e excluir cadastros.
- Mostrar totais de alunos, alunos ativos e turmas.
- Validar os campos obrigatórios e indicar os erros junto ao formulário.
- Guardar os registros no navegador para que continuem disponíveis após atualizar a página.

## Como usar

1. Abra a página inicial em um navegador.
2. Preencha nome, e-mail e turma; os demais campos são opcionais.
3. Para consultar o endereço, informe o CEP e pressione **Buscar CEP**.
4. Selecione **Salvar aluno**. Os registros aparecem na tabela abaixo.
5. Use **Editar** ou **Excluir** na linha do cadastro. A busca filtra a tabela enquanto você
   digita.

O formulário e os controles de gerenciamento são criados por `js/app.js`. Os estilos estão
em `style.css` e a página principal é `index.html`.

## Executar localmente

Para permitir a consulta ao ViaCEP e testar a página como um site, inicie um servidor estático
na pasta do projeto:

```powershell
python -m http.server 8000
```

Abra `http://localhost:8000` no navegador. Também é possível publicar a pasta em um host
estático, como GitHub Pages.

## Comentários e observações

- O visual foi simplificado conforme solicitado: fundo branco, cores discretas, campos
  claramente identificados e tabela sem efeitos decorativos.
- O link do Figma está registrado como referência. Se o arquivo não estiver público, será
  necessário habilitar a visualização ou fornecer uma captura para que detalhes específicos
  do desenho possam ser comparados.
- A busca de e-mail é feita somente entre os cadastros que já existem neste navegador. Não há
  uma API pública segura e apropriada para descobrir dados pessoais de alguém a partir de um
  endereço de e-mail.
- A consulta ao ViaCEP envia somente o CEP digitado e retorna dados de endereço. Se não houver
  conexão, o endereço pode ser informado manualmente.
- Este projeto é um protótipo front-end: não possui servidor, login, níveis de acesso,
  sincronização entre computadores ou cópia de segurança automática.
- Os dados ficam no `localStorage` do navegador e podem ser apagados ao limpar os dados do
  site, mudar de navegador ou trocar de dispositivo.
- Não use informações reais de alunos. Para uso escolar real, seria necessário um servidor
  protegido, controle de acesso, cópias de segurança e tratamento adequado dos dados pessoais
  de acordo com a LGPD.

## Testes manuais sugeridos

1. Tente salvar sem nome, e-mail e turma; confirme que os avisos aparecem e que o foco vai
   para o resumo.
2. Cadastre um aluno e pesquise por seu nome, e-mail e turma.
3. Edite o cadastro, altere a situação e confira os totais.
4. Exclua um cadastro e confirme o pedido de confirmação.
5. Consulte um CEP válido e outro inválido.
6. Atualize a página para confirmar que os dados continuam no mesmo navegador.
7. Repita as ações usando apenas o teclado.
