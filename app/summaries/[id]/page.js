import SingleSummary from "../../ui/Summaries/SingleSummary"

export default async function Summary({params}) {
    return (
        <SingleSummary id={params.id}/>
    )
}