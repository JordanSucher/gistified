'use client'
import {useState, useEffect} from "react"
import { DotFilledIcon } from "@radix-ui/react-icons"
import { bionifyHTML, BionifyOptions, bionifyNode } from "bionify"

export default function SingleSummary({id, Summary, content}) {
    // const [Summary, setSummary] = useState(null)
    let [readStatus, setReadStatus] = useState('true')
    // const [content, setContent] = useState(null)

    const toggleReadStatus = () => {
        let curr = localStorage.getItem(`readStatus_${Summary.id}`)
        if (curr == "true") {
            curr = "false"
            localStorage.setItem(`readStatus_${Summary.id}`, curr)
            setReadStatus(curr)
        } else {
            curr = "true"
            localStorage.setItem(`readStatus_${Summary.id}`, curr)
            setReadStatus(curr)
        }
    }

    useEffect(() => {
        // mark as read
        localStorage.setItem(`readStatus_${id}`, "true")
    }, [id])

    
    return (
        Summary &&
        <div className='p-4 bg-gray-100 rounded-md max-w-[900px] md:mr-[10px] flex flex-col'>
             <span className="flex justify-start items-center">
                <img className="w-[70px] h-[70px] select-none" src={Summary?.episode?.publication.imageurl} alt=""/> 
                <span className="flex justify-between items-center w-full">
                    <div className="ml-4 flex flex-col align-middle">
                        <h2 className="text-xs md:text-sm">{Summary?.episode.publication.title}</h2>
                        <h2 className="text-xs md:text-sm">{new Date(Summary?.episode.publishedAt).toDateString()}</h2>
                        <h3 className="text-md md:text-xl font-bold">{Summary?.episode.title}</h3>
                    </div>
                    {readStatus && 
                    <span className="flex items-center text-sm text-gray-400 italic">
                        <p className="mr-2">Read</p>
                        <DotFilledIcon onClick={toggleReadStatus} className={`w-8 h-8 hover:bg-slate-200 hover:cursor-pointer rounded-md ${readStatus == 'true'? "text-gray-300" : "text-blue-400"}`} />
                    </span>}
                </span>
            </span>
                        
            <div className="mt-5 w-full pr-[20px] md:pr-[80px]">
                <ul className="pl-8 list-disc text-sm md:text-lg">  
                    {content.takeaways.map((line, i) => (
                            <li key={`takeaway-${i}`} className="mb-4 list-item" dangerouslySetInnerHTML={{__html: bionifyHTML(line) }} />
                    ))}
                </ul>

                <hr className="mb-4 h-[2px] bg-gray-300"></hr>

                <div className="pl-8 text-sm md:text-lg">
                    {content.quotes.map((line, i) => (
                            <p key={`quote-${i}`} className="mb-4 md:Quote " dangerouslySetInnerHTML={{__html: bionifyHTML(line) }} />
                    ))}
                </div>

                <hr className="mb-4 h-[2px] bg-gray-300"></hr>

                <div className="pl-8 text-sm md:text-lg">
                    {content.summary.map((line, i) => (
                        <p key={`summary-${i}`} className="mb-4" dangerouslySetInnerHTML={{__html: bionifyHTML(line) }} />
                    ))}
                </div>

            </div>
        </div>)
}