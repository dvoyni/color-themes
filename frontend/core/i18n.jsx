export default function i18n(text, params) {
    if (!params) {
        return text;
    }
    else {
        text = i18n(text);
        return text.replace(/(\$\{\w+\})/g, function(index) {
            return params[index.substring(2, index.length - 1)];
        });
    }
}
