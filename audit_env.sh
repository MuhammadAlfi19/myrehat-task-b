#!/usr/bin/env bash
set -euo pipefail

# This script prints statuses and KEY NAMES only, never environment values.
cd "$(dirname "$0")"
errors=0

echo '== Expected environment files =='
for file in apps/web/.env apps/server/.env apps/web/.env.local apps/server/.env.local; do
  if [[ -f "$file" ]]; then echo "PRESENT: $file"; else echo "MISSING: $file"; fi
done

echo
echo '== Secret-key shape of committed dummy environment files =='
for file in apps/web/.env apps/server/.env; do
  if [[ ! -f "$file" ]]; then continue; fi
  echo "FILE: $file"
  sed -nE 's/^[[:space:]]*([A-Za-z_][A-Za-z_0-9]*)=.*/  KEY: \1/p' "$file"
done

echo
echo '== Placeholder checks for committed dummy files =='
for item in 'apps/server/.env:BETTER_AUTH_SECRET' 'apps/server/.env:DATABASE_URL'; do
  file=${item%%:*}; key=${item##*:}
  if [[ ! -f "$file" ]]; then errors=1; continue; fi
  val=$(sed -nE "s/^${key}=(.*)$/\1/p" "$file" | tail -1)
  case "$val" in
    placeholder*|dummy*|example*|changeme*|not-a-real-*) echo "PASS: $key uses a placeholder-like value" ;;
    *) echo "REVIEW REQUIRED: $key does not appear to be a placeholder"; errors=1 ;;
  esac
done

echo
echo '== Git tracked/staged secrets (if Git initialized) =='
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  for file in apps/web/.env.local apps/server/.env.local; do
    if git ls-files --cached --error-unmatch "$file" >/dev/null 2>&1; then
      echo "FAIL: $file is indexed in Git"
      errors=1
    else
      echo "PASS: $file is not indexed in Git"
    fi
  done
  echo 'Check ignored local env files:'
  git check-ignore apps/web/.env.local apps/server/.env.local || true
else
  echo 'Git is not initialized; run again after git init and git add.'
fi

echo
echo 'Manual review required: confirm all .env dummy values are non-secret; do not print them here.'
exit "$errors"
