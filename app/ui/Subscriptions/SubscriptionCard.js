export default function SubscriptionCard ({subscription}) {
    return (
        <div className='p-4 bg-gray-100 rounded-md mb-3 w-full'>
            <span>
                <img src="" alt=""/> 
                <div>
                    <h2>{subscription.publication.title}</h2>
                    <p>{subscription.publication.description}</p>
                </div>    
            </span>
        </div>
    )
}