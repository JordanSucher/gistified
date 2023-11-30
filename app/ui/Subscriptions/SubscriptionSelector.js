'use client'

import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import React, { useState, useEffect } from 'react';

const SubscriptionSelector = () => {

    const [publications, setPublications] = useState([])
    const [selected, setSelected] = useState()

    useEffect(() => {
        const fetchPublications = async () => {
            const res = await fetch('/api/publications')
            const data = await res.json()
            setPublications(data)
            console.log("publications", data)
        }


        fetchPublications()
    }, [])

    const addSubscription = async (value) => {
        await fetch(`/api/subscription`, {
            method: 'POST',
            body: JSON.stringify({
                url: value,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

    }

    return (
        <span className='flex gap-4 items-center z-60'>
            <h2>Select a publication</h2>
            <Select.Root onValueChange={setSelected} value={selected}>
            <Select.Trigger className="SelectTrigger" >
                <Select.Value placeholder="Select a frequency" />
                <Select.Icon className="SelectIcon">
                <ChevronDownIcon />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content className="SelectContent">
                <Select.ScrollUpButton className="SelectScrollButton">
                    <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport className="SelectViewport z-80">
                    <Select.Group>
                        {publications.map((publication) => (
                            <SelectItem key={publication.id} value={publication.rssFeedUrl}>
                                {publication.title}
                            </SelectItem>
                        )).join('\n')}
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                    </Select.Group>

                </Select.Viewport>
                <Select.ScrollDownButton className="SelectScrollButton">
                    <ChevronDownIcon />
                </Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
            </Select.Root>
        </span>
    )
};
  
  const SelectItem = React.forwardRef(({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item className={'SelectItem'} {...props} ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  });

  SelectItem.displayName = 'SelectItem';
  
  export default SubscriptionSelector;
  