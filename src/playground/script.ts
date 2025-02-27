import { Playground } from './Playground.ts';

document.querySelector('[data-action="code.run"]')?.addEventListener('click', async () => await Playground.code.run());
document.querySelector('[data-action="code.clear"]')?.addEventListener('click', () => Playground.code.clear());
document.querySelector('[data-action="preview.clear"]')?.addEventListener('click', () => Playground.preview.clear());
document.querySelector('[data-action="logs.clear"]')?.addEventListener('click', () => Playground.logs.clear());

// @ts-ignore because globalThis.playground has no type definition
globalThis.Playground = Playground;
