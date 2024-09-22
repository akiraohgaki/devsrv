import type { BuildHelperBundleOptions } from './types.ts';

import { bundle } from '@deno/emit';
import $ from '@david/dax';

/**
 * Build helper class.
 *
 * @example
 * ```ts
 * const buildHelper = new BuildHelper();
 *
 * const code = await buildHelper.bundle('src/main.ts', { minify: true });
 *
 * await buildHelper.bundleFile('src/main.ts', 'dist/main.bundle.js', { minify: true });
 *
 * await buildHelper.export('public', ['src/index.html', 'src/assets']);
 * ```
 */
export default class BuildHelper {
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
    const result = await bundle(entryPoint, {
      minify: false,
      ...options,
    });
    return result.code;
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