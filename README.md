# Velvet Glitter Wedding Invitation

A mobile-first digital wedding invitation with:

- **Opening animation**: a wall of red glitter. Guests tap it (or blow into the microphone) and the glitter falls away. Velvet curtains then open onto the couple in a spotlight, and the names write themselves in gold.
- **Background music**: starts on that first tap, with a floating play/pause button.
- **Sections**: story, save the date (live countdown and a calendar with a heart on the day), optional program, venue with a Google Maps button, RSVP (WhatsApp, email or an online form) and a closing note.
- **Dashboard** (`admin.html`): edit every text, photo, color, font, the music and the RSVP settings, with a live phone preview. Publish to GitHub in one click.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The invitation guests open |
| `admin.html` | The dashboard (only you use it) |
| `config.js` | All content: texts, photo paths, music, colors. The dashboard writes this file |
| `assets/css`, `assets/js` | Styles and scripts |
| `assets/media` | Default pictures (glitter, stage, venue, silk, velvet) |
| `assets/music/waltz.mp3` | Default music: an original music-box waltz made for this project |
| `assets/uploads` | Photos, music and videos you upload through the dashboard |
| `kasper/` | The previous practice website (unchanged) |

## Editing with the dashboard

1. Open `admin.html` (for example `https://<user>.github.io/My-Third-WebSite/admin.html`).
2. Change texts and upload your photos and song. The preview updates live, and your changes are saved automatically **in this browser**.
3. **Publish & backup → Publish to GitHub**. Create a *fine-grained personal access token* for this repository with **Contents: Read and write** and paste it once. The dashboard commits your uploads to `assets/uploads/` and the new `config.js`. GitHub Pages updates within a minute or two.

Use **Download backup** to keep a copy of everything, uploaded files included, or to continue on another computer.

## Putting it online (GitHub Pages)

Repository **Settings → Pages → Deploy from a branch → `main` / root**. The invitation is then served at `https://<user>.github.io/My-Third-WebSite/`.

The "blow on the glitter" microphone button only appears on `https://` pages, which GitHub Pages provides.

## RSVP options

- **WhatsApp**: put your number with country code (e.g. `201001234567`). The guest's reply opens in WhatsApp, ready to send to you.
- **Email**: opens the guest's mail app with the answer filled in.
- **Online form**: paste a [Formspree](https://formspree.io) form URL or a Google Apps Script web-app URL to collect answers in one place.

## Note about the default pictures

The default stage, glitter, venue, silk and velvet pictures come from the reference design you supplied. Replace them with your own photos in the dashboard before sharing the invitation publicly.
