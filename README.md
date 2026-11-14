# Sketch Fury for iOS

Standalone iPhone/iPad build repository for the Sketch Fury Capacitor app.
The game and mobile screens load from **https://sketchfury.com/app**; the main game
source remains in [compsmart/sketchfury](https://github.com/compsmart/sketchfury).

| Setting | Value |
| --- | --- |
| Bundle identifier | `com.sketchfury.app` |
| Apple team | Compsmart Ltd (`64V9USNANZ`) |
| Xcode project | `ios/App/App.xcodeproj` |
| Shared scheme | `App` |
| Version | `1.0.0` |
| Minimum iOS | 15.0 |
| Devices | iPhone and iPad |

## Connect to Codemagic

1. Add `compsmart/sketchfury-ios` as an app in Codemagic and select **Other** / the
   `codemagic.yaml` configuration if asked for the project type. Use branch `main`.
2. Run **iOS simulator - compile check** (`ios-simulator`) first. This needs no Apple
   signing credentials. It compiles the native app and produces a simulator ZIP and
   build log. It does not run device tests or create an installable iPhone IPA.
3. For a signed build, add an Apple Developer Portal integration named
   **`sketchfury-app-store`** in Codemagic using the App Store Connect API key.
   Store the private key in Codemagic's integration settings, never in this repo.
4. In Codemagic's code signing settings, upload or fetch an Apple Distribution
   certificate and App Store provisioning profile for `com.sketchfury.app`.
   Apple's developer agreement must be accepted and the bundle ID and App Store
   Connect app record must exist before signing/upload can complete.
5. Run **iOS signed build - upload to App Store Connect** (`ios-app-store`). It
   creates an IPA and uploads it to Apple for processing/internal TestFlight testing.
   It does not submit for external beta review or production App Review.

Both workflows are manual/API-triggered and use a Mac M2, Node 22 and the latest
stable Xcode offered by Codemagic. Build duration is capped at 60 minutes. The signed
workflow uses Codemagic's project build counter plus one. If the Codemagic app is
recreated or another system uploads newer builds, adjust the build-number offset
before uploading again.

The API workflow IDs are `ios-simulator` and `ios-app-store`. After connecting the
repository, a Codemagic API token and the Codemagic app ID allow build automation.
Keep the token in a secret manager/local environment, not in source control.

## Local preparation

Requires Node 22 or later. From this repository's root:

```sh
npm ci
npm run ios:prepare
```

This regenerates the offline page, copies the included artwork, and syncs native
plugins. Everything required is in this repository; no Android SDK or other local
checkout is needed. Generated web assets, dependencies, and signing files are ignored.

On a Mac, `npm run ios:open` opens Xcode. Use scheme `App` to run on a simulator or
signed device. See [IOS.md](IOS.md) for the remaining release checklist.

## Current validation and limitations

The initial repository was prepared on Windows. Dependency installation, Capacitor
sync, and static project/asset checks pass. Codemagic's first simulator build on
14 November 2026 succeeded using the iOS 26.5 Simulator SDK. The downloaded app
bundle contains the expected native plugins, branding, and offline page. This
confirms compilation. The signed workflow also built version 1.0.0 (3), and Apple
accepted and processed the upload without errors. Build 3 is **Testing** in the
`Sketch Fury Internal` TestFlight group, with the account holder invited.
The developer tested build 3 through TestFlight and confirmed it works. Version
1.0.0 (3) was submitted for production App Review on 14 November 2026 and is
**Waiting for Review**, with automatic release after approval. The listing is free,
public, rated 13+, and includes five screenshots each for iPhone and iPad.
See [store/RELEASE.md](store/RELEASE.md) for the release record.

- [App Store Connect](https://appstoreconnect.apple.com/apps/6834948397/distribution)
- [Signed Codemagic build](https://codemagic.io/app/6af8e63ef5a6f6afa552435a/build/6af8ed2790e83b09c4fa6231)

Apple signing uses integration `sketchfury-app-store`, certificate
`sketchfury-distribution`, and profile `sketchfury-app-store-profile`. They are saved
in Codemagic; no signing secrets belong in this repository.

Push notifications are deliberately disabled until Firebase Messaging/APNs are
configured and tested. The drawing/queue/game screens remain available without push.
Do not claim notification support in the iOS store listing before completing setup.

This repository is an independent copy of the iOS shell. Changes to native files in
the main game's `mobile/` directory are not automatically copied here. Hosted game
changes deploy separately from the main repository.

## References

- [Codemagic Capacitor builds](https://docs.codemagic.io/yaml-quick-start/building-an-ionic-app/)
- [Codemagic signing](https://docs.codemagic.io/yaml-code-signing/signing-ios/)
- [Codemagic build API](https://docs.codemagic.io/rest-api/builds/)
