# Antwon Leslie site

Static site: plain HTML, CSS and JavaScript. Hosted on GitHub Pages. The contact form uses a Google Apps Script web app. Same approach as the Arcane Games site, minus Stripe and the inventory sheet.

## Files

| File | What it does |
| --- | --- |
| `config.js` | All content: clips, photos, sponsors, gear, goals, links. Edit this first. |
| `index.html` | Page structure |
| `styles.css` | Look and layout |
| `app.js` | Builds each section from `config.js`, plus the viewer and contact form |
| `apps-script/Code.gs` | Form backend that emails his inbox |
| `media/` | Put reels, photos, bloopers and sponsor logos here |

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit `localhost:8000`.

## Publish on GitHub Pages

1. Create a repo and push these files to the `main` branch.
2. Repo Settings > Pages > Deploy from branch > `main` / root.
3. Optional custom domain: add it under Pages, then point the DNS records at GitHub.

## Connect the contact form

1. Go to script.google.com while signed in to the Google account that should send the mail. A dedicated account for the site is a good idea.
2. New project. Paste in `apps-script/Code.gs`.
3. Set `OWNER_EMAIL` to the address that should receive messages. Optionally set `SHEET_ID` to log messages to a Google Sheet.
4. Deploy > New deployment > type Web app. Execute as: Me. Who has access: Anyone. Authorize when prompted.
5. Copy the web app URL into `formEndpoint` in `config.js`.
6. Submit a test message from the live site.

Notes:
- Free Google accounts can send roughly 100 emails per day through Apps Script. That is plenty for a personal site.
- The form has a hidden spam trap field and a one-message-per-minute limit per email address.
- Until `formEndpoint` is set, the form shows a preview-mode notice with a mailto fallback.

## Instagram scroller

The scroller uses Instagram's official post embeds, so visitors scroll posts on your page. Paste post or reel URLs into `instagram.posts` in `config.js`. New posts need a quick update, which is a good thing to offer as a maintenance service.

If he wants it to update by itself, a hosted feed widget such as Behold or Elfsight can do it (it typically needs a Business or Creator Instagram account and may have a free tier). Paste the widget's snippet into the Instagram section of `index.html`.

The Instagram link, and every other outside link, opens in a new tab.

## YouTube

The YouTube ID is the 11 characters after `youtu.be/` or `v=`, and it is case sensitive. The ID visible in the Facebook screenshot looked lowercased, so get the real link from him before using it.

## Media tips

- Use vertical MP4 (H.264) clips under about 15 MB each. GitHub Pages files are limited to 100 MB each, and the site works best with small files.
- Compress photos to about 1600 px wide before adding them.
- Get his permission before using any photo or clip, and credit the photographer or filmer when it is not him.

## Content to confirm with him

Everything in `config.js` that reads like copy (intro, mission statement, goals) is placeholder wording. He should rewrite it in his own voice. Gear brands, sponsors, hometown and stance were left blank on purpose rather than guessed.
