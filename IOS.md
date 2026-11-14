# Sketch Fury for iPhone and iPad

Preparation status (14 November 2026): the native project exists and Capacitor sync
passes on Windows. It has **not** been compiled, signed, tested on iOS, uploaded, or
submitted to Apple. Codemagic workflows are provided in `codemagic.yaml`; cloud builds have not yet run.

## Project

- Xcode project: `ios/App/App.xcodeproj`; shared scheme: `App`.
- Bundle ID: `com.sketchfury.app` (still needs registration with Apple).
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

1. Accept Apple's updated Developer Program License Agreement. The account currently
   blocks developer resources pending acceptance. It also displayed membership
   expiry in 21 days; renewal has not been purchased or enabled.
2. Register the bundle ID and create the App Store Connect record. Use the existing
   name `Sketch Fury: Draw & Fight`, English (UK), free pricing, Games/Action.
3. Connect this repository and signing credentials to Codemagic as described in
   README.md. The workflows are prepared; no cloud build has been run.
4. Finish push setup below before claiming Android notification parity.
5. Run on iPhone and iPad: launch, offline/retry, draw/import/send a sketch, queue,
   landscape play and portrait return, audio, share sheet, safe areas, suspend/resume,
   moderation reports, and online matches. Verify notifications on a real device.
6. Capture screenshots of the actual iOS app at Apple's accepted sizes. Existing
   Android screenshots are references, not verified iOS screenshots.
7. Complete privacy disclosures, age rating, content rights, export compliance,
   review contact, and any applicable business/trader information. Review the
   current roster and moderation behaviour rather than copying Google's answers.
8. Upload to TestFlight, test, then select the build and submit for App Review.

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
