'use client'
import {useState, useEffect, useRef, use} from "react"
import { DotFilledIcon } from "@radix-ui/react-icons"
import { bionifyHTML, BionifyOptions, bionifyNode } from "bionify"
import { getSelectionDetails } from "../../lib/text"
import SaveButton from "./SaveButton"

export default function SingleSummary({id, Summary, content}) {
    let [readStatus, setReadStatus] = useState('true')
    let [bionified, setBionified] = useState(true)
    let bionifiedRef = useRef(true)
    const summaryRef = useRef(null)
    const [selectState, setSelectState] = useState(false)
    const [selectedText, setSelectedText] = useState("")
    const [selectionHeight, setSelectionHeight] = useState(0)
    const [bionifiedKey, setBionifiedKey] = useState(0)
    const [highlightedStrings, setHighlightedStrings] = useState([])

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

    const highlightText = async (text) => {
        let tosave = bionifyHTML(text) // text
        setHighlightedStrings([...highlightedStrings, tosave])
        setSelectState(false)
        // post to DB
        await fetch("/api/highlight", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                summaryId: id,
                text: tosave
            }),
        })
    }

    const toggleBionify = () => {
        setBionified(!bionified)
        bionifiedRef.current = !bionified
        setBionifiedKey(bionifiedKey + 1)
    }

    useEffect(() => {
        // load highlighted texts
        const getHighlights = async () => {
            let highlights = await fetch("/api/highlight?summaryId=" + id)
            highlights = await highlights.json()
            highlights = highlights.map((highlight) => {
                return highlight.content
            })
            setHighlightedStrings(highlights)
        }

        getHighlights()

    }, [bionifiedKey])

    useEffect(() => {
        // mark as read
        localStorage.setItem(`readStatus_${id}`, "true")
    }, [id])

    useEffect(() => {
        document.addEventListener('mouseup', checkForSelection)
        document.addEventListener('mousedown', (e)=>{
            try {
                if(e.target?.className?.includes("SaveButton")) {
                    e.preventDefault()
                    return
                } else {
                    return
                }
            } catch (error) {
                return
            }
        })
        return () => {
            document.removeEventListener('mouseup', checkForSelection)
            document.removeEventListener('mousedown', (e)=>{
                try {
                    if(e.target?.className?.includes("SaveButton")) {
                        e.preventDefault()
                        return
                    } else {
                        return
                    }
                } catch (error) {
                    return
                }
            })
        }
    },[])

    const checkForSelection = () => {
        let details = getSelectionDetails()

        let stringToCheck = details?.text
        if (bionifiedRef.current == true && stringToCheck) {
            stringToCheck = bionifyHTML(stringToCheck)
        }
        
        let canWeSaveThis = document.querySelector('.SingleSummaryContainer').innerHTML.indexOf(stringToCheck) !== -1

        if (details?.text.split(" ").length < 2 || !canWeSaveThis) {
            setSelectState(false)
        }

        else {
            setSelectState(true)
            details = getSelectionDetails()
            setSelectedText(details.text)
            let scrollTop = document.documentElement.scrollTop
            setSelectionHeight(details.top + scrollTop)
        }
    }

    useEffect(() => {
        console.log("highlightedStrings", highlightedStrings)
        processHighlightedText()
    }, [highlightedStrings])

    function processHighlightedText() {
        let processedStrings = [...highlightedStrings];

        processedStrings = processedStrings.map(string => {
            if(bionified == false){
                // replace all html tags
                string = string.replace(/(<([^>]+)>)/ig, '')
                return string
            } else {
                return string
            }
        })

        console.log("processedStrings", processedStrings)

        const container = document.querySelector('.SingleSummaryContainer');
        let innerHTML = container?.innerHTML;
       
        for (let i = 0; i < processedStrings.length; i++) {   
            const savedText = processedStrings[i];         
            const index = innerHTML?.indexOf(savedText);
            
            if (index >= 0) { 
                innerHTML = innerHTML.substring(0, index) + 
                "<span class='highlight bg-yellow-100'>" + 
                innerHTML.substring(index, index + savedText.length) + 
                "</span>" + 
                innerHTML.substring(index + savedText.length);
            }                
        }
        container.innerHTML = innerHTML;
    }
    
    return (
        Summary &&
        <div key={bionifiedKey} className='p-4 bg-gray-100 rounded-md max-w-[900px] md:mr-[10px] flex flex-col'>
             <span className="flex justify-start items-start">
                <img className={`w-[60px] h-[60px] select-none mt-[4px]`} src={Summary?.episode?.publication.imageurl} alt=""/> 
                <span className=" flex justify-between items-start w-full">
                    <div className="ml-4 flex flex-col align-middle">
                        <h2 className="text-xs md:text-sm">{Summary?.episode.publication.title}</h2>
                        <h2 className="text-xs md:text-sm">{new Date(Summary?.episode.publishedAt).toDateString()}</h2>
                        <h3 className="text-md md:text-lg max-w-[500px] font-bold">{Summary?.episode.title}</h3>
                    </div>
                    {readStatus && 
                    <div>
                        <span className="flex items-center text-sm text-gray-400 italic">
                            <p className="mr-2">Read</p>
                            <DotFilledIcon onClick={toggleReadStatus} className={`w-8 h-8 hover:bg-slate-200 hover:cursor-pointer rounded-md ${readStatus == 'true'? "text-gray-300" : "text-blue-400"}`} />
                        </span>
                        <button className="SmallButton w-[60px] Bionifier" onClick={toggleBionify}>Bionify</button>
                        <SaveButton onClick={()=>highlightText(selectedText)} className={"w-[fit-content] hidden md:inline absolute right-25" + (selectState ? " md:inline" : " md:hidden")}
                        style={{top: (selectionHeight - 10) + "px"}}
                        />
                    </div>
                    }
                </span>
            </span>
            <span className="mt-[5px]">
            </span>
                        
            <div className="mt-5 w-full pr-[20px] md:pr-[80px] SingleSummaryContainer" ref={summaryRef} >
                <ul className="pl-8 list-disc text-sm md:text-md">  
                    {content.takeaways.map((line, i) => (
                            <li key={`takeaway-${i}`} className="mb-4 list-item" 
                            {...(bionified ? {dangerouslySetInnerHTML:{__html: bionifyHTML(line) }} : {})}>
                                {/* {!bionified && line} - for some reason this doesnt work! */}
                                {!bionified ? line : null}
                            </li>
                    ))}
                </ul>

                <hr className="mb-4 h-[2px] bg-gray-300"></hr>

                <div className="pl-8 text-sm md:text-md">
                    {content.quotes.map((line, i) => (
                            <p key={`quote-${i}`} className="mb-4 md:Quote" 
                                {...(bionified ? {dangerouslySetInnerHTML:{__html: bionifyHTML(line) }} : {})}>
                                {!bionified ? line : null}

                            </p>
                    ))}
                </div>

                <hr className="mb-4 h-[2px] bg-gray-300"></hr>

                <div className="pl-8 text-sm md:text-md">
                    {content.summary.map((line, i) => (
                        <p key={`summary-${i}`} className="mb-4" 
                            {...(bionified ? {dangerouslySetInnerHTML:{__html: bionifyHTML(line) }} : {})}>
                            {!bionified ? line : null}

                        </p>
                    ))}
                </div>

            </div>
        </div>)
}