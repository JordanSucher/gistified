'use client'

import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import React, { useState, useEffect } from 'react';
import { useSelect } from 'react-select-search';


export default function SubscriptionSelector ({ options, value, multiple, disabled }) {

    // const [publications, setPublications] = useState([])
    // const [selected, setSelected] = useState()

    const [snapshot, valueProps, optionProps] = useSelect({
        options,
        value,
        multiple,
        disabled,
    });


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
        <div>
            <button type='button' {...valueProps}>{snapshot.displayValue}</button>
            {snapshot.focus && (
                <ul>
                    {snapshot.options.map((option) => (
                        <li key={option.value}>
                            <button {...optionProps} value={option.value}>{option.name}</button>
                        </li>
                    ))}
                </ul>
            )}
         </div>

        )
};
