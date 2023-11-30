'use client'

import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import React, { useState, useEffect } from 'react';

const SettingSelector = ({emailPreference, id}) => {
    const [emailPref, setEmailPref] = useState(emailPreference)

    const changeEmailPref = async (value) => {
        setEmailPref(value)
        // persist to DB on change
        await fetch(`/api/settings`, {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                emailPref: value
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    return (
        <span className='flex gap-4 items-center'>
            <h2>Email Notifications</h2>
            <Select.Root onValueChange={changeEmailPref} value={emailPref}>
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
                <Select.Viewport className="SelectViewport">
                    <Select.Group>
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
  
  export default SettingSelector;
  