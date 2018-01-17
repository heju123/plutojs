export default {
    stay : {
        width : 24,
        height : 56,
        backgroundImage : "/images/sprite/hero-stay.png",
        backgroundImages : [
            {
                clip : [0,0,24,56]
            },
            {
                clip : [192,0,24,56]
            },
            {
                clip : [384,0,24,56]
            },
            {
                clip : [576,0,24,56]
            }
        ],
        backgroundImagesInterval : 500
    },
    run : {
        width : 48,
        height : 48,
        backgroundImage : "/images/sprite/hero-run.png",
        backgroundImages : [
            {
                clip : [0,0,44,48]
            },
            {
                clip : [192,0,48,48]
            },
            {
                clip : [384,0,48,48]
            },
            {
                clip : [576,0,48,48]
            },
            {
                clip : [768,0,48,48]
            },
            {
                clip : [0,192,48,48]
            },
            {
                clip : [192,192,48,48]
            },
            {
                clip : [384,192,48,48]
            }
        ],
        backgroundImagesInterval : 500
    }
}