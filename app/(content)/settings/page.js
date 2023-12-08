import prisma from '../../prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/authOptions"
import SettingSelector from "../../ui/Settings/SettingSelector"

export default async function Summaries () {
    
    let session = await getServerSession(authOptions)

    let user = session ? await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    }) : null

    return (
        <div className='w-full h-full max-w-[1000px] mt-[10px] self-center mx-24'>
            <h1 className="text-xl m-0 p-0 mb-5">Your Settings</h1>
            <SettingSelector emailPreference={user?.emailPreference} id={user?.id} />
        </div>
    )
}