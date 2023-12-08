import prisma from '../../prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/authOptions"
import Link from "next/link"
import RemoveHighlightButton from "./RemoveHighlightButton"

export default function HighlightCard({episode}) {
    return (
        <>
            <div>
                <span className='flex'>
                    <img className="w-[70px] h-[70px] mt-[4px] select-none" src={episode.publication.imageurl} alt=""/> 
                    <div className='ml-4 flex flex-col justify-center'>
                        <h2 className='text-xs md:text-sm'>{episode.publication.title}</h2>
                        <h2 className='text-xs md:text-sm'>{new Date(episode.publishedAt).toDateString()}</h2>
                        <Link href={`/summaries/${episode.summaries[0]?.id}`}>
                            <h3 className="text-md md:text-xl font-bold hover:cursor-pointer hover:text-blue-500">{episode.title}</h3>
                        </Link>
                    </div>

                </span>

                    {episode.summaries[0]?.highlights.map((highlight, index) => {
                        return (
                            <span className="flex" key={index}>
                                <p className='m-3 italic w-[90%]'>{`"${highlight.content.replace(/(<([^>]+)>)/gi, "")}"`}</p>
                                <RemoveHighlightButton highlight={highlight} classes={`mt-3`}/>
                            </span>
                            
                        )
                    })}
            </div>
            <hr className="my-4 bg-gray-300 h-[1px]" />
        </>
    )


}