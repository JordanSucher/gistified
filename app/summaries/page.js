import SummaryCard from "../ui/Summaries/SummaryCard"
import prisma from '../prisma'
export default async function Summaries () {

      let summaries = await prisma.summary.findMany({
        include: {
            // publication: true,
            episode: {
                include: {
                    publication: true
                }
            }
        }
        })
    
    return (
        <div className='w-full h-full max-w-[1000px] self-center'>
            <span className="flex justify-between items-center py-2 px-4 mb-2">
                <h1 className="text-xl m-0 p-0">Your Summaries</h1>
            </span>
            <div className="w-full px-4">
            {summaries.map((summary) => (
                <SummaryCard
                key={summary.id}
                summary={summary}
            />
            ))}
            </div>
        </div>
    )
}

