import type { BuildHelperBundleOptions } from './types.ts';

import * as esbuild from 'esbuild';
import { denoPlugins } from '@luca/esbuild-deno-loader';
import $ from '@david/dax';

/**
 * Build helper.
 *
 * @example Basic usage
 * ```ts
 * const buildHelper = new BuildHelper();
 *
 * const bundleOptions = {
 *   minify: true,
 *   externals: ['package', 'jsr:*', 'npm:*', 'https:*', './node_modules/*'],
 * };
 *
 * const code = await buildHelper.bundle('src/main.ts', bundleOptions);
 *
 * await buildHelper.bundleFile('src/main.ts', 'dist/main.bundle.js', bundleOptions);
 *
 * await buildHelper.export('public', ['src/index.html', 'src/assets']);
 * ```
 */
export class BuildHelper {
  /**
   * Creates a new instance of the BuildHelper class.
   */
  constructor() {}

  /**
   * Bundles the scripts into a single package.
   *
   * @param entryPoint - The entry point to bundling.
   * @param options - The options for bundling.
   *
   * @returns The bundled script code.
   */
  async bundle(
    entryPoint: string,
    options: Partial<BuildHelperBundleOptions> = {},
  ): Promise<string> {
    try {
      const result = await esbuild.build({
        plugins: [...denoPlugins()],
        entryPoints: [entryPoint],
        write: false,
        bundle: true,
        platform: 'neutral',
        format: 'esm',
        target: 'esnext',
        minify: options.minify ?? false,
        sourcemap: false,
        treeShaking: true,
        external: options.externals ?? [],
      });

      return result.outputFiles[0].text;
    } catch (exception) {
      throw exception;
    } finally {
      await esbuild.stop();
    }
  }

  /**
   * Bundles the scripts into a single package and saves it as a file.
   *
   * @param entryPoint - The entry point to bundling.
   * @param outFile - The path to the output file.
   * @param options - The options for bundling.
   */
  async bundleFile(
    entryPoint: string,
    outFile: string,
    options: Partial<BuildHelperBundleOptions> = {},
  ): Promise<void> {
    const code = await this.bundle(entryPoint, options);
    await Deno.writeTextFile(outFile, code);
  }

  /**
   * Exports files and directories to the output directory.
   *
   * @param outDirectory - The path to the output directory.
   * @param includes - The files and directories that should be included.
   */
  async export(
    outDirectory: string,
    includes: Array<string> = [],
  ): Promise<void> {
    await $`rm -rf ${outDirectory}`;

    await $`mkdir -p ${outDirectory}`;

    for (const entry of includes) {
      await $`cp -r ${entry} ${outDirectory}`;
    }

    await $`ls -a ${outDirectory}`;
  }
}
