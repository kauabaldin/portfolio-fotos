# Segurança e hardening — Guia rápido

Este repositório contém um site estático. Algumas medidas podem ser aplicadas no servidor e no fluxo de desenvolvimento para reduzir o risco de exposição de fotos sensíveis e ataques.

Recomendações imediatas (faça sempre):
- Nunca comitar fotos sensíveis no repositório; mova-as para um armazenamento privado (S3, Cloud Storage) e use URLs assinadas.
- Use HTTPS obrigatório (HSTS) no servidor de produção.
- Defina cabeçalhos HTTP de segurança via servidor (Nginx/Apache/IIS):
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (HSTS)
  - `Content-Security-Policy` (mais rígido que meta tag)
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Proteção de arquivos e diretórios:
- Desative listagem de diretórios no servidor (nginx: `autoindex off;`, Apache: `Options -Indexes`).
- Coloque fotos sensíveis em diretórios não publicamente acessíveis; sirva via backend/autenticação ou URLs assinadas.
- Proteja endpoints administrativos com autenticação forte, rate limiting e IP allowlists quando aplicável.

Boas práticas de desenvolvimento:
- Adicione `/tmp/` e pastas de exportação ao `.gitignore` (já incluído no repositório).
- Revise o histórico Git para garantir que imagens sensíveis não estejam em commits anteriores; remova-as com `git filter-repo` ou `git filter-branch` e reponha com atenção.
- Evite inline scripts/styles quando possível — facilita aplicar CSP estrito.
- Use dependabot ou varredura SCA para dependências (quando houver).

Exemplos de configuração (nginx):

server {
  listen 443 ssl;
  server_name example.com;
  root /var/www/portfolio-fotos;

  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
  add_header X-Frame-Options "DENY" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
  add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self' https://wa.me;" always;

  location / {
    try_files $uri $uri/ =404;
  }

  location ~ /tmp/ {
    deny all;
    return 403;
  }
}

Exemplo (Apache .htaccess) para negar acesso a `/tmp/`:

<IfModule mod_authz_core.c>
  <Directory "/var/www/portfolio-fotos/tmp">
    Require all denied
  </Directory>
</IfModule>

Resumo: implemente cabeçalhos via servidor, remova arquivos sensíveis do repositório e sirva fotos privadas por backend/autenticação ou URLs assinadas. Se quiser, eu posso gerar exemplos prontos de configuração para o seu servidor (Nginx/Apache/IIS) e varrer o repositório procurando arquivos grandes ou extensões de imagem committed.
