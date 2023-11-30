'use client'
import {useState, useEffect} from "react"
import { DotFilledIcon } from "@radix-ui/react-icons"


export default function SingleSummary({id}) {
    const [Summary, setSummary] = useState(null)
    let [readStatus, setReadStatus] = useState('true')
    const [content, setContent] = useState(null)

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
        async function fetchSummary() {
            let response = await fetch(`/api/summary/?id=${id}`)
            let curr = await response.json()
            setSummary(curr)
            let cont = JSON.parse(curr.content)
            setContent(cont)
        }
        fetchSummary()
        
        // mark as read
        localStorage.setItem(`readStatus_${id}`, "true")
    }, [id])
    
    return (
        Summary &&
        <div className='p-4 bg-gray-100 rounded-md max-w-[900px] flex flex-col'>
             <span className="flex justify-start items-center">
                <img className="w-[70px] h-[70px] select-none" src={Summary?.episode?.publication.imageurl} alt=""/> 
                <span className="flex justify-between items-center w-full">
                    <div className="ml-4 flex flex-col align-middle">
                        <h2 className="text-sm">{Summary?.episode.publication.title}</h2>
                        <h2 className="text-sm">{new Date(Summary?.episode.publishedAt).toDateString()}</h2>
                        <h3 className="text-xl font-bold">{Summary?.episode.title}</h3>
                    </div>
                    {readStatus && 
                    <span className="flex items-center text-sm text-gray-400 italic">
                        <p className="mr-2">Read</p>
                        <DotFilledIcon onClick={toggleReadStatus} className={`w-8 h-8 hover:bg-slate-200 hover:cursor-pointer rounded-md ${readStatus == 'true'? "text-gray-300" : "text-blue-400"}`} />
                    </span>}
                </span>
            </span>
            
            
            <div className="mt-5 w-full">
                <ul className="pl-8 list-disc">  
                    {content.takeaways.map((line, i) => (
                            <li key={i} className="mb-4 list-item">{line}</li>
                    ))}
                </ul>

                <div className="pl-8">
                    {content.quotes.map((line, i) => (
                            <p key={i} className="mb-4 Quote">{line}</p>
                    ))}
                </div>

                <div className="pl-8">
                    {content.summary.map((line, i) => (
                        <p key={i} className="mb-4">{line}</p>
                    ))}
                </div>

            </div>
        </div>
    )
}