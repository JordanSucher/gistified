 'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Cross2Icon } from "@radix-ui/react-icons"
import SubscriptionSelector from './SubscriptionSelector'
import SelectSearch from 'react-select-search'

export default function AddSubscriptionButton () {
    const [formError, setFormError] = useState(false)
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const [publications, setPublications] = useState([])
    const [selected, setSelected] = useState()
    const [fromUrl, setFromUrl] = useState('existing')

    useEffect(() => {
        const fetchPublications = async () => {
            const res = await fetch('/api/publications?new=true')
            const data = await res.json()
            setPublications(data)
        }


        fetchPublications()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        let url
        // check if url is a podcast
        if (e.target.url && e.target.url.value) {
            url = e.target.url.value
        } else {
            url = selected
        }
        let result = await fetch(`/api/publication?url=${url}`)
        let isPodcast = await result.json()

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
                <button className='active:bg-black active:text-white px-2 py-1 bg-blue-400 rounded-md font-semibold focus:outline-none'>Add a subscription</button>
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
                        <select value={fromUrl} onChange={(e)=>{if(e.target.value == "new") {setFromUrl('new')} 
                            else {setFromUrl('existing')}}}
                            className='focus:outline-none w-[300px] bg-gray-100 rounded-md self-start p-1 px-2 mt-2'>
                            <option value="existing">Add an existing pod</option>
                            <option value="new">Add from rss feed url</option>
                        </select>
                    </label>

                    { fromUrl=='existing' && publications.length>0 && 
                        
                        <form className='flex flex-col items-start gap-2 my-5' onSubmit={handleSubmit}>
                            <label className=''>
                                <span className='self-start'>Choose a podcast</span>
                                <SelectSearch name="url" value={selected} onChange={setSelected} search={true} options={publications.map(publication => {return {name: publication.title, value: publication.rssFeedUrl}})} />
                            </label>
                            <input type="submit" value="Submit" className='hover:cursor-pointer self-start w-[100px]
                                mt-2 p-1 bg-blue-400 text-white font-semibold rounded-md active:bg-black active:text-white'/>
                        </form> 
                    }

                    { fromUrl=='existing' && publications.length==0 && <p className='text-gray-500 italic text-xs mt-[4px] pl-[9px]'>You are subscried to all existing podcasts</p> }

                    { fromUrl=='new' && 
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