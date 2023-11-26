import SubscriptionCard from "../ui/Subscriptions/SubscriptionCard"
import AddSubscriptionButton from "../ui/Subscriptions/AddSubscriptionButton"
import prisma from '../prisma'
import { isThisAPodcast } from '../lib/rss'
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function Subscriptions () {

    let session = await getServerSession(authOptions)

    let subscriptions = session ? await prisma.subscription.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            publication: true
        }
    }) : []

    return (
        <div className='w-full h-full max-w-[1000px] self-center'>
            <span className="flex justify-between items-center py-2 px-4 mb-2">
                <h1 className="text-xl m-0 p-0">Your Subscriptions</h1>
                <AddSubscriptionButton />
            </span>
            <div className="w-full px-4">
                {subscriptions.map((subscription, index) => (
                    <SubscriptionCard
                        key={index}
                        subscription={subscription}
                    />
                ))}
            </div>
        </div>
    )
}