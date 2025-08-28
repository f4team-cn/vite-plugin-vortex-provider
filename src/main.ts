import type { PluginOption, ResolvedConfig } from 'vite';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createWriteStream } from 'node:fs';
import archiver from 'archiver';

export type ProviderManifest = {
  id: string;
  name: string;
  description: string;
  author: string;
  version: [number, number, number];
  index: string;
  window?: [number, number];
  permission: string[];
  [key: string]: any;
};

/**
 * Vortex Provider 插件
 */
export default function vortexProviderPlugin(manifest: ProviderManifest): PluginOption {
  let resolvedOutDir: string = '';

  return {
    name: 'vite-plugin-vortex-provider',
    apply: 'build',

    configResolved(config: ResolvedConfig) {
      resolvedOutDir = config.build.outDir;
      console.log(
        `[vite-plugin-vortex-provider] Build output directory resolved: ${resolvedOutDir}`,
      );
    },

    async writeBundle(options) {
      try {
        const outDir = options.dir || resolvedOutDir || 'dist';
        const manifestPath = resolve(outDir, 'manifest.json');

        console.log(`[vite-plugin-vortex-provider] Writing manifest.json to: ${manifestPath}`);
        await writeFile(manifestPath, JSON.stringify(manifest, null, 4), 'utf-8');
        console.log('[vite-plugin-vortex-provider] manifest.json successfully written');
      } catch (err) {
        console.error('[vite-plugin-vortex-provider] Failed to write manifest.json:', err);
      }
    },
    async closeBundle() {
      try {
        if (!resolvedOutDir) {
          console.warn(
            '[vite-plugin-vortex-provider] ⚠️ outDir not resolved, skipping provider packaging.',
          );
          return;
        }
        const zipFileName = `${manifest.name}.zip`;
        const zipPath = resolve(resolvedOutDir, zipFileName);
        console.log(`\n🚀 [vite-plugin-vortex-provider] Creating provider: ${manifest.name}`);
        const output = createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        output.on('close', () => {
          const sizeKB = (archive.pointer() / 1024).toFixed(2);
          console.log(
            `✅ Provider packaged successfully!\n` +
              `  📦 Provider: ${manifest.name}\n` +
              `  💾 Size: ${sizeKB} KB\n` +
              `  📄 Total bytes: ${archive.pointer()}`,
          );
        });
        // 错误日志
        archive.on('error', (err) => {
          console.error(
            `[vite-plugin-vortex-provider] ❌ Error packaging provider: ${manifest.name}`,
            err,
          );
          throw err;
        });
        archive.pipe(output);
        archive.directory(resolvedOutDir, false); // 不包含父目录
        await archive.finalize();
      } catch (err) {
        console.error(
          `[vite-plugin-vortex-provider] ❌ Failed to package provider: ${manifest.name}`,
          err,
        );
      }
    },
  };
}
