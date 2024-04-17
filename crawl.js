function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    let urlPathname = urlObj.pathname;
    if (urlPathname.length > 1 && urlPathname.endsWith('/')) {
        urlPathname = urlPathname.slice(0, -1);
        
    }
    const normalizedURL = urlObj.hostname + urlPathname
    console.log(normalizedURL)
    return normalizedURL
}


normalizeURL('http://blog.boot.dev/')



module.exports = {
    normalizeURL
}