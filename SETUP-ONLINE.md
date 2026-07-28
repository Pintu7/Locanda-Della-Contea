# Setup tecnico

Il sito è generato con [Eleventy](https://www.11ty.dev/): i testi vivono in file JSON dentro `src/_data/`, i template in `src/`, e la build produce HTML statico in `_site/`. I gestori modificano i JSON tramite il pannello **Sveltia CMS** su `/admin`, Netlify ricompila a ogni salvataggio.

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

## Attivazione del pannello (fallo tu, una tantum)

Il pannello usa **Sveltia CMS** con backend **GitHub via il proxy OAuth di Netlify**: niente server custom da mantenere, ma i gestori devono avere un account GitHub (anche minimale, creato al volo con la loro email) ed essere collaboratori del repo.

1. **Crea un'app OAuth su GitHub**
   github.com → tue impostazioni account → **Developer settings → OAuth Apps → New OAuth App**
   - Homepage URL: `https://<tuosito>.netlify.app` (o il dominio definitivo)
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Salva Client ID e Client Secret.

2. **Collega l'app OAuth a Netlify**
   Netlify → sito → **Site configuration → General → OAuth** → sezione "Git provider" → **Install provider** → GitHub → incolla Client ID e Client Secret.

3. **Aggiungi i gestori come collaboratori del repo**
   GitHub → repo `Pintu7/Locanda-Della-Contea` → **Settings → Collaborators → Add people** → invita la loro email (se non hanno GitHub, ricevono un invito per crearlo).

4. Fatto. Su `/admin` cliccano "Sign In with GitHub".

Vedi [ISTRUZIONI-GESTORI.md](ISTRUZIONI-GESTORI.md) per la guida che ho scritto per loro.

## Aggiungere un campo modificabile dal pannello

Tre passaggi, in quest'ordine:

1. Aggiungi la chiave nel JSON in `src/_data/`
2. Usala nel template `.njk`
3. Dichiarala in `admin/config.yml` nella collection giusta

⚠️ **Il passaggio 3 non è opzionale.** Il pannello riscrive il file con i soli campi dichiarati nella config: una chiave presente nel JSON ma assente dalla config viene **cancellata** al primo salvataggio, e la pagina si rompe.

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

- **Perché Sveltia e non Decap CMS**: stessa struttura di `config.yml`, ma UI molto più curata (anteprima live, drag&drop). In cambio Sveltia ha eliminato il supporto al backend `git-gateway` (quello con login email+password via invito Netlify Identity), quindi il backend è passato a `github` — i gestori accedono con un account GitHub invece che con email+password.
- **Le voci dei piatti sono stringhe semplici**, non oggetti: è il formato che il widget `list` con un solo `field` produce naturalmente. Mescolare i due formati causava `undefined` in pagina; il template ha comunque un fallback per dati vecchi.
- **`--header-border` in `style.css`** tiene allineati il bordo dell'header e la posizione della nav mobile. Il posizionamento assoluto si calcola sul padding box (che esclude il bordo), quindi senza quella variabile il menu aperto si sovrappone al bordo dorato e si vedono due righe gialle.
