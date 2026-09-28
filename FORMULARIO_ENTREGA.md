# Formulário de Entrega da Atividade

> **Instruções:** Copie todo o conteúdo abaixo e cole no corpo do seu Pull Request no GitHub (ou no formulário de entrega).

---

## Identificação

- **Nome completo:** Bryan Connor
- **Usuário GitHub:** bryantheconnor-art

## Link da página publicada

https://bryantheconnor-art.github.io/acessibilidade-corre-o-atividade/

- [x] Abri o link acima numa aba anônima e ele mostra a minha versão corrigida.

## Problemas corrigidos

### 1. Apresentação vs. semântica

- **"as melhores marcas":** Estava marcado com a tag visual `<b>` e foi substituído por `<strong>`, informando ao leitor de tela que o trecho possui real importância semântica.
- **"garantia estendida":** Estava com `<i>` e foi substituído por `<em>`, atribuindo ênfase apropriada que tecnologias assistivas podem modular por entonação vocal.
- **"política de trocas":** Utilizava `<u>` puramente decorativo, que induzia o usuário a acreditar ser um link clicável; foi reestruturado de forma clara e contextualizado com o link oficial.
- **"Categorias em destaque":** Estava em `<font size="6">` (tag obsoleta para controle visual); foi substituído por cabeçalho semântico `<h2>` com formatação controlada via CSS.

### 2. Hierarquia de cabeçalhos

- **"Loja de Instrumentos":** Era uma `<div class="h1-falso">` e foi convertida no único `<h1>` principal da página, estabelecendo o título raiz de maior hierarquia.
- **"Guitarras", "Baterias", "Comparativo de modelos", "Fale com um vendedor":** Estavam com níveis misturados e inconsistentes (`<h3>` e `<h2>`); foram todos padronizados em `<h2>`.
- **"Guitarras Elétricas" e "Bateria Eletrônica":** Usavam `<h6>` (pulando do h2 direto para h6); foram corrigidos para `<h3>` respeitando a ordem hierárquica (h1 → h2 → h3) sem pular níveis.

### 3. Landmarks

- **Skip-link:** Foi adicionado o link `<a class="skip-link" href="#conteudo">` logo no início do `<body>`, permitindo pular os blocos de cabeçalho e menu direto ao conteúdo principal com uma tecla.
- **Cabeçalho:** A estrutura em tabelas e divs foi substituída pelo landmark `<header id="topo">`.
- **Menu e Trilha:** Foram envolvidos em landmarks `<nav id="menu" aria-label="Menu principal">` e `<nav id="trilha" aria-label="Trilha de navegação">` para que o leitor de tela distinga as duas navegações.
- **Conteúdo Principal:** Envelopado em `<main id="conteudo" tabindex="-1">`.
- **Barra Lateral:** Marcada com `<aside class="lateral" aria-label="Conteúdo relacionado">`.
- **Rodapé:** Marcado com o landmark `<footer>`.
- **Idioma:** Declarado atributo `lang="pt-br"` na tag raiz `<html>`.

### 4. Tabelas

- **Tabelas de Layout:** As tabelas usadas apenas para diagramação do cabeçalho e menu foram completamente removidas e substituídas por flexbox em CSS.
- **Título da Tabela:** A tabela de dados recebeu `<caption>Comparativo de guitarras elétricas por captadores, escala e preço</caption>`.
- **Células de Cabeçalho:** Células `<td>` foram substituídas por `<th scope="col">` para colunas e `<th scope="row">` para o modelo da linha, vinculando programaticamente cada célula de dado ao seu respectivo cabeçalho.

### 5. Links e botões

- **Links com texto genérico:** Textos vagos como "clique aqui", "saiba mais" e "aqui" foram substituídos por âncoras descritivas ("política de trocas", "Saiba mais sobre baterias", "Aprenda a afinar sua guitarra").
- **Avisos de nova aba:** Links externos com `target="_blank"` receberam aviso explícito `(abre em nova aba)` e `rel="noopener"`.
- **Ícone do carrinho:** Recebeu `aria-label="Ver carrinho de compras"` no link e `alt=""` decorativo na imagem SVG.
- **Falsos botões:** As divs `<div class="botao" onclick="adicionarCarrinho(...)">` eram inalcançáveis pelo teclado (Tab) e foram substituídas por links/botões interativos com texto acessível único por produto.
- **Envio do formulário:** O link `<a href="#" onclick="enviarFormulario()">` foi substituído por `<button type="submit" class="botao">Enviar</button>`.

### 6. Listas

- **Menu de navegação:** As tags `<span><a>` soltas foram transformadas em uma lista não ordenada `<ul>` com `<li>`.
- **Trilha de navegação (breadcrumb):** Convertida para uma lista ordenada `<ol>` com `<li>`, indicando a página atual com `aria-current="page"`.
- **Lista de categorias:** Itens simulados com texto corrido e `<br>` foram convertidos para uma lista semântica `<ul>` e `<li>`.

### 7. Formulário

- **Rótulos (Labels):** Todos os campos de texto, e-mail, senha e telefone receberam `<label for="...">` devidamente associados via `id`.
- **Obrigatoriedade:** Campos obrigatórios receberam o atributo nativo `required` e identificação textual `(obrigatório)` com `<span class="marcador-obrigatorio" aria-hidden="true">*</span>`.
- **Mensagens de erro:** As mensagens genéricas "Erro." foram substituídas por textos explicativos e ligadas programaticamente aos campos via `aria-describedby="erro-email"` e `aria-describedby="erro-senha"`.
- **Agrupamento de rádio e checkbox:** As opções de turno de contato e interesses foram agrupadas em `<fieldset>` com seus respectivos títulos em `<legend>`.
- **Atributos adicionais:** O campo de senha recebeu `autocomplete="new-password"` e `minlength="8"`.

## Testes que eu fiz

- [x] Percorri a página inteira **só com o teclado** (Tab) e alcancei todos os controles
- [x] Testei com leitor de tela (NVDA / VoiceOver / Orca)
- [x] Passei a página pelo validador do W3C (100% aprovado, 0 erros e 0 avisos)
- [x] Comparei o visual com a versão original e o layout continua equivalente

**Quantos cabeçalhos, links e landmarks o leitor de tela listou antes e depois?**

- **Antes:** 0 landmarks semânticos, 1 cabeçalho real (fora de ordem), links com nomes genéricos "clique aqui", botões inalcançáveis no leitor de tela.
- **Depois:** 5 landmarks (`header`, `nav` principal, `nav` trilha, `main`, `aside`, `footer`), 1 `h1` bem definido e 9 `h2`/`h3` em ordem hierárquica perfeita, todos os links com rótulos únicos e informativos.

## Dúvidas ou observações

- A URL da página corrigida publicada no GitHub Pages corresponde exatamente ao repositório `acessibilidade-corre-o-atividade`, acessível em: `https://bryantheconnor-art.github.io/acessibilidade-corre-o-atividade/`.
- Todos os erros apontados no validador Nu HTML do W3C e no html-validate foram corrigidos.
