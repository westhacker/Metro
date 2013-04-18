// For an introduction to the HTML Fragment template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var appdata = Windows.Storage.ApplicationData;

    // This function is called whenever a user navigates to this page. It
    // populates the page elements with the app's data.
    function ready(element, options) {
        var remember = appdata.current.roamingSettings.values["remember"];
        remember = !remember ? false : remember; // false if value doesn’t exist
        document.querySelector("#rememberPosition").checked = remember;

        // TODO: Initialize the fragment here.
    }

    function updateLayout(element, viewState) {
        // TODO: Respond to changes in viewState.
    }

    WinJS.UI.Pages.define("/html/preference.html", {
        ready: ready,
        updateLayout: updateLayout
    });

    WinJS.Namespace.define("preferences", {
        rememberPosition: function () {
            appdata.current.roamingSettings.values["remember"] = document.querySelector("#rememberPosition").checked;
        }
    });

})();
