#!/usr/bin/env bash
# Builds the signed Android App Bundle for the Play Console.
# Needs android/keystore.properties (see docs/release-followups.md) and JDK 21+.
set -euo pipefail
cd "$(dirname "$0")/.."

test -f android/keystore.properties || { echo "android/keystore.properties not found" >&2; exit 1; }
yarn install --frozen-lockfile
yarn generate
npx cap sync android
(cd android && ./gradlew bundleRelease)
ls -la android/app/build/outputs/bundle/release/
