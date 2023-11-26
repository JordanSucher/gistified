export default function SummaryCard ({summary}) {
    return (
        <div className='p-4 bg-gray-100 rounded-md mb-3 w-full'>
            <span>
                <img src="" alt=""/> 
                <div>
                    <h2>{summary.episode.publication.title}</h2>
                    <h3>{summary.episode.title}</h3>
                    <p>{summary.content}</p>
                </div>    
            </span>
        </div>
    )
}