
new Game()
    .init({
        models: {
            mule1: [ "models/mule1.vox", 1, "object" ],
        }
    })
    .then(game => game.run())
;
