 'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Cross2Icon } from "@radix-ui/react-icons"
import SubscriptionSelector from './SubscriptionSelector'



export default function AddSubscriptionButton () {
    const [formError, setFormError] = useState(false)
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const [publications, setPublications] = useState([])
    const [selected, setSelected] = useState()
    const [fromUrl, setFromUrl] = useState(false)

    useEffect(() => {
        const fetchPublications = async () => {
            const res = await fetch('/api/publications')
            const data = await res.json()
            setPublications(data)
            console.log("publications", data)
        }


        fetchPublications()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        // check if url is a podcast
        let url = e.target.url.value
        console.log("url", url)
        let result = await fetch(`/api/publication?url=${url}`)
        let isPodcast = await result.json()
        console.log("isPodcast", isPodcast.isPodcast)
        if(isPodcast.isPodcast == false) {
            setFormError(true)
            return
        }
        else {
            setFormError(false)
            setOpen(false)
            // add to subscriptions
            await fetch('/api/subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url
                })
            })
            // refresh data on this page
            router.refresh()
        }
    }   

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <button className='active:bg-black active:text-white px-2 py-1 bg-blue-400 rounded-md font-semibold'>Add a subscription</button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className='DialogOverlay'/>
                <Dialog.Content className='DialogContent'>
                    <span className='w-full flex justify-between '>
                        <Dialog.Title className='DialogTitle'>Add Subscription</Dialog.Title>
                        <Dialog.Close asChild>
                            <Cross2Icon className="rounded-md w-6 h-6 text-gray-500 hover:cursor-pointer hover:bg-slate-200 p-1 self-right" />
                        </Dialog.Close>
                    </span>

                    <label className='flex flex-col mt-4'>
                        <span className='self-start'>Choose a method</span>
                        <select onChange={(e)=>{if(e.target.value == "new") {setFromUrl(true)} 
                            else {setFromUrl(false)}}}
                            className='w-[300px] bg-gray-100 rounded-md self-start p-1 px-2 mt-2'>
                            <option value="existing">Add existing pod</option>
                            <option value="new">Add from rss feed url</option>
                        </select>
                    </label>

                    { !fromUrl && <form className='flex flex-col items-end gap-2 my-5' onSubmit={handleSubmit}>
                        <label className=''>
                            <span className='self-start'>Choose a podcast</span>
                            <select name="url" onChange={(e) => setSelected(e.target.value)} value={selected} className='w-[300px] bg-gray-100 rounded-md self-start p-1 px-2 mt-2'>
                                {publications.map((publication) => {
                                return (
                                    <option key={publication.id} value={publication.rssFeedUrl}>{publication.title}</option>
                                )})}
                                <option value="daily">Daily</option>
                            </select>
                        </label>
                        <input type="submit" value="Submit" className='hover:cursor-pointer self-start w-[100px]
                            mt-2 p-1 bg-blue-400 text-white font-semibold rounded-md active:bg-black active:text-white'/>
                    </form> }

                    { fromUrl && 
                    <div className='mt-6'>
                    <form className='flex flex-col items-end gap-2 -mt-2' onSubmit={handleSubmit}>
                        <input type="url" name="url" placeholder="Enter rss feed url" className='w-[300px] bg-gray-100 rounded-md self-start p-1 px-2'/>
                        {formError && <p className='text-red-500 text-sm self-start px-1'>Invalid podcast feed</p>}
                        <input type="submit" value="Submit" className='hover:cursor-pointer self-start w-[100px]
                         mt-2 p-1 bg-blue-400 text-white font-semibold rounded-md active:bg-black active:text-white'/>
                    </form> 
                    </div> 
                    }
                   
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>                
    )
}