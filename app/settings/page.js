import prisma from '../prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/authOptions"
import AddSubscriptionButton from "../ui/Subscriptions/AddSubscriptionButton"
import ReadFilter from "../ui/Summaries/ReadFilter"
import SettingSelector from "../ui/Settings/SettingSelector"

export default async function Summaries () {
    
    let session = await getServerSession(authOptions)

    let user = session ? await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    }) : null

    return (
        <div className='w-full h-full max-w-[1000px] mt-[10px] self-center mx-24'>
            <h1 className="text-3xl font-bold text-black mb-4">Settings</h1>
            <SettingSelector emailPreference={user?.emailPreference} id={user?.id} />
        </div>
    )
}