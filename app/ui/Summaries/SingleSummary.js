'use client'
import {useState, useEffect, useRef} from "react"
import { DotFilledIcon } from "@radix-ui/react-icons"
import { bionifyHTML } from "bionify"
import { getSelectionDetails } from "../../lib/text"
import SaveButton from "./SaveButton"
import RemoveHighlightButton from "../Highlights/RemoveHighlightButton"

export default function SingleSummary({id, Summary, content}) {
    let [readStatus, setReadStatus] = useState('true')
    let [bionified, setBionified] = useState(false)
    let bionifiedRef = useRef(false)
    const summaryRef = useRef(null)
    const [selectState, setSelectState] = useState(false)
    const [selectedText, setSelectedText] = useState("")
    const [selectionHeight, setSelectionHeight] = useState(0)
    const [bionifiedKey, setBionifiedKey] = useState(0)
    const bionifiedKeyRef = useRef(0)
    const [highlightedStrings, setHighlightedStrings] = useState([])
    const [highlights, setHighlights] = useState([])

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

    const processHighlightText = async(text) => {
        let tosave = bionifyHTML(text) // text
        setHighlightedStrings([...highlightedStrings, tosave])
        // post to DB
        let response = await fetch("/api/highlight", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                summaryId: id,
                text: tosave
            }),
        })
        let newHighlight = await response.json()

        setHighlights([...highlights,newHighlight.highlight])

        setSelectState(false)


    }

    const highlightText = async (text) => {
        setSelectState(false)
        setTimeout(() => {
            processHighlightText(text)
        }, 50)
    }

    const toggleBionify = () => {
        setBionified(!bionified)
        bionifiedRef.current = !bionified
        setBionifiedKey(bionifiedKey + 1)
        bionifiedKeyRef.current = bionifiedKey + 1
    }

    useEffect(() => {
        // load highlighted texts
        const getHighlights = async () => {
            let highlights = await fetch("/api/highlight?summaryId=" + id)
            highlights = await highlights.json()
            setHighlights(highlights)

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

    const handleResize = () => {
        setBionifiedKey(bionifiedKeyRef.current + 1)
        bionifiedKeyRef.current = bionifiedKeyRef.current + 1
        processHighlightedText()
        console.log("resize")
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize)
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
            window.removeEventListener('resize', () => {
                processHighlightedText()
                console.log("resize")
            })
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
        setTimeout(() => {
            let details = getSelectionDetails()
    
            // Check if the selection is collapsed (no selection)
            if (!window.getSelection().toString()) {
                setSelectState(false);
                return;
            }
    
            let stringToCheck = details?.text
            if (bionifiedRef.current == true && stringToCheck) {
                stringToCheck = bionifyHTML(stringToCheck)
            }

            console.log(highlightedStrings.includes(stringToCheck))
            
            let canWeSaveThis = ( document.querySelector('.SingleSummaryContainer').innerHTML.indexOf(stringToCheck) !== -1 )
            const highlights = document.querySelectorAll('.SingleSummaryContainer span.bg-yellow-100');
            highlights.forEach((highlight) => {
                if (highlight.textContent.includes(stringToCheck)) {
                    canWeSaveThis = false;
                }
            });


            if (details?.text.split(" ").length < 2 || !canWeSaveThis || details?.text.length == 0) {
                setSelectState(false)
            } else {
                setSelectState(true)
                setSelectedText(details.text)
                let scrollTop = document.documentElement.scrollTop
                setSelectionHeight(details.top + scrollTop)
            }
        }, 10); // A small delay so that selection text is empty if clicking away
    }

    useEffect(() => {
        processHighlightedText()
    }, [highlights])

    function processHighlightedText() {
        let processedHighlights = [...highlights];

        processedHighlights = processedHighlights.map(highlight => {
            let string = highlight.content
            if(bionified == false){
                // replace all html tags
                string = string.replace(/(<([^>]+)>)/ig, '')
                return {id: highlight.id, string: string}
            } else {
                return {id: highlight.id, string: string}
            }
        })

        const container = document.querySelector('.SingleSummaryContainer');
        let innerHTML = container?.innerHTML

        for (let i = 0; i < processedHighlights.length; i++) {   
            const savedText = processedHighlights[i].string;
            const index = innerHTML?.indexOf(savedText);
            
            if (index >= 0) { 
                innerHTML = innerHTML.substring(0, index) + 
                "<span class='highlight bg-yellow-100 "+`highlight${processedHighlights[i].id}'>` + savedText + "</span>" + 
                innerHTML.substring(index + savedText.length);
            }                
        }
        container.innerHTML = innerHTML;

        // set button heights?
        processedHighlights.map((x)=>{
            // calc top
            let top = document.querySelector(`.highlight${x.id}`).getBoundingClientRect().top
            let scroll = document.documentElement.scrollTop
            top += scroll - 180
            // get button
            let button = document.querySelector(`.deletehighlight${x.id}`)
            button.classList.add(`top-[${top}px]`)
            button.style.top = top+"px"


        })

    }

/*
i need some way to show a delete button next to each highlight
i can construct one per highlight, then find the relevant section of text and use that to set the top attribute?
*/

    const removeHighlight = async (i, highlight) =>{
        const highlightElements = document.querySelectorAll(`.highlight${highlight.id}`);
        highlightElements.forEach(x=>x.classList.remove("bg-yellow-100"))
        setHighlightedStrings(highlightedStrings.filter(x=>x!==bionifyHTML(highlight.content)))
        setHighlights(highlights.filter(x=>x.id!==highlight.id))
        console.log("str", highlight.content)
        await fetch(`/api/highlight?highlightId=${highlight.id}`,{
            method: 'DELETE'
        })
    }    

    return (
        Summary &&
        <div key={bionifiedKey} className='p-2 md:p-4 bg-gray-100 rounded-md max-w-[900px] md:mr-[10px] flex flex-col'>
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
                    </div>
                    }
                    <div className="flex">
                    {selectState && <SaveButton onClick={()=>{highlightText(selectedText)}} className={"w-[fit-content] md:inline absolute right-25"}
                    style={{top: (selectionHeight - 10) + "px"}}
                    />}
                    </div>
                </span>
            </span>
            <span className="mt-[5px] flex justify-end w-[100%] h-[100%] relative">
                <>
                    {highlights.map((highlight,i)=>(
                        <RemoveHighlightButton key={highlight.id} callback={()=>removeHighlight(i, highlight)} highlight={highlight} classes={`deletehighlight${highlight.id} absolute top-[2000px]`}/>
                    ))}
                </>
            </span>
                        
            <div className="mt-5 w-full pr-[20px] md:pr-[60px] lg:pr-[100px] xl:pr-[200px] SingleSummaryContainer" ref={summaryRef} >

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