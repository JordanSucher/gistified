import SingleSummary from './SingleSummary'

export default async function SummaryWrapper ({id}) {

    let summary = await prisma.summary.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            episode: {
                include: {
                    publication: true
                }
            }
        }
    })
    
    let content = JSON.parse(summary.content.replace("```json", "").replace("```", ""))
        
    return (
        <SingleSummary id={id} Summary={summary} content={content} />
    )
}