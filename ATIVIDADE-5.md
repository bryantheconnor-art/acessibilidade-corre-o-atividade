# Atividade 5 — Gestão escolar

A aplicação permite cadastrar, consultar, editar e excluir alunos. A interface e o formulário
são gerados em JavaScript; os registros são persistidos no navegador com `localStorage`.

O campo de busca filtra por nome, e-mail ou turma. No endereço, a consulta à API pública
ViaCEP preenche rua, bairro, cidade e estado a partir de um CEP válido. Somente o CEP é
enviado ao serviço.

## Roteiro de teste

1. Abra `index.html` por um servidor estático e confirme que o formulário é criado.
2. Tente salvar sem nome, e-mail ou turma e confira o resumo acessível de erros.
3. Cadastre um aluno e pesquise por seu e-mail.
4. Edite o cadastro, altere a situação e exclua-o.
5. Consulte um CEP válido e outro inválido e confira o feedback.
6. Recarregue a página para confirmar a persistência local dos registros.

O projeto é apenas front-end: não possui autenticação, servidor ou sincronização entre
dispositivos. Use somente dados fictícios.
