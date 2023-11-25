import SummaryCard from "../ui/Summaries/SummaryCard"
export default function Summaries () {

    let summaries = [{
        id: 1,
        text: 'Summary 1',
        subscription: {            
            id: 1,
            name: 'Sub 1',
            description: 'Sub 1 description'
        }
    }, {
        id: 2,
        text: 'Summary 2',
        subscription: {
            name: 'Sub 2',
            description: 'Sub 2 description'            
        }
    }]

    return (
        <div className='w-full h-full'>
            <h1>Summaries</h1>
            <div className="w-full ">
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