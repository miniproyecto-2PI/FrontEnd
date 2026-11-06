import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function asText(source: string | Uint8Array): string {
  return typeof source === 'string' ? source : new TextDecoder().decode(source)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Inlinea el CSS generado dentro de index.html para eliminar la hoja de
 * estilos externa que bloquea el primer render. Al ser una única página,
 * el coste de no cachear el CSS por separado es despreciable frente al
 * ahorro en el Critical Rendering Path.
 */
function inlineCriticalCss(): Plugin {
  return {
    name: 'inline-critical-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const html = bundle['index.html']
      if (!html || html.type !== 'asset') return

      for (const [fileName, asset] of Object.entries(bundle)) {
        if (asset.type !== 'asset' || !fileName.endsWith('.css')) continue

        const htmlSource = asText(html.source)
        const linkPattern = new RegExp(`<link[^>]*href="[^"]*${escapeRegExp(fileName)}"[^>]*>`)
        if (!linkPattern.test(htmlSource)) continue

        html.source = htmlSource.replace(linkPattern, `<style>${asText(asset.source)}</style>`)
        delete bundle[fileName]
      }
    },
  }
}

export default defineConfig({ plugins: [react(), tailwindcss(), inlineCriticalCss()] })
