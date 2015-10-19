import StringUtils from "../utils/StringUtils"

export default function i18n(text, params) {
    if (!params) {
        return text;
    }
    else {
        text = i18n(text);
        return StringUtils.format(text, params);
    }
}
