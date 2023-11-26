import prisma from '../prisma'
import { put } from '@vercel/blob'

export function getSubscriptions() {
    return prisma.subscription.findMany()
}

export function getSummaries() {
    return prisma.summary.findMany()
}

export async function createPublication(obj) {

    let pub = {
        title: obj.title,
        description: obj.description,
        RssFeedUrl: obj.enclosure.url
    }

    let publication = await prisma.publication.create({
        data: pub
    })

    return publication

}

export async function saveToBlobStorage(path, text) {
    try {
        let res = await put(path, text, {
            access: "public",
        })
        return res
    }
    catch (e) {
        console.log(e)
        return false
    }
}
export async function upsertEpisode(rssFeedUrl, episodeurl="", pubdate="", title="", description="", transcripturl="") {

    let publication = await prisma.publication.findFirst({
        where: {
            rssFeedUrl: rssFeedUrl
        }
    })

    let incumbentEpisode = await prisma.episode.findFirst({
        where: {
            url: episodeurl
        }
    })

    let isoDate = new Date(pubdate).toISOString()

    let episode = await prisma.episode.upsert({
        where: {
            id: incumbentEpisode?.id ?? -1
        },
        update: {
            title: title,
            description: description,
            transcriptUrl: transcripturl,
            publishedAt: isoDate
        },
        create: {
            url: episodeurl,
            transcriptUrl: transcripturl,
            title: title,
            description: description,
            publishedAt: isoDate,
            publicationId: publication.id
        }
    })

    return episode

}

export async function upsertSummary(episodeId, text=null) {

    let incumbentSummary = await prisma.summary.findFirst({
        where: {
            episodeId: episodeId
        }
    })

    let summary = await prisma.summary.upsert({
        where: {
            id: incumbentSummary?.id ?? -1
        },
        update: {
            content: text,
            status: text==null ? "pending" : "published"
        },
        create: {
            content: text,
            episodeId: episodeId,
            status: text==null ? "pending" : "published"
        }

    })

    return summary
}

export async function doesTranscriptExist(episodeurl) {
    let episode = await prisma.episode.findFirst({
        where: {
            url: episodeurl
        }
    })

    return episode.transcriptUrl.length > 0
    
}

export async function getTranscriptUrlFromEpisode(episodeurl) {
    let episode = await prisma.episode.findFirst({
        where: {
            url: episodeurl
        }
    })

    return episode.transcriptUrl

}