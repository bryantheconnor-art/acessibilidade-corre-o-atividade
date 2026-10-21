/**
 * Varredura automática de acessibilidade.
 *
 * Abre o HTML num Chromium headless, injeta o axe-core e imprime um relatório
 * legível em Markdown. Sempre termina com código 0: este teste é informativo e
 * não deve reprovar a entrega do aluno.
 *
 * Uso:  node .github/scripts/verificar-acessibilidade.mjs index.html
 *
 * Variável opcional: CHROME_PATH=/caminho/para/chrome
 */

import { chromium } from 'playwright';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const arquivo = process.argv[2] ?? 'index.html';

const IMPACTO = {
  critical: 'Crítico',
  serious: 'Grave',
  moderate: 'Moderado',
  minor: 'Leve',
};
const ORDEM = ['critical', 'serious', 'moderate', 'minor'];

function escapar(s) {
  return String(s).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const linhas = [];
const out = (s = '') => linhas.push(s);

let navegador;
try {
  const axePath = require.resolve('axe-core/axe.min.js');
  const axeSource = readFileSync(axePath, 'utf8');

  // CHROME_PATH permite apontar para um Chromium já instalado na máquina.
  // No GitHub Actions o navegador vem de `npx playwright install chromium`.
  const launchOpts = { args: ['--no-sandbox', '--disable-dev-shm-usage'] };
  if (process.env.CHROME_PATH) launchOpts.executablePath = process.env.CHROME_PATH;
  navegador = await chromium.launch(launchOpts);
  const pagina = await navegador.newPage();
  await pagina.goto(pathToFileURL(resolve(arquivo)).href, { waitUntil: 'load' });
  await pagina.addScriptTag({ content: axeSource });

  const resultado = await pagina.evaluate(async () =>
    await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
    })
  );

  const violacoes = resultado.violations.sort(
    (a, b) => ORDEM.indexOf(a.impact) - ORDEM.indexOf(b.impact)
  );
  const total = violacoes.reduce((s, v) => s + v.nodes.length, 0);

  if (violacoes.length === 0) {
    out('Nenhuma violação automática detectada pelo axe-core.');
  } else {
    out(`**${violacoes.length} tipos de problema, ${total} ocorrências no total.**`);
    out();
    out('| Gravidade | Problema | Ocorrências |');
    out('|---|---|---|');
    for (const v of violacoes) {
      out(`| ${IMPACTO[v.impact] ?? v.impact} | ${v.help} | ${v.nodes.length} |`);
    }
    out();
    out('<details><summary>Detalhes de cada ocorrência</summary>');
    out();
    for (const v of violacoes) {
      out(`### ${IMPACTO[v.impact] ?? v.impact} — ${v.help}`);
      out();
      out(v.description);
      out();
      out(`Referência: <${v.helpUrl}>`);
      out();
      for (const n of v.nodes.slice(0, 8)) {
        out('```html');
        out(escapar(n.html).slice(0, 400));
        out('```');
        const motivo = [...n.any, ...n.all, ...n.none].map((c) => c.message).filter(Boolean);
        if (motivo.length) out(`Motivo: ${motivo[0]}`);
        out();
      }
      if (v.nodes.length > 8) out(`_...e mais ${v.nodes.length - 8} ocorrência(s)._\n`);
    }
    out('</details>');
  }

  const inaplicaveis = resultado.incomplete?.length ?? 0;
  if (inaplicaveis > 0) {
    out();
    out(`> O axe marcou ${inaplicaveis} item(ns) como "precisa de revisão manual" — ele não`);
    out('> conseguiu decidir sozinho. Vale olhar esses casos no checklist.');
  }
} catch (erro) {
  out('A varredura automática não pôde ser concluída.');
  out();
  out('```');
  out(String(erro && erro.message ? erro.message : erro));
  out('```');
  out();
  out('Isso é um problema da ferramenta, não da sua entrega. Siga pelo `CHECKLIST.md`.');
} finally {
  if (navegador) await navegador.close();
}

console.log(linhas.join('\n'));
process.exit(0);
