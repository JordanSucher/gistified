'use client'

import { TriangleRightIcon } from "@radix-ui/react-icons"
import { useState } from "react"

export default function SummaryCard ({summary}) {

    let [expanded, setExpanded] = useState(false)


    return (
        <>
            
            <div className='p-4 bg-gray-100 rounded-md mb-3 w-full'>
                <span className="flex justify-start items-center -ml-10">
                    {!expanded && <TriangleRightIcon onClick={()=>setExpanded(true)} className="w-10 h-10 text-gray-500" />}
                    {expanded && <TriangleRightIcon onClick={()=>setExpanded(false)} className="w-10 h-10 text-blue-500 transform rotate-90" />}
                    <img className="w-[70px] h-[70px]" src={summary.episode.publication.imageurl} alt=""/> 
                    <div className="ml-4 flex flex-col align-middle">
                        <h2 className="text-sm">{summary.episode.publication.title}</h2>
                        <h2 className="text-sm">{new Date(summary.episode.publishedAt).toDateString()}</h2>
                        <h3 className="text-xl font-bold">{summary.episode.title}</h3>
                    </div>    
                </span>
                <div className="mt-5">
                {expanded && summary.content.split("\n").map((line, i) => (
                    <>
                        <p key={i} className="mb-4">{line}</p>
                    </>
                ))}
                </div>
            </div>
        </>
    )
}