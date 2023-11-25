import SubscriptionCard from "../ui/Subscriptions/SubscriptionCard"
import AddSubscriptionButton from "../ui/Subscriptions/AddSubscriptionButton"

export default function Subscriptions () {

    let subscriptions = [{
        id: 1,
        name: 'Sub 1',
        description: 'Sub 1 description'
    }, {
        id: 2,
        name: 'Sub 2',
        description: 'Sub 2 description'
    }]

    return (
        <div className='w-full h-full'>
            <h1>Subscriptions</h1>
            <AddSubscriptionButton />
            <div className="w-full ">
                {subscriptions.map((subscription) => (
                    <SubscriptionCard
                        key={subscription.id}
                        subscription={subscription}
                    />
                ))}
            </div>
        </div>
    )
}