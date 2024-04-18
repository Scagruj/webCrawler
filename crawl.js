const { JSDOM } = require('jsdom')

function getURLsFromHTML(htmlBody, baseURL){
    let arrayURL = [];
    const dom = new JSDOM(htmlBody);
    const links = dom.window.document.querySelectorAll('a');
    links.forEach(link => {
        const url = link.href;
        if(!url.startsWith('http://') && !url.startsWith('https://')) {
            let absoluteURL = new URL(url, baseURL).href;
            arrayURL.push(absoluteURL);
        } else {
            arrayURL.push(url)
        }
    });
    return arrayURL
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    let urlPathname = urlObj.pathname;
    if (urlPathname.length > 1 && urlPathname.endsWith('/')) {
        urlPathname = urlPathname.slice(0, -1);
        
    }
    const normalizedURL = urlObj.hostname + urlPathname
    return normalizedURL
};


getURLsFromHTML('https://webinstall.dev/')


module.exports = {
    normalizeURL
}