/**
 * Integração para hospedagem na Hostinger (Apache/LiteSpeed).
 *
 * No fim do build grava:
 *  - dist/.htaccess: páginas sem ".html" (/cardapio), redirecionamentos 301 do site antigo,
 *    página 404, www → sem www, cabeçalhos de segurança e cache do HTML;
 *    (o HTTPS é forçado no hPanel: Segurança → SSL → Forçar HTTPS);
 *  - dist/_astro/.htaccess: cache de 1 ano para os arquivos com hash no nome.
 */
import type { AstroIntegration } from 'astro';
import { writeFile } from 'node:fs/promises';

export interface Redirecionamento {
  /** Caminho antigo, sem barra no começo. Ex.: 'cardapio-daruma-temaki-e-rolls' */
  de: string;
  /** Destino. Ex.: '/cardapio' */
  para: string;
}

const CAMINHO = /^[a-z0-9][a-z0-9/_.-]*$/i;

function regras301(lista: Redirecionamento[]): string {
  return lista
    .map((r) => {
      if (!CAMINHO.test(r.de) || !/^\/[a-z0-9/#_-]*$/i.test(r.para)) {
        throw new Error(`[hostinger] redirecionamento inválido: ${r.de} → ${r.para}`);
      }
      const de = r.de.replace(/[.]/g, '\\.').replace(/\/$/, '');
      return `RewriteRule ^${de}/?$ ${r.para} [R=301,L]`;
    })
    .join('\n');
}

function htaccess(dominio: string, redirecionamentos: Redirecionamento[]): string {
  const host = dominio.replace(/\./g, '\\.');
  return `# Gerado automaticamente no build (integrations/hostinger.ts). Não edite no servidor.
Options -MultiViews -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html

AddType image/avif .avif
AddType font/woff2 .woff2

<IfModule mod_rewrite.c>
RewriteEngine On

# www.${dominio} → ${dominio}
RewriteCond %{HTTP_HOST} ^www\\.${host}$ [NC]
RewriteRule ^ https://${dominio}%{REQUEST_URI} [R=301,L]

# Endereços do site antigo → páginas novas (astro.config.ts → redirecionamentos)
${regras301(redirecionamentos)}

# Páginas sem ".html": /cardapio → cardapio.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{DOCUMENT_ROOT}/$1.html -f
RewriteRule ^(.+?)/?$ $1.html [L]
</IfModule>

<IfModule mod_headers.c>
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
<FilesMatch "\\.html$">
Header set Cache-Control "public, max-age=0, must-revalidate"
</FilesMatch>
</IfModule>
`;
}

const CACHE_ASSETS = `# Arquivos com hash no nome: podem ficar em cache por 1 ano
<IfModule mod_headers.c>
Header set Cache-Control "public, max-age=31536000, immutable"
</IfModule>
`;

export function hostinger(opts: { dominio: string; redirecionamentos: Redirecionamento[] }): AstroIntegration {
  return {
    name: 'daruma:hostinger',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        await writeFile(new URL('.htaccess', dir), htaccess(opts.dominio, opts.redirecionamentos));
        await writeFile(new URL('_astro/.htaccess', dir), CACHE_ASSETS);
        logger.info(`.htaccess gerado (${opts.redirecionamentos.length} redirecionamentos 301)`);
      },
    },
  };
}
