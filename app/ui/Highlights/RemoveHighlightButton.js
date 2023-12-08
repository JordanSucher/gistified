'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { Cross2Icon } from "@radix-ui/react-icons"
import { useRouter } from 'next/navigation'


export default function RemoveSubscriptionButton ({highlight, classes,  callback}) {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleRemove = async () => {

        if(callback) {
            callback()
        }

        else{
            // remove from highlights
            await fetch(`/api/highlight?highlightId=${highlight.id}`, {
                method: 'DELETE',
            })
    
            // refresh data on this page
            router.refresh()
    
            // close dialog
            setOpen(false)
        }

    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen} className={classes}>
            <Dialog.Trigger asChild>
                <Cross2Icon className={"w-6 h-6 text-gray-500 rounded-md hover:cursor-pointer hover:bg-slate-200 p-1 " + classes} />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className='DialogOverlay'/>
                <Dialog.Content className='DialogContent'>
                    <span className='w-full flex justify-between '>
                        <Dialog.Title className='DialogTitle'>Remove Highlight?</Dialog.Title>
                        <Dialog.Close asChild>
                            <Cross2Icon className="rounded-md w-6 h-6 text-gray-500 hover:cursor-pointer hover:bg-slate-200 p-1 self-right" />
                        </Dialog.Close>
                    </span>
                    <button 
                    className='text-black bg-blue-300 active:bg-black active:text-white rounded-md 
                    px-3 py-1 text-md mt-3 font-bold text-sm self-start px-1 focus:outline-none' onClick={handleRemove}>
                    Confirm
                    </button>
            </Dialog.Content>
        </Dialog.Portal>
        </Dialog.Root>

    )
    }