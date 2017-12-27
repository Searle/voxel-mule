
new Game()
    .init({
        debug: {
            lights: true,
            // shadows: true,
        },
        // withShadows: true,
        models: {
            mule1: [ "models/mule1.vox", 1, "object" ],
        }
    })
    .then(game => game.run())
;
