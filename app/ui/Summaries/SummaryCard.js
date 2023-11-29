'use client'

import { TriangleRightIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import {DotFilledIcon} from "@radix-ui/react-icons"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SummaryCard ({summary}) {

    const router = useRouter()

    let [expanded, setExpanded] = useState(false)
    let [readStatus, setReadStatus] = useState(null)
    let [readFilter, setReadFilter] = useState(false)
 
    useEffect(() => {
        let currReadStatus = localStorage.getItem(`readStatus_${summary.id}`)
        let currReadFilter = localStorage.getItem("readFilter")
        console.log("currReadStatus", currReadStatus)
        console.log("readStatus", readStatus)
        if (currReadStatus == 'true' || currReadStatus == 'false') {
            setReadStatus(currReadStatus)
        }
        if (currReadFilter) {
            setReadFilter(currReadFilter)
        }
    }, [summary])

    const toggleReadStatus = () => {
        let curr = localStorage.getItem(`readStatus_${summary.id}`)
        if (curr == "true") {
            curr = "false"
            localStorage.setItem(`readStatus_${summary.id}`, curr)
            setReadStatus(curr)
        } else {
            curr = "true"
            localStorage.setItem(`readStatus_${summary.id}`, curr)
            setReadStatus(curr)
        }
        router.refresh()
    }

    if (readFilter == 'true' && readStatus == 'true') {
        return <></>
    }
    else {
        return (
            <>
                <div className='p-4 bg-gray-100 rounded-md w-full flex flex-col'>
                    <span className="flex justify-start items-center -ml-10">
                        {!expanded && <TriangleRightIcon onClick={()=>setExpanded(true)} className="hover:cursor-pointer select-none w-10 h-10 text-gray-500" />}
                        {expanded && <TriangleRightIcon onClick={()=>setExpanded(false)} className="hover:cursor-pointer select-none w-10 h-10 text-blue-500 transform rotate-90" />}
                        <img className="w-[70px] h-[70px] select-none" onClick={()=>setExpanded(!expanded)} src={summary.episode.publication.imageurl} alt=""/> 
                        <span className="flex justify-between items-center w-full">
                            <div className="ml-4 flex flex-col align-middle" onClick={()=>setExpanded(!expanded)}>
                                <h2 className="text-sm">{summary.episode.publication.title}</h2>
                                <h2 className="text-sm">{new Date(summary.episode.publishedAt).toDateString()}</h2>
                                <h3 className="text-xl font-bold">{summary.episode.title}</h3>
                            </div>
                            {readStatus && <DotFilledIcon onClick={toggleReadStatus} className={`w-8 h-8 hover:bg-slate-200 hover:cursor-pointer rounded-md ${readStatus == 'true'? "text-gray-300" : "text-blue-400"}`} />}
                        </span>
                    </span>
    
                    {expanded && 
                        <div className="mt-5 w-[95%]">
                            {summary.content.split("\n").map((line, i) => (
                                    <p key={i} className="mb-4">{line}</p>
                            ))}
                        </div>
                    }
                </div>
            </>
        )
    }
}