# Setup tecnico

Il sito è generato con [Eleventy](https://www.11ty.dev/): i testi vivono in file JSON dentro `src/_data/`, i template in `src/`, e la build produce HTML statico in `_site/`. I gestori modificano i JSON tramite il pannello Decap CMS su `/admin`, Netlify ricompila a ogni salvataggio.

## Struttura

```
src/
  _data/          ← tutti i testi e le foto delle pagine (li scrive il pannello)
    site.json         recapiti validi su tutto il sito
    home.json         home page
    chisiamo.json     pagina Chi Siamo
    camere.json       camere, prezzi, bagni, colazione
    menu.json         piatti, spuntini, bevande
    galleria.json     elenco foto
    contatti.json     orari, indicazioni, mappa
  _includes/
    layout.njk    ← header, footer e <head> condivisi
  *.njk           ← una pagina per file
  src.11tydata.js ← titolo/descrizione Google presi da _data
admin/            ← pannello CMS (config.yml definisce i campi)
assets/           ← immagini, CSS, font Aniron, JS
```

## Lavorare in locale

```bash
npm install
npm run dev
```

Server su `http://localhost:8080` con ricarica automatica. Per la sola build: `npm run build`.

## Deploy

Netlify legge `netlify.toml`: build `npm run build`, publish `_site`. Ogni push su `main` — inclusi quelli fatti dal pannello CMS — fa partire un deploy.

## Attivazione del pannello (già fatto, qui per riferimento)

1. Netlify → **Site configuration → Identity → Enable Identity**
2. Identity → **Registration** → "Invite only"
3. Identity → **Services → Git Gateway → Enable**
4. Identity → **Invite users** → email dei gestori

## Aggiungere un campo modificabile dal pannello

Tre passaggi, in quest'ordine:

1. Aggiungi la chiave nel JSON in `src/_data/`
2. Usala nel template `.njk`
3. Dichiarala in `admin/config.yml` nella collection giusta

⚠️ **Il passaggio 3 non è opzionale.** Decap riscrive il file con i soli campi dichiarati nella config: una chiave presente nel JSON ma assente dalla config viene **cancellata** al primo salvataggio dal pannello, e la pagina si rompe.

Per verificare che config e dati combacino:

```bash
node -e "
const fs=require('fs'), yaml=require('js-yaml');
const c = yaml.load(fs.readFileSync('admin/config.yml','utf8'));
for (const col of c.collections) for (const f of (col.files||[])) {
  const dati = JSON.parse(fs.readFileSync(f.file,'utf8'));
  const dichiarati = new Set(f.fields.map(x=>x.name));
  const orfani = Object.keys(dati).filter(k=>!dichiarati.has(k));
  if (orfani.length) console.log(f.file, '→ verrebbero cancellati:', orfani.join(', '));
}
console.log('controllo finito');
"
```

## Note

- **Le voci dei piatti sono stringhe semplici**, non oggetti: è il formato che il widget `list` di Decap con un solo `field` produce naturalmente. Mescolare i due formati causava `undefined` in pagina; il template ha comunque un fallback per dati vecchi.
- **`--header-border` in `style.css`** tiene allineati il bordo dell'header e la posizione della nav mobile. Il posizionamento assoluto si calcola sul padding box (che esclude il bordo), quindi senza quella variabile il menu aperto si sovrappone al bordo dorato e si vedono due righe gialle.
- **Il widget Netlify Identity** è caricato solo sulla home, dove atterrano i link di invito e recupero password.
