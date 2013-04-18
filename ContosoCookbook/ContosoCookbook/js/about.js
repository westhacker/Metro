// For an introduction to the HTML Fragment template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    // This function is called whenever a user navigates to this page. It
    // populates the page elements with the app's data.
    function ready(element, options) {
        // TODO: Initialize the fragment here.
        var app = Windows.ApplicationModel.Store.CurrentAppSimulator;

        if (app.licenseInformation.isTrial) {
            // Show the purchase price on the purchase button
            var button = document.querySelector("#purchase");

            app.loadListingInformationAsync().then(function (listing) {
                button.textContent = "Upgrade to the Full Version for " + listing.formattedPrice;
            });
            // Handle licensechanged events
            app.licenseInformation.onlicensechanged = function () {
                if (!app.licenseInformation.isTrial) {
                    var dialog = new Windows.UI.Popups.MessageDialog("Thanks for purchasing Contoso Cookbook!");
                    dialog.showAsync();
                }
            };

            // Handle clicks of the purchase button
            button.onclick = function () {
                app.requestAppPurchaseAsync();
            };

        }
        else {
            // Show the expiration date and hide the purchase button
            document.querySelector("#info").textContent = "Valid until " + app.licenseInformation.expirationDate.toLocaleDateString();
            document.querySelector("#purchase").style.visibility = "hidden";
        }

    }

    function updateLayout(element, viewState) {
        // TODO: Respond to changes in viewState.
    }

    WinJS.UI.Pages.define("/html/about.html", {
        ready: ready,
        updateLayout: updateLayout
    });
})();


