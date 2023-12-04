import prisma from '../../prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/authOptions"
import Link from "next/link"

export default async function Summaries () {
    
    let session = await getServerSession(authOptions)

    let highlights = await prisma.publication.findMany({
        include: {
            episodes: {
                include: {
                    summaries: {
                        include: {
                            highlights: true
                        }
                    }
                },
                where: {
                    summaries: {
                        some: {
                            highlights: {
                                some: {
                                    userId: session.user.id
                                }
                            }
                        }
                    }
                }
            }
        },
        where: {
            episodes: {
                some: {
                    summaries: {
                        some: {
                            highlights: {
                                some: {
                                    userId: session.user.id
                                }
                            }
                        }
                    }
                }
            }
        }
    });


    console.log("highlights", highlights[0].episodes[0].summaries)

    return (
        <div className='w-full h-full max-w-[1000px] mt-[10px] self-center mx-24'>
            <h1 className="text-3xl font-bold text-black mb-10">Highlights</h1>
            {highlights.map((highlight, index) => {
                return (
                    <>
                        <div key={index}>
                            <h2 className='text-xs md:text-sm font-bold'>{highlight.title}</h2>
                            <Link href={`/summaries/${highlight.episodes[0]?.summaries[0]?.id}`}>
                                <h3 className="text-md md:text-xl font-bold hover:cursor-pointer hover:text-blue-500">{highlight.episodes[0]?.title}</h3>
                            </Link>
                                {highlight.episodes[0]?.summaries[0]?.highlights.map((highlight, index) => {
                                    return (
                                        <p key={index} className='m-3 italic'>{`"${highlight.content.replace(/(<([^>]+)>)/gi, "")}"`}</p>
                                    )
                                })}
                        </div>
                        <hr className="my-4 bg-gray-300 h-[1px]" />
                    </>
                )
            }
            )}
        </div>
    )
}