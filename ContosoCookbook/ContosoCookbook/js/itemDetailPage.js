(function () {
    "use strict";

    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/html/itemDetailPage.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            var appbar = document.querySelector("#appbar").winControl;
            appbar.showOnlyCommands(["photo", "video", "pin", "remind", "home"]);

            var item = options && options.item ? options.item : data.items.getAt(0);

            tiles.currentItem = item; // Store this in case the user pins the recipe

            element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
            element.querySelector("article .item-title").textContent = item.title;
            element.querySelector("article .item-subtitle").textContent = item.preptime;
            element.querySelector("article .item-image").src = item.backgroundImage;
            element.querySelector("article .item-image").alt = item.shortTitle;

            // Display ingredients list
            var ingredients = element.querySelector("article .item-ingredients");
            for (var i = 0; i < item.ingredients.length; i++) {
                var ingredient = document.createElement("h2");
                ingredient.textContent = item.ingredients[i];
                ingredient.className = "ingredient";
                ingredients.appendChild(ingredient);
            }

            // Display cooking directions
            // Determine whether Italian recipes have been purchased
            var app = Windows.ApplicationModel.Store.CurrentAppSimulator;
            var license = app.licenseInformation;

            if (license.productLicenses.ItalianRecipes.isActive || item.group.key !== "Italian") {
                // Display cooking directions
                element.querySelector("article .item-directions").textContent = item.directions;
            }
            else {
                // Show the purchase price on the purchase button
                var button = document.querySelector("#purchase");

                app.loadListingInformationAsync().then(function (listing) {
                    var price = listing.productListings.ItalianRecipes.formattedPrice;
                    button.textContent = "Purchase Italian Recipes for " + price;
                });

                // Handle licensechanged events
                app.licenseInformation.onlicensechanged = function () {
                    if (license.productLicenses.ItalianRecipes.isActive) {
                        // Replace purchase button with cooking directions
                        element.querySelector("article .item-directions").textContent = item.directions;
                    }
                };

                // Handle clicks of the purchase button
                button.onclick = function () {
                    app.requestProductPurchaseAsync("ItalianRecipes");
                };
            }



            var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();

            dtm.addEventListener("datarequested", function (e) {
                var request = e.request;
                request.data.properties.title = item.title;
                request.data.properties.description = "Recipe ingredients and directions";
                if (media.shareFile == null) {
                    // Share recipe text
                    request.data.properties.description = "Recipe ingredients and directions";

                // Share recipe text
                var recipe = "INGREDIENTS\r\n";

                item.ingredients.forEach(function (ingredient) {
                    recipe += ingredient + "\r\n";
                });

                recipe += ("\r\nDIRECTIONS\r\n" + item.directions);
                request.data.setText(recipe);

                // Share recipe image
                var image = document.querySelector(".item-image");
                var uri = image.getAttribute("src");

                if (uri.indexOf("http://") == 0)
                    uri = new Windows.Foundation.Uri(image.src); // Remote image
                else
                    uri = new Windows.Foundation.Uri("ms-appx:///" + image.getAttribute("src")); // Local images

                var reference = Windows.Storage.Streams.RandomAccessStreamReference.createFromUri(uri);
                request.data.properties.thumbnail = reference;
                var deferral = request.getDeferral();
                request.data.setBitmap(reference);
                deferral.complete();
            }
                else {
                    // Share the photo or video just captured by the user
                    request.data.properties.description = "Recipe photo or video";
                    var reference = Windows.Storage.Streams.RandomAccessStreamReference.createFromFile(media.shareFile);
                    request.data.properties.thumbnail = reference;
                    request.data.setBitmap(reference);
                    media.shareFile = null;
                }


            });



        }



    })
})();
