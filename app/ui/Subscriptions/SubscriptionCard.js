
import RemoveSubscriptionButton from "./RemoveSubscriptionButton"
import {stripHtml} from "../../lib/text"

export default function SubscriptionCard ({subscription}) {
    return (
        <div className='p-4 bg-gray-100 rounded-md mb-3 w-full'>
            <span className="flex justify-start items-start w-full">
                <img className="w-[70px] h-[70px] mt-[4px]" src={subscription.publication.imageurl} alt=""/> 
                <div className="ml-4 flex flex-col align-middle w-full">
                    <span className="flex justify-between items-center">
                        <h2 className="text-md font-bold">{subscription.publication.title}</h2>
                    </span>
                    <h2 className="text-sm w-[95%]">{stripHtml(subscription.publication.description.toString())}</h2>
                </div>    
                <div>
                    <RemoveSubscriptionButton subscription={subscription} />    
                </div>
            </span>
        </div>
    )
}