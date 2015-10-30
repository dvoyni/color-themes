
export default class DOMUtils {
    static triggerDownload(name, data) {
        var element = document.createElement('a');
        element.setAttribute('href', window.URL.createObjectURL(data));
        element.setAttribute('download', name);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
}
