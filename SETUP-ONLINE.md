# Mettere online il sito + pannello di modifica

Passi una tantum, li fai tu (Andrea). Dopo questo setup i gestori useranno solo `/admin`.

## 1. Carica il codice su GitHub

```
gh repo create locanda-della-contea --private --source=. --remote=origin --push
```

(oppure crea il repo a mano su github.com e fai `git remote add origin <url>` + `git push -u origin main`)

## 2. Collega a Netlify

1. Vai su [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import an existing project" → GitHub → scegli il repo.
2. Build command: lascia vuoto. Publish directory: `.` (radice). Nessun build necessario, è tutto statico.
3. Deploy.

## 3. Attiva Identity + Git Gateway (serve per far funzionare il pannello /admin)

1. Nel pannello Netlify del sito → **Site configuration → Identity → Enable Identity**.
2. In Identity → **Registration**: imposta su "Invite only" (così solo chi inviti può accedere).
3. In Identity → **Services → Git Gateway → Enable Git Gateway**.
4. In Identity → **Invite users**: invita l'email dei gestori. Ricevono una mail, cliccano, impostano una password.

## 4. Verifica dominio

Di default Netlify dà un indirizzo tipo `nome-a-caso.netlify.app`. Da Site configuration → Domain management puoi collegare `locandadellacontea.it` quando pronti (basta cambiare i DNS presso il registrar attuale).

## Fatto

Da ora i gestori vanno su `https://<tuosito>.netlify.app/admin`, fanno login con l'email invitata, e modificano menù e foto da lì. Vedi [ISTRUZIONI-GESTORI.md](ISTRUZIONI-GESTORI.md).

Ogni salvataggio dal pannello aggiorna direttamente il sito online in 1-2 minuti, senza bisogno di te.
