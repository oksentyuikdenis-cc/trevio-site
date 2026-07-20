# Deploying

Two sites, one URL each, one QR code each.

| | URL | Repository | Status |
|---|---|---|---|
| **v2** — current landing page | https://oksentyuikdenis-cc.github.io/trevio-site/ | `trevio-site` | **Live**, but running an older build — see below |
| **v1** — archived first version | https://oksentyuikdenis-cc.github.io/trevio-site-v1/ | `trevio-site-v1` | Not created yet |

## Run this

```bash
bash tools/deploy-both.sh
```

It rebuilds both trees from source, pushes v2, creates and pushes v1, waits
for both deployments, then **decodes both QR codes and checks each one
resolves to a live page**. It is safe to re-run: an unchanged tree is a no-op
and the v1 repository is only created if missing.

Requires `gh` to be authenticated (`gh auth status`).

## Why v2 needs redeploying

The published build is commit `6ddad39`, which predates three commits:

- `c814d5b` — **the scroll smoothness fix.** The live shader still has the
  per-leg `smoothstep` and no leg balancing, so the field still stalls
  mid-scroll and runs 1.65× faster through the first half. This is the thing
  that was reported as the animation jamming.
- `fc5272f` — QR removal from the CTA
- `d0bab0e` — the QR generator and both codes

You can confirm what is actually deployed at any time:

```bash
curl -s https://oksentyuikdenis-cc.github.io/trevio-site/assets/SignalEngine-*.js \
  | grep -c hypot     # 0 = old build, >0 = smoothness fix is live
```

## The QR codes

Both live in `qr/`, generated offline with the system CoreImage encoder and
verified by decoding them back. See `qr/README.md`.

The v2 code encodes the same URL the original one did, so anything already
printed or sitting in the deck stays valid.

The block is currently out of `src/sections/Cta.tsx`. To put it back once the
site is confirmed live, restore the `cta__qr` aside and
`import qr from '../assets/qr.png'`, copying `qr/trevio-v2-site.png` to
`src/assets/qr.png`.

## Rolling back

The original Pulse-branded build is tagged **`legacy-pulse-v1`** on the
remote:

```bash
git clone https://github.com/oksentyuikdenis-cc/trevio-site.git /tmp/rollback
cd /tmp/rollback && git revert --no-edit HEAD && git push origin main
```

Nothing was deleted — every earlier build is reachable by tag or by history.

## After deploying, check these

1. Title reads **"Trevio — your customers already told you what to build"**.
2. Scroll the first three sections: the field should move continuously, with
   no point where it stops and needs more scrolling to continue.
3. Scan both QR codes with a phone — they must land on two different sites.
4. Paste either URL into a chat app; the `og.png` preview should appear.
5. Open it on the machine you will actually present from.

## Why Node 22 in the workflow

Vite 8 requires `^20.19.0 || >=22.12.0`. `node-version: 20` resolves to the
latest 20.x, which is usually fine, but a runner on an older 20 patch would
fail the build. Pinning to 22 removes that class of failure.
