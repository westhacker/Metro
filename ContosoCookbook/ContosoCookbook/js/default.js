// For an introduction to the Grid template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232446
(function () {
    "use strict";

    var app = WinJS.Application;
    var appdata = Windows.Storage.ApplicationData;

    app.onactivated = function (eventObject) {
        if (eventObject.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
            if (eventObject.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // Clear the badge
                Windows.UI.Notifications.BadgeUpdateManager.createBadgeUpdaterForApplication().clear();

                // Register for badge notifications
                Windows.Networking.PushNotifications.PushNotificationChannelManager.createPushNotificationChannelForApplicationAsync().then(function (channel) {
                    // Base-64 encode the channel URI  so it can be passed in a query string
                    var wsc = Windows.Security.Cryptography;
                    var buffer = wsc.CryptographicBuffer.convertStringToBinary(channel.uri, wsc.BinaryStringEncoding.utf8);
                    var uri = wsc.CryptographicBuffer.encodeToBase64String(buffer);

                    // Pass the encoded channel URI to the Contoso Cookbook service
                    WinJS.xhr({ url: "http://ContosoRecipes8.cloudapp.net?uri=" + uri }).then(function (xhr) {
                        if (xhr.status < 200 || xhr.status >= 300) {
                            var dialog = new Windows.UI.Popups.MessageDialog("Unable to open push notification channel");
                            dialog.showAsync();
                        }
                    });
                });

                if (eventObject.detail.arguments !== "") {
                    ContosoCookbook.activationArgs = eventObject.detail.arguments;
                }
                else {

                    var remember = appdata.current.roamingSettings.values["remember"];
                    remember = !remember ? false : remember;

                    if (remember) {
                        var location = appdata.current.roamingSettings.values["location"];
                        if (typeof (location) !== "undefined" && location !== "") {
                            ContosoCookbook.activationArgs = location;
                        }
                    }
                }
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension. 
                // Restore application state here.
                var location = appdata.current.roamingSettings.values["location"];

                if (typeof (location) !== "undefined" && location !== "") {
                    ContosoCookbook.activationArgs = location;
                }

            }
            WinJS.UI.processAll();
            // Initialize WindowsStoreProxy.xml
            appdata.current.localFolder.createFolderAsync("Microsoft\\Windows Store\\ApiData", Windows.Storage.CreationCollisionOption.openIfExists).then(function (folder) {
                Windows.ApplicationModel.Package.current.installedLocation.getFileAsync("data\\license.xml").then(function (file) {
                    folder.createFileAsync("WindowsStoreProxy.xml", Windows.Storage.CreationCollisionOption.replaceExisting).then(function (newFile) {
                        file.copyAndReplaceAsync(newFile);
                    });
                });
            });

        }
    };

    app.oncheckpoint = function (eventObject) {
        var location = document.querySelector("#contenthost").winControl.currentLocation;
        appdata.current.roamingSettings.values["location"] = location;


        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the 
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // eventObject.setPromise(). 
    };

    app.onsettings = function (eventObject) {
        eventObject.detail.applicationcommands = {
            // Add an About command
            "about": {
                href: "/html/about.html",
                title: "About"
            },
            "preferences": {
                href: "/html/preference.html",
                title: "Preferences"
            }

        }

        WinJS.UI.SettingsFlyout.populateSettings(eventObject);
    };

    app.start();
})();
