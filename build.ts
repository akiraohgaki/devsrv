import { BuildHelper } from './mod.ts';

// Build playground page.

const page = await Deno.readTextFile('./src/playground/page.html');
const style = await Deno.readTextFile('./src/playground/style.css');
const example = await Deno.readTextFile('./src/playground/example.js');

const buildHelper = new BuildHelper();
const script = await buildHelper.bundle('./src/playground/script.ts', { minify: true });

const playgroundPage = 'export default `' + page
  .replace('/* STYLE */', style)
  .replace('/* SCRIPT */', script)
  .replace('/* EXAMPLE */', example)
  .replaceAll('`', '\\`') +
  '`;\n';

await Deno.writeTextFile('./src/playground/page.ts', playgroundPage);
