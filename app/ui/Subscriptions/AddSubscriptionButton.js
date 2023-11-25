 'use client'

import * as Dialog from '@radix-ui/react-dialog'

export default function AddSubscriptionButton () {
    return (

        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button>Add a subscription</button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay />
                <Dialog.Content>
                    <Dialog.Title>Add Subscription</Dialog.Title>
                    <Dialog.Description>
                        Add a new subscription
                    </Dialog.Description>
                    <Dialog.Close asChild>
                        <button>Close</button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>

                
    )
}