'use client'

import SummaryCard from "../../ui/Summaries/SummaryCard"
import AddSubscriptionButton from "../../ui/Subscriptions/AddSubscriptionButton"
import ReadFilter from "../../ui/Summaries/ReadFilter"
import { SessionProvider } from 'next-auth/react'
import { useState, useEffect} from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'



export default function Summaries (Component) {
    return (
        <SessionProvider>
            <SummariesInner />
        </SessionProvider>
    )
}

function SummariesInner () {
    const [loading, setLoading] = useState(true)
    const [summaries, setSummaries] = useState([])
    const [allExpanded, setAllExpanded] = useState(false)
    const [allRead, setAllRead] = useState(null)
    const [readFilter, setReadFilter] = useState(false)
    const [selected, setSelected] = useState()


    useEffect(() => {
        const grabSummaries = async () => {
            try {
                let response = await (await fetch('/api/summaries')).json()
                setSummaries(response)
                setLoading(false)
            }
            catch (error) {
                console.log("error", error.message)
            }
        }
        grabSummaries()
    }, [])


    const items = summaries.map(summary=>{
        return {
            id: summary.episode.publication.id,
            name: summary.episode.publication.title
        }
    }).reduce((acc, item) => {
        const x = acc.find((i) => i.id === item.id)
        if (!x) {
          return acc.concat([item])
        } else {
          return acc
        }
    }, [])


    
      const handleOnSearch = (string, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        setSelected(null)
      }
    
    
      const handleOnSelect = (item) => {
        // the item selected
        setSelected(item.id)
      }
    
      const handleOnClear = () => {
        // clear selection
        setSelected(null)
      }
    
      const formatResult = (item) => {
        return (
          <>
            <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
          </>
        )
      }

      useEffect(() => {
          console.log("selected", selected)
      }, [selected])

    if (loading == true) {
        const shimmer =
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-100/60 before:to-transparent';
    


        return (
            <div className={`w-full h-full max-w-[1000px] self-center md:mr-24 px-8 ${shimmer}`}>
            <div className="w-full pr-4 mt-5">
                <span className="w-[100%] flex items-center">
                    <div className="w-[70px] h-[70px] rounded-md bg-gray-200 m-2"></div>
                    <span className="grow flex flex-col gap-4 w-full h-[70px] justify-center">
                        <p className="bg-gray-200 w-full h-[30px] mx-2 rounded-md"></p>
                        <p className="bg-gray-200 w-full h-[30px] mx-2 rounded-md"></p>
                    </span>
                </span>
            </div>

            <div className="w-full pr-4 mt-5">
                <span className="w-[100%] flex items-center">
                    <div className="w-[70px] h-[70px] rounded-md bg-gray-200 m-2"></div>
                    <span className="grow flex flex-col gap-4 w-full h-[70px] justify-center">
                        <p className="bg-gray-200 w-full h-[30px] mx-2 rounded-md"></p>
                        <p className="bg-gray-200 w-full h-[30px] mx-2 rounded-md"></p>
                    </span>
                </span>
            </div>
        </div>
        )
    }
    
    else if (summaries.length > 0) {
        return (
            <div className='w-full h-full max-w-[1000px] self-center md:mr-24 overflow-y-auto'>
                <div className="fixed z-30 bg-gray-100 w-[90%] max-w-[1000px]">
                    <span className="z-30 bg-gray-100 flex-col flex justify-between items-start py-2 pr-4 mb-2">
                        <h1 className="text-xl m-0 p-0 mb-1">Your Summaries</h1>
                        <span className="flex">
                            <button className="SmallButton hidden md:block"
                            onClick={() => setAllExpanded(true)}>Expand all</button>
                            <button className="SmallButton hidden md:block"
                            onClick={() => setAllExpanded(false)}>Collapse all</button>
                            <button className="SmallButton hidden md:block"
                            onClick={() => setAllRead(true)}>Mark all as read</button>
                            <button className="SmallButton hidden md:block"
                            onClick={() => setAllRead(false)}>Mark all as unread</button>

                        </span>
                        <span className="w-full flex items-center mt-2 gap-2">
                            <div className="w-[300px]">
                                <ReactSearchAutocomplete
                                    items={items}
                                    onSelect={handleOnSelect}
                                    onClear={handleOnClear}
                                    onSearch={handleOnSearch}
                                    autoFocus
                                    formatResult={formatResult}
                                    styling={{
                                        height: '30px',
                                        width: '100px',
                                        boxShadow: 'none',
                                        
                                    }}
                                />
                            </div>
                            <ReadFilter readFilter={readFilter} setReadFilter={setReadFilter} />

                        </span>
                    </span>
                </div>
                <div className="w-full px-4 pt-4 mt-28 ">
                {summaries.filter((summary=>{
                    if (selected) {
                        return summary.episode.publication.id == selected
                    }
                    else {
                        return summary
                    }
                })).map((summary) => {
                    return (
                    <>
                        <SummaryCard
                        key={summary.id}
                        summary={summary}
                        allExpanded={allExpanded}
                        setAllExpanded={setAllExpanded}
                        allRead={allRead}
                        setAllRead={setAllRead}
                        readFilter={readFilter}
                        setReadFilter={setReadFilter}
                        />
                        {/* <hr className="h-[1px] bg-gray-300"/> */}
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

