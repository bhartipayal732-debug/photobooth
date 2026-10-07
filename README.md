# Photo Booth

React (Vite) client + Express server. Photos are saved to `server/uploads` and expire after 24 hours.

## Run (development)
```bash
# terminal 1 - server
cd server && npm install && cp .env.example .env && npm run dev
# terminal 2 - client
cd client && npm install && npm run dev      # open http://localhost:5173
```

## Make the QR code work on a phone
The QR encodes `PUBLIC_BASE_URL/photos/<id>.png`, so the phone must be able to reach that address.
- Same Wi-Fi: leave `PUBLIC_BASE_URL` empty (LAN IP is auto-detected and printed at server start) or set `http://<your-LAN-IP>:3001`.
- Anywhere: run `npx ngrok http 3001`, set `PUBLIC_BASE_URL=https://<your-id>.ngrok-free.app`, restart the server.
- Deploy (Render/Railway): `cd client && npm run build`, then `cd server && npm start`. The server serves the built app and photos on one port. Set `PUBLIC_BASE_URL` to the https URL. Free hosts have ephemeral disks, so photos can vanish on redeploy.

## Camera needs HTTPS or localhost
Browsers only allow getUserMedia on `https://` or `localhost`. Run the booth on localhost, or serve it over HTTPS (ngrok / deployed host). Opening `http://192.168.x.x:5173` on another device won't get camera access.

## Notes
- Safari doesn't support canvas `ctx.filter`: filters show in the preview but aren't baked into the saved image there. Chrome, Edge and Firefox work.
- Ideas: stickers, GIF mode, printing (`window.print()` with a print stylesheet), custom frame colours.
