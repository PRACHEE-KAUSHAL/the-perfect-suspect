# THE PERFECT SUSPECT — Render-ready multiplayer game

A dark 2–8 player social-deduction mystery set at Blackwood Manor. Players join from separate devices using a five-character room code. A match has three rounds, private dossiers, public evidence, live discussion chat, accusations, reveals, cumulative scores, and a final winner.

## Deploy on Render (browser-based setup)

1. Create or sign in to GitHub and create a **new public repository** named `the-perfect-suspect`.
2. Open the repository and choose **Add file → Upload files**.
3. Extract this ZIP on your computer. Open the extracted `the-perfect-suspect` folder and upload its contents (not the enclosing folder) to GitHub. Keep the folder structure intact. Commit the upload.
4. Open https://dashboard.render.com/ and choose **New → Web Service**.
5. Connect GitHub, select `the-perfect-suspect`, and use these settings:
   - Runtime: **Node**
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Instance type: Free (for a first test)
6. Click **Create Web Service** and wait for the deploy to finish. Render will provide a public `*.onrender.com` URL.
7. Open the URL on two separate devices. One player creates a room; the other joins with the five-character code. Start with at least two players.

## Important hosting note

This beginner-friendly Render edition stores active rooms in the running server's memory. It supports simultaneous players across devices while the service is running, but room state is cleared if the server restarts or sleeps. Render's free web services can spin down after inactivity, so use this edition for a first live demonstration; for persistent rooms and reliable long-running matches, move to a persistent database and an always-on instance before public launch. Do not add multiple server instances with this in-memory store.

## Local development

Requires Node.js 22 or newer.

```bash
npm install
npm run build
npm start
```

Then open http://localhost:3000.

## Game rules

- 2–8 players join one room. The host starts the match.
- Each of three rounds assigns one player the Mastermind role; other players are Investigators.
- Read your private dossier. Evidence becomes public as the case advances. Discuss clues in room chat.
- During Final Accusation, each Investigator locks one suspect and up to three evidence clues. The Mastermind cannot vote.
- A majority of Investigators must identify the Mastermind to convict them. Scores are awarded each round and accumulated; highest total after round three wins.
- The host advances timed phases and starts the next round after each reveal.
