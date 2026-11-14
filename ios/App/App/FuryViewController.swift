import UIKit
import Capacitor

// Match the Android bridge used by the existing hosted game and app screens.
class FuryViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(FuryShellPlugin())
    }
}

@objc(FuryShellPlugin)
public class FuryShellPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "FuryShellPlugin"
    public let jsName = "FuryShell"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "info", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "keepAwake", returnType: CAPPluginReturnPromise)
    ]

    @objc func info(_ call: CAPPluginCall) {
        call.resolve([
            "build": Int(Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "0") ?? 0,
            "version": Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "",
            // The server requires FCM tokens, not raw APNs tokens. Enable only
            // after Firebase Messaging + APNs signing have been configured.
            "push": false
        ])
    }

    @objc func keepAwake(_ call: CAPPluginCall) {
        let enabled = call.getBool("on") ?? false
        DispatchQueue.main.async {
            UIApplication.shared.isIdleTimerDisabled = enabled
            call.resolve()
        }
    }
}
