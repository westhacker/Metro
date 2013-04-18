(function () {
    "use strict";

    var start = Windows.UI.StartScreen;

    WinJS.Namespace.define("tiles", {
        // Creates a secondary tile and submit a request to pin it
        pinRecipe: function () {
            var logo = new Windows.Foundation.Uri("ms-resource:images/logo.png");

            var tile = new start.SecondaryTile(
                tiles.currentItem.key,              // Tile ID
                tiles.currentItem.shortTitle,       // Tile short name
                tiles.currentItem.title,            // Tile display name
                tiles.currentItem.key,              // Activation argument
                start.TileOptions.showNameOnLogo,   // Tile options
                logo                                // Tile logo
            );

            tile.requestCreateAsync();
        },

        // Stores a reference to the current recipe
        currentItem: null
    });
})();
