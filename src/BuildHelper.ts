import type { BuildHelperBundleOptions } from './types.ts';

import * as esbuild from 'esbuild';
import { denoPlugins } from '@luca/esbuild-deno-loader';
import $ from '@david/dax';

/**
 * Build helper class.
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
export default class BuildHelper {
  /**
   * Creates a new instance of the BuildHelper class.
   */
  constructor() {}

  /**
   * Bundles the scripts.
   *
   * @param entryPoint - The entry point to bundle.
   * @param options - The bundle options.
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
   * Bundles the scripts and write the result to a file.
   *
   * @param entryPoint - The entry point to bundle.
   * @param outFile - The output file path.
   * @param options - The bundle options.
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
   * Exports the files and directories to a directory.
   *
   * @param outDirectory - The output directory.
   * @param includes - The files and directories to include.
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
