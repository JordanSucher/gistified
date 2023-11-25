export default function SummaryCard ({summary}) {
    return (
        <div className='p-4 bg-gray-100 rounded-md mb-3 w-full'>
            <span>
                <img src="" alt=""/> 
                <div>
                    <h2>{summary.subscription.name}</h2>
                    <p>{summary.text}</p>
                </div>    
            </span>
        </div>
    )
}