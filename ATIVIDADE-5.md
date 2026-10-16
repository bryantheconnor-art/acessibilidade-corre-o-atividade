# Atividade 5 — Formulário de cadastro e validação com feedback acessível

Harmonia Instrumentos Musicais · branch `correcao-atualizada-2`

## O que mudou

| Arquivo | Mudança |
| --- | --- |
| `index.html` | O formulário de contato foi **removido** da home. No lugar, um parágrafo com link para `contato.html`. |
| `contato.html` | **Nova** página: mesmos landmarks da home (skip-link, `header`, 2 `nav`, `main`, `footer`) e o formulário de cadastro. Link "Contato" do menu com `aria-current="page"`. |
| `js/validacao.js` | **Novo** script de validação (sem bibliotecas). |
| `style.css` | Estilos de dicas, estados de erro, resumo, sucesso e honeypot; cores de erro/sucesso com contraste nos dois temas. |
| `.github/workflows/acessibilidade.yml` | Passa a validar também `contato.html`. |

## Parte 1 — campos do formulário

| # | Campo | Obrigatório | Marcação |
| --- | --- | --- | --- |
| 1 | Nome completo | sim | `input text`, `autocomplete="name"` |
| 2 | E-mail | sim | `input email` |
| 3 | CPF | sim | `input text`, `inputmode="numeric"`, valida dígitos verificadores |
| 4 | Data de nascimento | sim | `input text` dd/mm/aaaa, `autocomplete="bday"` |
| 5 | Telefone | não | `input tel` |
| 6 | Senha | sim | requisitos visíveis (8+ caracteres, maiúscula, minúscula, número) |
| 7 | Confirmação de senha | sim | deve ser igual à senha |
| 8 | Gênero | não | `fieldset` + `legend` + radios |
| 9 | Interesses | não | `fieldset` + `legend` + checkboxes |
| 10 | Como conheceu o site | não | `select` com `label` |
| 11 | Aceite dos termos | sim | checkbox com `label` |
| 12 | Anti-spam (honeypot) | — | fora da tela, `inert` + `aria-hidden`, `tabindex="-1"` |
| 13 | Botão de envio | — | `<button type="submit">` |

Requisitos atendidos: todo campo tem `<label for>`; `fieldset`/`legend` agrupam
"Dados pessoais", "Segurança da conta", "Gênero" e "Interesses"; obrigatórios marcados com
`*` visual (oculto para leitor de tela) **e** o texto "(obrigatório)"; dicas de formato
visíveis ligadas por `aria-describedby`; operável só com teclado.

## Parte 2 — validação (`js/validacao.js`)

1. **Blur:** cada campo é validado ao perder o foco.
2. **`aria-describedby`:** cada input aponta para a dica e para a mensagem de erro (`erro-<id>`,
   região `aria-live="polite"`).
3. **`aria-invalid`:** `true` com erro, `false` quando corrigido.
4. **Resumo:** após tentar enviar, `#resumo-erros` (`role="alert"`) lista os erros e recebe o foco.
5. **Links âncora:** cada item do resumo é um link `#id-do-campo` que foca o campo.
6. **Correção:** ao corrigir, o erro, a mensagem e o item do resumo somem (e o resumo some
   quando fica vazio).

O erro nunca depende só da cor: borda mais grossa, prefixo "Erro:" no texto e `aria-invalid`.

## Decisões e observações

- `novalidate` no `<form>`: a validação é do JavaScript, para as mensagens serem acessíveis
  e iguais em todos os navegadores. Os atributos `required`/`minlength` continuam no HTML
  para comunicar a obrigatoriedade à tecnologia assistiva.
- O envio é **demonstrativo** (GitHub Pages não tem servidor): mostra uma mensagem em
  `role="status"`. Com back-end, trocar pelo `form.submit()` indicado no código.
- Honeypot preenchido: o envio é descartado em silêncio.
- Senha não é guardada nem exibida em lugar nenhum.

## Roteiro de teste (teclado e NVDA)

1. **Teclado:** `Tab` percorre skip-link → menu → campos → botão; foco sempre visível.
2. Saia de um campo obrigatório vazio com `Tab`: a mensagem "Erro: …" deve ser anunciada.
3. Clique em **Enviar cadastro** com o formulário vazio: o resumo é lido (`role="alert"`) e o
   foco vai para ele. `Tab` percorre os links; `Enter` leva ao campo.
4. Corrija um campo: o erro some e o item sai do resumo.
5. NVDA: `F` (campos de formulário), `H` (cabeçalhos), `Insert+F7` (landmarks e links).
   Confirme se o resumo é lido uma vez só (alerta + foco podem repetir em alguns leitores).
