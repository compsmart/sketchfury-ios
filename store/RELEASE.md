# App Store release 1.0.0

Submitted 14 November 2026 at approximately 23:51 UTC.

- App: Sketch Fury: Draw & Fight; Apple ID `6834948397`.
- Build: `1.0.0 (3)`, compiled from `9f8e1ae8fc93359420886de24d1678873f5104b8`.
- Status observed after submission: **Waiting for Review**.
- Release mode: automatically release after App Review approval.
- Public, free distribution; iPhone and iPad. Mac and Vision Pro availability disabled.
- All 175 territories selected, subject to Apple's regional eligibility requirements.
- Age rating: 13+, calculated from the content questionnaire.
- Categories: Games / Action / Casual.
- Locale: English (UK).
- Subtitle: Your drawings. Real fighters.
- Privacy and support URL: https://sketchfury.com/privacy
- Marketing URL: https://sketchfury.com
- No sign-in or purchases required. Push notifications are disabled in this build.
- Privacy disclosure published; no advertising tracking declared.
- EU trader verification: incomplete. Setup was cancelled before final submission
  because the developer does not want a personal number displayed publicly.
  A dedicated public business contact or an EU availability decision is pending.

[App Store Connect](https://appstoreconnect.apple.com/apps/6834948397/distribution/ios/version/inflight)

## Artwork

`apple-assets/iphone` contains five accepted images at 1206 x 2622 pixels
(2622 x 1206 for landscape). `apple-assets/ipad` contains five at 2064 x 2752
(2752 x 2064 for landscape). Order: home, fight, drawing, sketches, fighters.

These preserve existing Play Store screenshot artwork of the shared app UI in
Apple-sized layouts; they are not fresh iOS device captures. Regenerate from a
sibling main-game checkout with `node tools/package-store-assets.mjs`, or set
`SKETCHFURY_SOURCE` to that checkout. The standalone native build does not need it.

Apple accepted both sets. Submission validation passed and the developer confirmed
the signed TestFlight build works. Approval and public availability are pending.
