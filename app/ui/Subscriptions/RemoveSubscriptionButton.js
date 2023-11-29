'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { Cross2Icon } from "@radix-ui/react-icons"
import { useRouter } from 'next/navigation'


export default function RemoveSubscriptionButton ({subscription}) {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleRemove = async () => {

        console.log("subscription", subscription)
        // remove from subscriptions
        await fetch('/api/subscription', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: subscription.userId,
                publicationId: subscription.publicationId
            })
        })

        // refresh data on this page
        router.refresh()

        // close dialog
        setOpen(false)
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Cross2Icon className="w-6 h-6 text-gray-500 rounded-md hover:cursor-pointer hover:bg-slate-200 p-1" />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className='DialogOverlay'/>
                <Dialog.Content className='DialogContent'>
                    <span className='w-full flex justify-between '>
                        <Dialog.Title className='DialogTitle'>Remove Subscription?</Dialog.Title>
                        <Dialog.Close asChild>
                            <Cross2Icon className="rounded-md w-6 h-6 text-gray-500 hover:cursor-pointer hover:bg-slate-200 p-1 self-right" />
                        </Dialog.Close>
                    </span>
                    <button 
                    className='text-black bg-blue-300 active:bg-black active:text-white rounded-md 
                    px-3 py-1 text-md mt-3 font-bold text-sm self-start px-1' onClick={handleRemove}>
                    Confirm
                    </button>
            </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root>

    )
    }