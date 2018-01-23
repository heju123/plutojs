const FONT_COLOR = "#333333";
const THEME_COLOR = "#fc8042";

let commonStyle = {
    fontColor : FONT_COLOR,
    themeColor : THEME_COLOR,
    inputStyle : {
        backgroundColor : "#ffffff",
        borderWidth : 1,
        borderColor : "#cccccc",
        borderRadius : 5,
        focus : {
            borderColor : THEME_COLOR
        }
    },
    readOnlyInputStyle : {
        backgroundColor : "#d7d7d7",
        focus : {
            borderColor : "#cccccc"
        }
    },
    buttonStyle : {
        backgroundColor : THEME_COLOR,
        fontColor : "#ffffff",
        borderRadius : 5,
        hover : {
            backgroundColor : "#fc8042",
            alpha : 0.9
        },
        active : {
            backgroundColor : "#e5733e",
            alpha : 0.9
        }
    },
    disabledButtonStyle : {
        alpha : 0.6
    }
};

export default commonStyle;