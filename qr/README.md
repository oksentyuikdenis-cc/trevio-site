# QR codes

Generated with the system CoreImage encoder — no service, no network, no
third party that can expire the code later. Both were verified by decoding
them back with `tools/read-qr.swift`, not by trusting the input.

| File | Points at | Which site |
|---|---|---|
| `trevio-v2-site.png` | `https://oksentyuikdenis-cc.github.io/trevio-site/` | **v2** — the current landing page |
| `trevio-v1-site.png` | `https://oksentyuikdenis-cc.github.io/trevio-site-v1/` | v1 — the archived first version |

900×900, error correction level **H**: survives a fold, a logo overlay, a bad
projector, and a phone camera held at an angle across a room.

> The v2 code is the same URL the original QR encoded, so anything already
> printed or embedded in the deck stays valid — as long as v2 is what ends up
> deployed to `trevio-site`. That is the whole reason for putting the new site
> on the existing repository rather than a new one.

## Regenerating

```bash
swift tools/make-qr.swift "<url>" qr/<name>.png 900
swift tools/read-qr.swift qr/<name>.png   # confirm what actually went in
```

## Neither code works until the site is deployed

A QR is just a URL. `trevio-site` currently still serves the previous
Pulse-branded build, and `trevio-site-v1` does not exist yet. See `DEPLOY.md`.
