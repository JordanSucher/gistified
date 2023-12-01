import SummaryCard from "../ui/Summaries/SummaryCard"
import prisma from '../prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/authOptions"
import AddSubscriptionButton from "../ui/Subscriptions/AddSubscriptionButton"
import ReadFilter from "../ui/Summaries/ReadFilter"


export default async function Summaries () {

    let session = await getServerSession(authOptions)

    // let subscriptions = session ? await prisma.subscription.findMany({
    //     where: {
    //         userId: session.user.id
    //     },
    //     include: {
    //         publication: true
    //     }
    // }) : []

    // let allEpisodeIds = []

    // for (const subscription of subscriptions) {
    //     let episodes = await prisma.episode.findMany({
    //         where: {
    //             publicationId: subscription.publicationId
    //         }
    //     })
    //     allEpisodeIds.push(...episodes.map(episode=>episode.id))

    // }

      let summaries = session ? await prisma.summary.findMany({
          where: {
            status: 'published',
            episode:{
                publication:{
                    subscriptions: {
                        some: {
                            userId: session.user.id
                        }
                    }
                }
            }
        },
        include: {
            episode: {
                include: {
                    publication: {
                        include: {
                            subscriptions: true
                        }
                    }
                }
            }
        },
        orderBy: {
            episode:{
                publishedAt: 'desc'
            }
        }
        }) : []
    
    if (summaries.length > 0) {
        return (
            <div className='w-full h-full max-w-[1000px] self-center md:mr-24 overflow-y-auto'>
                <div className="fixed z-30 bg-gray-100 w-[100%] max-w-[1000px]">
                    <span className="z-30 bg-gray-100 flex-col flex justify-between items-start py-2 pr-4 mb-2">
                        <h1 className="text-xl m-0 p-0">Your Summaries</h1>
                        <ReadFilter />
                    </span>
                </div>
                <div className="w-full px-4 mt-16 ">
                {summaries.map((summary) => {
                    return (
                    <>
                        <SummaryCard
                        key={summary.id}
                        summary={summary}/>
                        <hr className="h-[1px] bg-gray-300"/>
                    </>
                    )
                }
                )}
                </div>
            </div>
        )
    }

    else {
        return (
            <div className='w-full max-w-[1000px] self-center flex justify-center items-center gap-4'>
                <p className="text-lg">No summaries available yet. </p> 
                <AddSubscriptionButton />
            </div>
        )
    }
}

