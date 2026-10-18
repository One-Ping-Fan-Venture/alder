# Changelog

## 2026-10-18

Hosted the Alder demo on Cloudflare Pages.

### Pages project `alder`

- Connected the project to GitHub `One-Ping-Fan-Venture/alder`.
- Production branch is `main`. Preview deploys are enabled for every branch, and pull-request comments are on.
- Build command is `npx next build`. Output directory is `out`. Root directory is the repository root.
- `NODE_VERSION` is `22` for production and preview.
- Cloudflare assigned the project hostname `alder-6n8.pages.dev`.

### Production deployment

- Deployment `445a18ae` built `main` at `70308fe`, the merge of pull request #1.
- The queued, initialize, clone, build, and deploy stages succeeded.
- The build used the commit already on `main`. No local files were uploaded.

### Custom domain

- Attached `alder.onepingfanventure.com` to the Pages project after that deployment succeeded.
- Pages registered the hostname, then reported `CNAME record not set` and did not create the DNS record.
- Added one proxied CNAME: `alder.onepingfanventure.com` to `alder-6n8.pages.dev`. The hostname was already registered before this record existed.
- Left these records unchanged: the apex and `www` CNAMEs to `he-engineer.github.io` (not proxied), the three MX records, the SPF TXT record, and the Google site-verification TXT record.
- `mileclerk-site` and `tribridge-capital-site` were not edited.
- An unsigned request to `https://alder.onepingfanventure.com` returns `401` with a Basic prompt for realm `Alder`. The demo account receives the site.
