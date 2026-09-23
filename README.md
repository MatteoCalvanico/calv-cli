# CALV-CLI

CLI personale interattiva scritta in TypeScript. Al momento offre uno scheletro per le funzioni future e una sola voce di menu: **WORK IN PROGRESS**.

L’avvio in un terminale interattivo mostra il logo CALV-CLI con dissolvenza ed esplosione ASCII. Premi `Esc` per saltare l’animazione.

## Avvio locale

Richiede Node.js 24, npm e Bun.

```bash
npm install
npm run dev
```

## Preparare il pacchetto npm

```bash
npm run typecheck
npm run build
npm pack --dry-run
npm pack
```

`npm pack` esegue anche `prepack`, che ripete typecheck e build. Il campo `bin` espone il comando `calv` dal bundle `dist/calv.js`. Per provarlo localmente:

```bash
npm install --global ./calv-cli-0.1.0.tgz
calv
```

Prima di pubblicarlo su npm, scegli un nome di pacchetto disponibile, aggiorna versione e licenza in `package.json`, quindi esegui `npm login` e `npm publish`.
