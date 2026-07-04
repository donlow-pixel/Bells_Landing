# BELLS Institute Landing Page + Retell AI Voicebot

A static clone of the [bells.sg](https://bells.sg) homepage, wired up with a Retell AI voice assistant ("May"). Built as a hands-on example of embedding a Retell voice agent into a website, using two different integration methods.

## What's in here

| File / folder | Purpose |
|---|---|
| `index.html`, `styles.css`, `script.js` | Main landing page, with a custom voice button wired to Retell via a server-side access token |
| `server.js` | Express server: serves the static site locally and exposes `/get-access-token` (calls Retell's private API to start a web call) |
| `V2/index.html`, `V2/v2-script.js` | Alternate version using Retell's **embeddable public-key widget** (a `<script>` snippet, no backend call needed) |
| `images/` | Site images |
| `May_Knowledge_Base_Bells_Retell.pdf` | Source content used to configure the "May" agent's knowledge/prompt in the Retell dashboard (not read by the code at runtime) |
| `vercel.json` | Deployment config for Vercel |

## The two Retell integration patterns

**1. Main site (`index.html` + `server.js`) — private API key, server-side**
The voice button calls your own backend, which calls Retell's `create-web-call` API using a private `RETELL_API_KEY` + `RETELL_AGENT_ID`, and returns a short-lived access token to the browser. This keeps your real API key off the client. Requires running `server.js` (locally or deployed).

**2. `/V2` — public key, client-side widget**
Retell's widget script (`retell-widget-v2.js`) is dropped straight into the HTML with a public key and agent ID as `data-*` attributes. No backend needed — but the public key only works on domains you've explicitly allowed in the Retell dashboard (see below).

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your own Retell credentials (used only by the main site's server-side flow):
```
RETELL_API_KEY=your_private_api_key
RETELL_AGENT_ID=your_agent_id
```
Get these from the [Retell dashboard](https://dashboard.retellai.com): API key under **Billing/API Keys**, Agent ID from the **Agents** page (select your agent — it's shown at the top).

## Running locally

```bash
npm start
```
Then open:
- `http://localhost:3000` — main site (voice button, server-side token flow)
- `http://localhost:3000/V2` — public-key widget test page

Open it as an `http://` URL, not a `file://` path — the widget's domain check and the page's asset paths both need a real HTTP origin.

### Using the `/V2` public-key widget

1. In the Retell dashboard, create a **Public Key** and add `localhost` to its allowed domains (for local testing) and/or your real deployed domain (for production — note that `*.vercel.app` domains are rejected, since they're a shared hosting suffix; you'll need a custom domain for production use).
2. Edit `V2/index.html`, find the `<script id="retell-widget">` tag near the bottom, and replace the placeholder values:
   ```html
   data-voice-public-key="YOUR_PUBLIC_KEY"
   data-voice-agent-id="YOUR_VOICE_AGENT_ID"
   ```
   Public keys are designed to be client-visible, so it's fine to paste them directly into the HTML (no `.env` needed for this one).

## Deploying

This repo is set up for Vercel (`vercel.json` routes both `/` and `/V2`, plus `/get-access-token`). Import the repo in Vercel, then add `RETELL_API_KEY` and `RETELL_AGENT_ID` as environment variables in the project settings — `.env` itself is git-ignored and never deployed.

## Notes

- Never commit `.env` or real API keys — `.env.example` holds blank placeholders only.
- This is a visual/functional clone built for learning purposes, not affiliated with or endorsed by BELLS Institute.
