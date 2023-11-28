 'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { useRouter } from 'next/navigation'


export default function AddSubscriptionButton () {
    const [formError, setFormError] = useState(false)
    const [open, setOpen] = useState(false)
    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault()
        // check if url is a podcast
        let url = e.target.url.value
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
            await router.refresh()
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
                        <button className='self-right'>x</button>
                        </Dialog.Close>
                    </span>
                    <form className='flex flex-col items-end gap-2 my-1' onSubmit={handleSubmit}>
                        <input type="url" name="url" placeholder="Enter rss feed url" className='w-[300px] bg-gray-100 rounded-md self-start p-1 px-2 mt-2'/>
                        {formError && <p className='text-red-500 text-sm self-start px-1'>Invalid podcast feed</p>}
                        <input type="submit" value="Submit" className='hover:cursor-pointer self-start w-[100px]
                         mt-2 p-1 bg-blue-400 text-white font-semibold rounded-md active:bg-black active:text-white'/>
                    </form>
                   
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>                
    )
}