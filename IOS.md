# Sketch Fury for iPhone and iPad

Preparation status (14 November 2026): Codemagic's first simulator build succeeded
with the iOS 26.5 Simulator SDK. The downloaded app bundle and build log were
verified. The bundle ID and App Store Connect app are registered with Apple.
Codemagic generated a signed version 1.0.0 (3), and Apple accepted the upload
without errors. Apple processed it, export compliance is complete, and the build
is **Testing** in the `Sketch Fury Internal` group. The account holder is invited.
The developer tested build 3 in TestFlight and confirmed it works. Version 1.0.0 (3)
was submitted for production App Review on 14 November 2026 and is **Waiting for
Review**, with automatic release after approval. See [store/RELEASE.md](store/RELEASE.md).

## Project

- Xcode project: `ios/App/App.xcodeproj`; shared scheme: `App`.
- Bundle ID: `com.sketchfury.app` (registered with Apple).
- Team: Compsmart Ltd, `64V9USNANZ`.
- Version: `1.0.0`, build `1`; minimum iOS: `15.0`; iPhone and iPad.
- The app loads `https://sketchfury.com/app` with a bundled offline error page.
- Includes existing Capacitor sharing, haptics, screen orientation, splash, and
  system-bar support. `FuryShell` supplies version/build information and keeps the
  display awake during play. iPad requires full screen for orientation locking.
- Camera/photo usage descriptions cover importing drawings. Test the actual WebKit
  file chooser on a device; this does not grant unrestricted photo-library access.
- App icon and launch logo reuse the existing Sketch Fury art.

From this repository root, on Windows or macOS:

```sh
npm ci
npm run ios:prepare
```

Preparation regenerates the offline page, copies branded assets, and syncs plugins.
Run it after `npm ci` on every clean build; generated web assets are not committed.
Do not run `cap add ios` again or overwrite the custom native project.

On a Mac with a currently accepted Xcode release (Apple requires Xcode 26/iOS 26
SDK or later as of this preparation):

```sh
npm run ios:open
```

Resolve Swift packages, select the Compsmart signing team, and build scheme `App`.
For an unsigned simulator compilation from this repository root:

```sh
xcodebuild -resolvePackageDependencies -project ios/App/App.xcodeproj -scheme App
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build
```

For distribution, create a signed Release archive on the build service and upload
it to App Store Connect. Increment `CURRENT_PROJECT_VERSION` for every upload.
Preserve the resolved Swift package lockfile after the first successful Mac build.

## Account and release work remaining

1. The Developer Program and App Store Connect agreements have been accepted.
   The active Free Apps Agreement now runs through 5 December 2027.
2. The App Store Connect record is `Sketch Fury: Draw & Fight`, Apple ID
   `6834948397`, SKU `sketchfury-ios`, English (UK). Free; Games / Action / Casual.
3. Codemagic is connected using integration `sketchfury-app-store`, certificate
   `sketchfury-distribution`, and profile `sketchfury-app-store-profile`.
   The certificate/profile expire 14 November 2027. The signed IPA built, uploaded,
   and processed successfully. Private signing files are not stored in this repo.
4. Finish push setup below before claiming Android notification parity.
5. For future regression testing, run on iPhone and iPad: launch, offline/retry, draw/import/send a sketch, queue,
   landscape play and portrait return, audio, share sheet, safe areas, suspend/resume,
   moderation reports, and online matches. Verify notifications on a real device.
6. Five screenshots each for iPhone and iPad are uploaded. They reuse the existing
   Play Store artwork depicting the shared app UI, preserved in Apple-sized layouts.
   These are reused promotional assets, not newly captured iOS device screenshots.
7. Privacy disclosures, age rating, content rights and review contact are complete.
   Check the release record for account-level EU trader verification status.
8. Build 1.0.0 (3) is submitted for App Review. Monitor Apple's response.

## Uploaded build and export compliance

- Build 1.0.0 (3) was built from commit `9f8e1ae8fc93359420886de24d1678873f5104b8`.
- [TestFlight build](https://appstoreconnect.apple.com/teams/b6a637f6-950b-4843-82c5-090f4cc88d74/apps/6834948397/testflight/ios/6fdbfbf4-f397-4dc2-8d87-dab552453b3d)
- Internal group `Sketch Fury Internal` has automatic distribution enabled.
- Export compliance for build 3 was answered in App Store Connect. The app uses
  Apple's system HTTPS/WebKit services and has no custom encryption implementation.
  `ITSAppUsesNonExemptEncryption = false` is now set for future builds; that plist
  addition is newer than build 3. Revisit this declaration if encryption use changes.
- Production App Review submission completed on 14 November 2026. No external
  beta review was needed for the account holder's internal TestFlight test.

## Push notifications are pending

The iOS `FuryShell.info()` deliberately reports `push: false`. The server sends
through Firebase Cloud Messaging; Capacitor's default iOS registration token is an
APNs token and must not be sent to the server as if it were an FCM token.

To enable parity:

- Register an iOS app (`com.sketchfury.app`) in Firebase project `sketchfury-app`.
- Add its `GoogleService-Info.plist` to the App target as a resource; the local file
  is ignored by git. Supply it securely in the cloud build configuration.
- Add Firebase Messaging using Swift Package Manager, configure Firebase, and
  forward the FCM token through Capacitor's registration notification. Handle token
  refresh and registration errors. Do not add Firebase Analytics unnecessarily.
- Enable the Apple Push Notifications capability and appropriate signing entitlement;
  upload an APNs authentication key to Firebase using the approved account setup.
- Return `push: true` only when Firebase is configured, then verify foreground,
  background, and notification-tap behaviour on a signed device build.

## Store text and review notes

Reuse the draw/follow/fight/collect description in the main game repository
([mobile/store/README.md](https://github.com/compsmart/sketchfury/blob/main/mobile/store/README.md)), but omit the
notification claim until push works. Suggested subtitle: `Your drawings. Real fighters.`
Suggested keywords: `drawing,fighting,sketch,cartoon,battle,arcade,creative,multiplayer`.
Privacy URL: `https://sketchfury.com/privacy`. Support: `support@sketchfury.com`.

No login or purchases are required. Explain to App Review that this is a playable
canvas fighting game with a drawing studio and moderated player submissions. A
network connection is required. New drawings are reviewed and built asynchronously;
existing fighters can be played immediately. Do not promise that every submitted
drawing will become a fighter or that Apple will approve the app.

The app collects data even though it has no accounts: drawings, optional names,
fighter descriptions/reports, installation identifiers, optional notification
tokens, abuse-prevention IP addresses, aggregate usage/country counts, and error
diagnostics. Check `server.js` and `site/privacy.html` in the main game repository when completing Apple's
privacy questions. Data linked to an installation must not automatically be
declared unlinked simply because there is no login. Do not select “Data Not Collected”.

## References

- [Apple upload requirements](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/)
- [Apple screenshot sizes](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/)
- [Capacitor Firebase push setup](https://capacitorjs.com/docs/guides/push-notifications-firebase)
- [Codemagic Capacitor setup](https://docs.codemagic.io/yaml-quick-start/building-an-ionic-app/)
- [Codemagic build API](https://docs.codemagic.io/rest-api/builds/)
