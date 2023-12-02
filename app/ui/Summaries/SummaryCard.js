'use client'

import { TriangleRightIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { DotFilledIcon } from "@radix-ui/react-icons"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SummaryCard ({summary, allExpanded, setAllExpanded, allRead, setAllRead, readFilter, setReadFilter}) {

    const router = useRouter()

    let [expanded, setExpanded] = useState(false)
    let [readStatus, setReadStatus] = useState('false')
    let [content, setContent] = useState(false)

    useEffect(() => {
        if(allRead==true && setAllRead) {
            localStorage.setItem(`readStatus_${summary.id}`, 'true')
            setReadStatus('true')
            setAllRead(null)
        }

        else if (allRead==false && setAllRead) {
            localStorage.setItem(`readStatus_${summary.id}`, 'false')
            setReadStatus('false')
            setAllRead(null)
        }
    }, [setAllRead, allRead, summary.id])

    useEffect(() => {
        if (allExpanded==true && setAllExpanded) {
            setExpanded(true)
            setAllExpanded(null)
        }

        else if (allExpanded==false && setAllExpanded) {
            setExpanded(false)
            setAllExpanded(null)
        }
    }, [setAllExpanded, allExpanded])

    useEffect(() => {
        const grabContent = async () => {
            try {
                let cont = JSON.parse(summary.content.replace("```json", "").replace("```", ""))
                setContent(cont)
            } catch (error) {
                console.log("error", error)
            }
        }
        grabContent()
    },[])

    useEffect(() => {
        let currReadStatus = localStorage.getItem(`readStatus_${summary.id}`)
        if (currReadStatus == 'true' || currReadStatus == 'false') {
            setReadStatus(currReadStatus)
        }
    }, [summary, readStatus])

    useEffect(() => {
        let currReadFilter = localStorage.getItem("readFilter")
        if (currReadFilter) {
            setReadFilter(currReadFilter)
        }
    }, [readFilter, setReadFilter])

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
            content && <>
                <div className='px-4 pt-4 bg-gray-100 rounded-md w-[100%] flex flex-col'>
                    <span className="flex justify-start items-start -ml-10">
                        {!expanded && <TriangleRightIcon onClick={()=>{setExpanded(true)}} className="hover:cursor-pointer select-none w-10 h-10 text-gray-500" />}
                        {expanded && <TriangleRightIcon onClick={()=>{setExpanded(false)}} className="hover:cursor-pointer select-none w-10 h-10 text-blue-500 transform rotate-90" />}
                        <img className="w-[70px] h-[70px] mt-[4px] select-none hover:cursor-pointer" onClick={()=>setExpanded(!expanded)} src={summary.episode.publication.imageurl} alt=""/> 
                        <span className="flex justify-between items-start w-full">
                            <div className="ml-4 flex flex-col align-middle">
                                <h2 className="text-xs md:text-sm">{summary.episode.publication.title}</h2>
                                <h2 className="text-xs md:text-sm">{new Date(summary.episode.publishedAt).toDateString()}</h2>
                                <Link href={`/summaries/${summary.id}`}>
                                    <h3 className="text-md md:text-xl font-bold hover:cursor-pointer hover:text-blue-500">{summary.episode.title}</h3>
                                </Link>
                            </div>
                            {readStatus && 
                            <span className="flex items-center text-sm text-gray-400 italic">
                                <DotFilledIcon onClick={toggleReadStatus} className={`w-8 h-8 hover:bg-slate-200 hover:cursor-pointer rounded-md ${readStatus == 'true'? "text-gray-300" : "text-blue-400"}`} />
                            </span>}
                        </span>
                    </span>
    
                    {expanded && 
                        <div className="flex flex-col mt-5 w-[95%] md:text-md text-sm">
                            {content.takeaways.slice(0,3).map((line, i) => (
                                <ul className="list-disc" key={i}>
                                    <li key={i} className="mb-4 ml-4 align-middle list-item">{line}</li>
                                </ul>
                            ))}

                            {content.quotes.slice(0,1).map((line, i) => (
                                    <p key={i} className="Quote mb-4">{line}</p>
                            ))}

                            <Link href={`/summaries/${summary.id}`} className="hover:cursor-pointer hover:underline text-blue-500">
                                Read More
                            </Link>

                        </div>
                    }
                    <hr className="h-[1px] bg-gray-300 mt-5"/>

                </div>
            </>
        )
    }
}