const { JSDOM } = require('jsdom')

async function crawlPage(currentURL){
    console.log(`crawling ${currentURL}`)
    try {
      const resp = await fetch(currentURL)
      if (resp.status > 399){
        console.log(`Got HTTP error, status code: ${resp.status}`)
        return
      }
      const contentType = resp.headers.get('content-type')
      if (!contentType.includes('text/html')){
        console.log(`Got non-html response: ${contentType}`)
        return
      }
      console.log(await resp.text())
    } catch (err){
      console.log(err.message)
    }
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