const { JSDOM } = require('jsdom')

async function crawlPage(baseURL, currentURL, pages){
    const currentUrlObj = new URL(currentURL)
    const baseUrlObj = new URL(baseURL)
    if (currentUrlObj.hostname !== baseUrlObj.hostname){
        return pages
    }

    const normalizedURL = normalizeURL(currentURL);

    if (pages[normalizedURL] > 0){
        pages[normalizedURL]++
        return pages
    }


    pages[normalizedURL] = 1

    console.log(`crawling ${baseURL}`)
    let htmlBody = ''
    try {
        const resp = await fetch(currentURL)
        if (resp.status > 399){
            console.log(`Got HTTP error, status code ${resp.status}`)
            return pages
        }
        const contentType = resp.headers.get('content-type')
        if (!contentType.includes('text/html')){
            console.log(`Got non-html response: ${contentType}`)
            return pages
        }
        htmlBody = await resp.text()
        } catch (err){
        console.log(err.message)
        }

    const nextURLs = getURLsFromHTML(htmlBody, baseURL)
    for (const nextURL of nextURLs){
        pages = await crawlPage(baseURL, currentURL, pages)
    }
    return pages

}

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
    }
)
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




module.exports = {
    crawlPage,
    getURLsFromHTML,
    normalizeURL    
}