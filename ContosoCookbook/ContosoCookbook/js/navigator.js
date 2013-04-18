(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var displayProps = Windows.Graphics.Display.DisplayProperties;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    WinJS.Namespace.define("ContosoCookbook", {
        PageControlNavigator: WinJS.Class.define(
        // Define the constructor function for the PageControlNavigator.
            function (element, options) {
                this.element = element || document.createElement("div");
                this.element.appendChild(this._createPageElement());

                this.home = options.home;

                nav.onnavigated = this._navigated.bind(this);
                appView.getForCurrentView().onviewstatechanged = this._viewstatechanged.bind(this);

                document.body.onkeyup = this._keyupHandler.bind(this);
                document.body.onkeypress = this._keypressHandler.bind(this);
                nav.navigate(this.home);
            }, {
                // This function creates a new container for each page.
                _createPageElement: function () {
                    var element = document.createElement("div");
                    element.style.width = "100%";
                    element.style.height = "100%";
                    return element;
                },

                // This function responds to keypresses to only navigate when
                // the backspace key is not used elsewhere.
                _keypressHandler: function (eventObject) {
                    if (eventObject.key === "Backspace")
                        nav.back();
                },

                // This function responds to keyup to enable keyboard navigation.
                _keyupHandler: function (eventObject) {
                    if ((eventObject.key === "Left" && eventObject.altKey) || (eventObject.key === "BrowserBack")) {
                        nav.back();
                    } else if ((eventObject.key === "Right" && eventObject.altKey) || (eventObject.key === "BrowserForward")) {
                        nav.forward();
                    }
                },


                // This function responds to navigation by adding new pages
                // to the DOM.
                _navigated: function (eventObject) {
                    // Record the location just navigated to
                    if (!eventObject.detail.state) {
                        this.currentLocation = ""; // Home
                    }
                    else if (eventObject.detail.state.group) {
                        this.currentLocation = eventObject.detail.state.group.key;
                    }
                    else if (eventObject.detail.state.item) {
                        this.currentLocation = eventObject.detail.state.item.key;
                    }

                    var newElement = this._createPageElement();
                    var parentedComplete;
                    var parented = new WinJS.Promise(function (c) { parentedComplete = c; });

                    var that = this;
                    WinJS.UI.Pages.render(eventObject.detail.location, newElement, eventObject.detail.state, parented).
                        then(function (control) {
                            that.element.appendChild(newElement);
                            that.element.removeChild(that.pageElement);
                            parentedComplete();
                            document.body.focus();
                            that.navigated();
                        });
                },

                // This function is called by _viewstatechanged in order to
                // pass events to the page.
                _updateLayout: {
                    get: function () { return (this.pageControl && this.pageControl.updateLayout) || function () { }; }
                },

                _viewstatechanged: function (eventObject) {
                    (this._updateLayout.bind(this.pageControl))(this.pageElement, eventObject.viewState);
                },

                // This function updates application controls once a navigation
                // has completed.
                navigated: function () {
                    // Do application specific on-navigated work here
                    var backButton = this.pageElement.querySelector("header[role=banner] .win-backbutton");
                    if (backButton) {
                        backButton.onclick = function () { nav.back(); };

                        if (nav.canGoBack) {
                            backButton.removeAttribute("disabled");
                        }
                        else {
                            backButton.setAttribute("disabled", "disabled");
                        }
                    }
                },

                // This is the PageControlNavigator object.
                pageControl: {
                    get: function () { return this.pageElement && this.pageElement.winControl; }
                },

                // This is the root element of the current page.
                pageElement: {
                    get: function () { return this.element.firstElementChild; }
                },

                currentLocation: ""

            }
        ),

        // This function navigates to the home page which is defined when the
        // control is created.
        navigateHome: function () {
            var home = document.querySelector("#contenthost").winControl.home;
            var loc = nav.location;
            if (loc !== "" && loc !== home) {
                nav.navigate(home);
            }
        },

        // This function navigates to the specified location
        navigateToLocation: function (args) {
            if (args === "") {
                // Navigate to the start page
                ContosoCookbook.navigateHome();
            }

            var location = parseInt(args);

            if (isNaN(location)) { // Group (e.g., "Chinese")
                // Navigate to the group-detail page
                data.groups.forEach(function (group) {
                    if (group.key == args) {
                        nav.navigate("/html/groupDetailPage.html", { group: group });
                    }
                });
            }
            else { // Item (e.g., "1000")
                // Navigate to the item-detail page
                data.items.forEach(function (item) {
                    if (item.key == args) {
                        nav.navigate("/html/itemDetailPage.html", { item: item });
                    }
                });
            }
        },

        activationArgs: "",

        postActivate: function () {
            if (ContosoCookbook.activationArgs !== "") {
                var args = ContosoCookbook.activationArgs;
                ContosoCookbook.activationArgs = ""; // Reset for next time
                ContosoCookbook.navigateToLocation(args);
            }
        }


    });
})();
