(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/html/groupedItemsPage.html", {

        // This function is used in updateLayout to select the data to display
        // from an item's group.
        groupDataSelector: function (item) {
            return {
                title: item.group.title,
                shortTitle: item.group.shortTitle,
                backgroundImage: item.group.backgroundImage,

                click: function () {
                    nav.navigate("/html/groupDetailPage.html", { group: item.group });
                }
            }
        },

        // This function is used in updateLayout to select an item's group key.
        groupKeySelector: function (item) {
            return item.group.key;
        },

        itemInvoked: function (eventObject) {
            // Determine whether the SemanticZoom control is zoomed out
            var zoomedOut = document.querySelector("#zoom").winControl.zoomedOut;

            if (appView.value === appViewState.snapped || zoomedOut) {
                // If the page is snapped, the user invoked a group.
                var group = data.groups.getAt(eventObject.detail.itemIndex);
                nav.navigate("/html/groupDetailPage.html", { group: group });
            } else {
                // If the page is not snapped, the user invoked an item.
                var item = data.items.getAt(eventObject.detail.itemIndex);
                nav.navigate("/html/itemDetailPage.html", { item: item });
            }
        },


        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            var appbar = document.querySelector("#appbar").winControl;
            appbar.showOnlyCommands(["home"]);

            var listViews = element.querySelectorAll(".groupeditemslist");

            for (var i = 0; i < listViews.length; i++) {
                var listView = listViews[i].winControl;

                ui.setOptions(listView, {
                    groupHeaderTemplate: element.querySelector(".headerTemplate"),
                    itemTemplate: element.querySelector(".itemtemplate"),
                    oniteminvoked: this.itemInvoked
                });
            }

            this.updateLayout(element, appView.value);
        },


        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState) {
            var list = data.items.createGrouped(this.groupKeySelector, this.groupDataSelector);

            if (viewState === appViewState.snapped) {
                // If the page is snapped, display a list of groups.
                var listViews = element.querySelectorAll(".groupeditemslist");

                for (var i = 0; i < listViews.length; i++) {
                    var listView = listViews[i].winControl;

                    ui.setOptions(listView, {
                        itemDataSource: list.groups.dataSource,
                        groupDataSource: null,
                        layout: new ui.ListLayout()
                    });
                }
            } else {
                // If the page is not snapped, display a grid of grouped items.
                // For the zoomed-in ListView, show groups and items
                var zoomedInListView = element.querySelector("#zoomedInListView").winControl;

                ui.setOptions(zoomedInListView, {
                    itemDataSource: list.dataSource,
                    groupDataSource: list.groups.dataSource,
                    layout: new ui.GridLayout({ groupHeaderPosition: "top" })
                });

                // For the zoomed-out ListView, show groups only
                var zoomedOutListView = element.querySelector("#zoomedOutListView").winControl;

                ui.setOptions(zoomedOutListView, {
                    itemDataSource: list.groups.dataSource,
                    groupDataSource: null,
                    layout: new ui.GridLayout({ groupHeaderPosition: "top" })
                });
            }
        },

    });
})();
