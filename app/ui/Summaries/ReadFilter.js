'use client'

import * as Switch from '@radix-ui/react-switch';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


export default function ReadFilter({readFilter, setReadFilter}) {
    const router = useRouter()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        let curr = localStorage.getItem("readFilter")
        if (curr == "true") {
            setReadFilter(true)
            setChecked(true)
        } else {
            setReadFilter(false)
            setChecked(false)
        }
    }, [setReadFilter])

    const toggleReadFilter = () => {
        let curr = localStorage.getItem("readFilter")
        if (curr == "true") {
            localStorage.setItem("readFilter", "false")
            setReadFilter(false)
            setChecked(false)
        } else {
            setReadFilter(true)
            setChecked(true)
            localStorage.setItem("readFilter", "true")
        }

        router.refresh()
    }

    return (
        <form className="p-1 m-1">
        <div className='flex items-center'>
          <label className="Label" htmlFor="airplane-mode" style={{ paddingRight: 15 }}>
            Hide read
          </label>
          <Switch.Root className="SwitchRoot" id="airplane-mode" checked={checked} onCheckedChange={toggleReadFilter}>
            <Switch.Thumb className="SwitchThumb z-0" />
          </Switch.Root>
        </div>
      </form>
    
    )
}