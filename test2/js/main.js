
new Game()
    .init({
        debug: {
            lights: true,
            // shadows: true,
            // stats: true,
        },
        // withShadows: true,
        models: {
            mule1: [ "models/mule1.vox", 1, "object" ],
            mule2: [ "models/mule2.vox", 1, "object" ],
            mule3: [ "models/mule3.vox", 1, "object" ],
            mule4: [ "models/mule4.vox", 1, "object" ],
            mule5: [ "models/mule5.vox", 1, "object" ],
            mule6: [ "models/mule6.vox", 1, "object" ],
        }
    })
    .then(game => game.run())
;
