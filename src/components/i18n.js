/**
 * Get navigator language
 * @returns {{name: string, short: string}}
 */
function getLang() {
    let lang = navigator.language||navigator.userLanguage;//常规浏览器语言和IE浏览器
    let short_lang = lang.substr(0, 2);//截取lang前2位字
    return {
        name:lang,
        short:short_lang
    };
}