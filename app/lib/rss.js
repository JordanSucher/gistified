// this file for retrieving data from a podcasts rss feed and inserting it into the database. Both for publications and episodes.

import Parser from "rss-parser";

export async function isThisAPodcast(url) {
    try {
        let feedRaw = await fetch(url);
        let feed = await feedRaw.text();
        return feed.includes('podcast');
    }
    catch (e) {
        return false
    }
}

export async function getPodDetails(url) {
    try {
        let parser = new Parser();
        let feed = await parser.parseURL(url);
        let details = {
            title: feed.title,
            description: feed.description
        }
        return details
    }
    catch (e) {
        console.log(e)
        return null
    }
}

export async function getLatestEpisodes(url) {

    let parser = new Parser();
    let feed = await parser.parseURL(url);

    if (!feed) {
        return null;
    }

    feed = feed.items.slice(0,3).map((item) => {
        return {
            url: item.enclosure.url,
            title: item.title,
            description: item.description,
            pubDate: item.pubDate
        }
    })

    return feed;
}

// getPublication('https://www.thisamericanlife.org/podcast/rss.xml')



