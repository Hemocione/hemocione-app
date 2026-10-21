#!/usr/bin/env bash
# Archives the iOS app and uploads it to App Store Connect.
# Run on macOS with Xcode signed in to the Hemocione team (JGY96PPKZK).
set -euo pipefail
cd "$(dirname "$0")/.."

yarn install --frozen-lockfile
yarn generate
npx cap sync ios

ARCHIVE="build/ios/App.xcarchive"
rm -rf "$ARCHIVE"
xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Release \
  -destination 'generic/platform=iOS' -archivePath "$ARCHIVE" -allowProvisioningUpdates archive
xcodebuild -exportArchive -archivePath "$ARCHIVE" -exportOptionsPlist ios/App/ExportOptions.plist \
  -exportPath build/ios/export -allowProvisioningUpdates
