const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeUrlText(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // Strip unneeded elements
        $('nav, footer, header, script, style, noscript, iframe').remove();

        // Extract text from body
        const mainText = $('body').text();

        // Clean up whitespace
        return mainText.replace(/\s+/g, ' ').trim();
    } catch (error) {
        console.error("Scraping Error:", error);
        throw new Error('Failed to extract text from the provided URL.');
    }
}

module.exports = { scrapeUrlText };
