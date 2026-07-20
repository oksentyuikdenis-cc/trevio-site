#!/usr/bin/env bash
#
# Publishes both sites and then proves both QR codes work.
#
#   v2 (current landing page) -> https://oksentyuikdenis-cc.github.io/trevio-site/
#   v1 (archived first build) -> https://oksentyuikdenis-cc.github.io/trevio-site-v1/
#
# Rebuilds both deploy trees from source every run, so it does not depend on
# anything left in /tmp from an earlier session. Safe to re-run: pushing an
# unchanged tree is a no-op, and the v1 repository is only created if it is
# missing.
#
#   bash tools/deploy-both.sh
#
set -euo pipefail

OWNER="oksentyuikdenis-cc"
REPO_V2="trevio-site"
REPO_V1="trevio-site-v1"
URL_V2="https://${OWNER}.github.io/${REPO_V2}/"
URL_V1="https://${OWNER}.github.io/${REPO_V1}/"

PROJECT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

say() { printf '\n\033[1m▸ %s\033[0m\n' "$1"; }
die() { printf '\n\033[31m✗ %s\033[0m\n' "$1" >&2; exit 1; }

# ---------- preflight ----------
say "Checking prerequisites"
command -v gh >/dev/null || die "gh is not installed"
command -v swift >/dev/null || die "swift is not available (needed to verify the QR codes)"
gh auth status >/dev/null 2>&1 || die "gh is not authenticated — run: gh auth login"
[ -f "$PROJECT/package.json" ] || die "cannot find the project at $PROJECT"
echo "ok — authenticated as $(gh api user -q .login)"

# ---------- v2: the current site, onto the existing repository ----------
say "Regenerating the QR board so the published copy is current"
( cd "$PROJECT" && python3 tools/make-board.py )

say "Preparing v2 from $PROJECT"
git clone -q "https://github.com/${OWNER}/${REPO_V2}.git" "$WORK/v2"

# Safety net: keep the currently published build reachable by tag.
if ! git -C "$WORK/v2" rev-parse -q --verify refs/tags/legacy-pulse-v1 >/dev/null 2>&1; then
  git -C "$WORK/v2" tag -a legacy-pulse-v1 -m "Site as published before the Trevio rebuild" HEAD
  git -C "$WORK/v2" push -q origin legacy-pulse-v1
  echo "tagged the existing build as legacy-pulse-v1"
else
  echo "restore point legacy-pulse-v1 already exists"
fi

# Replace the tree, keeping .git.
find "$WORK/v2" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
tar --exclude=node_modules --exclude=dist --exclude=.git --exclude=.planning \
    -cf - -C "$PROJECT" . | tar xf - -C "$WORK/v2"

say "Building v2 the way CI will"
( cd "$WORK/v2" && npm ci --silent && npm run build >/dev/null )
grep -q "Trevio" "$WORK/v2/dist/index.html" || die "v2 build does not look like the Trevio site"
echo "ok"

say "Pushing v2 -> $REPO_V2"
git -C "$WORK/v2" add -A
if git -C "$WORK/v2" diff --cached --quiet; then
  echo "already up to date"
else
  git -C "$WORK/v2" commit -q -m "Publish rebuilt Trevio landing page"
  git -C "$WORK/v2" push -q origin HEAD:main
  echo "pushed"
fi

# ---------- v1: the archived build, onto its own repository ----------
say "Preparing v1 from the legacy-pulse-v1 tag"
git clone -q --branch legacy-pulse-v1 "https://github.com/${OWNER}/${REPO_V2}.git" "$WORK/v1" 2>/dev/null
( cd "$WORK/v1" && git checkout -q -b main )

# The Pages base path is the repository name; leaving it as /trevio-site/
# would make every asset 404 at the new address.
sed -i '' "s|'/${REPO_V2}/'|'/${REPO_V1}/'|g" "$WORK/v1/vite.config.ts"
grep -q "/${REPO_V1}/" "$WORK/v1/vite.config.ts" || die "failed to repoint the v1 base path"

say "Building v1 to confirm the new base path resolves"
( cd "$WORK/v1" && npm ci --silent && GITHUB_PAGES=true npm run build >/dev/null )
grep -q "/${REPO_V1}/assets/" "$WORK/v1/dist/index.html" || die "v1 assets do not resolve under /${REPO_V1}/"
echo "ok"

say "Creating $REPO_V1 if it does not exist"
if gh repo view "${OWNER}/${REPO_V1}" >/dev/null 2>&1; then
  echo "already exists"
else
  gh repo create "${OWNER}/${REPO_V1}" --public \
    --description "Trevio landing page — archived first version"
  echo "created"
fi

say "Pushing v1 -> $REPO_V1"
git -C "$WORK/v1" remote set-url origin "https://github.com/${OWNER}/${REPO_V1}.git"
git -C "$WORK/v1" add -A
git -C "$WORK/v1" commit -q -m "Repoint base path for ${REPO_V1}" || true
git -C "$WORK/v1" push -q -u origin main --force
echo "pushed"

say "Enabling GitHub Pages for $REPO_V1 (workflow source)"
gh api -X POST "repos/${OWNER}/${REPO_V1}/pages" -f build_type=workflow >/dev/null 2>&1 \
  || gh api -X PUT "repos/${OWNER}/${REPO_V1}/pages" -f build_type=workflow >/dev/null 2>&1 \
  || echo "note: could not set Pages automatically — set it once in Settings > Pages > Source: GitHub Actions"

# ---------- wait, then prove it ----------
# Waiting for HTTP 200 is not enough: the previous build already answers 200,
# so a deploy that never ran at all looks identical to one that succeeded.
# Wait for the workflow run whose SHA matches what was just pushed.
wait_for_run() {
  local repo="$1" sha="$2"
  printf '  %s @ %s ' "$repo" "${sha:0:7}"
  for _ in $(seq 1 40); do
    local line status concl
    line=$(gh run list --repo "${OWNER}/${repo}" --limit 10 \
             --json headSha,status,conclusion \
             -q ".[] | select(.headSha==\"$sha\") | \"\(.status) \(.conclusion // \"-\")\"" 2>/dev/null | head -1)
    status=${line%% *}; concl=${line##* }
    if [ "$status" = "completed" ]; then
      echo " -> $concl"
      [ "$concl" = "success" ] || die "$repo deployment failed — see: gh run list --repo ${OWNER}/${repo}"
      return 0
    fi
    printf '.'
    sleep 15
  done
  die "$repo: no completed run for ${sha:0:7} after 10 minutes"
}

say "Waiting for both deployments to actually run"
wait_for_run "$REPO_V2" "$(git -C "$WORK/v2" rev-parse HEAD)"
wait_for_run "$REPO_V1" "$(git -C "$WORK/v1" rev-parse HEAD)"

say "Confirming both URLs serve the new build"
for url in "$URL_V2" "$URL_V1"; do
  printf '  %s ' "$url"
  for _ in $(seq 1 24); do
    code=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 10 "$url" || true)
    [ "$code" = "200" ] && break
    printf '.'
    sleep 10
  done
  echo "-> ${code:-timeout}"
done

# The board is the artifact meant to be handed to other people; if it did not
# publish, the whole point of hosting is missed.
printf '  %slinks/ ' "$URL_V2"
board=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 15 "${URL_V2}links/" || true)
echo "-> $board"
[ "$board" = "200" ] || echo "    note: the QR board did not publish — check public/links/index.html is committed"

say "Verifying the two QR codes against the two live sites"
fail=0
check() {
  local png="$1" expected="$2" label="$3"
  local decoded live_title
  decoded=$(swift "$PROJECT/tools/read-qr.swift" "$png" | awk -F'\t' '{print $3}')
  live_title=$(curl -s -L --max-time 15 "$decoded" | grep -o '<title>[^<]*</title>' | head -1)
  echo "  $label"
  echo "    code points at : $decoded"
  echo "    live page says : ${live_title:-<no title — not reachable>}"
  if [ "$decoded" != "$expected" ]; then echo "    ✗ code does not match the intended URL"; fail=1; return; fi
  if [ -z "$live_title" ]; then echo "    ✗ that URL is not serving anything yet"; fail=1; return; fi
  echo "    ✓"
}
check "$PROJECT/qr/trevio-v2-site.png" "$URL_V2" "v2 — current landing page"
check "$PROJECT/qr/trevio-v1-site.png" "$URL_V1" "v1 — archived first version"

if [ "$fail" -eq 0 ]; then
  printf '\n\033[32m✓ Both sites are live and both QR codes resolve to them.\033[0m\n'
  printf '  Scan each one with a phone to confirm end to end.\n\n'
else
  printf '\n\033[31m✗ Something is not right — see above.\033[0m\n'
  printf '  Pages can take a few minutes on a first deploy; re-running this script is safe.\n\n'
  exit 1
fi
