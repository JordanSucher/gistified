'use client'

import * as Switch from '@radix-ui/react-switch';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


export default function ReadFilter() {
    const router = useRouter()
    const [readFilter, setReadFilter] = useState(false)

    useEffect(() => {
        let curr = localStorage.getItem("readFilter")
        if (curr == "true") {
            setReadFilter(true)
        } else {
            setReadFilter(false)
        }
    }, [])

    const toggleReadFilter = () => {
        let curr = localStorage.getItem("readFilter")
        if (curr == "true") {
            localStorage.setItem("readFilter", "false")
            setReadFilter(false)
        } else {
            setReadFilter(true)
            localStorage.setItem("readFilter", "true")
        }

        router.refresh()
    }

    return (
        <form>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label className="Label" htmlFor="airplane-mode" style={{ paddingRight: 15 }}>
            Hide read summaries
          </label>
          <Switch.Root className="SwitchRoot" id="airplane-mode" checked={readFilter} onCheckedChange={toggleReadFilter}>
            <Switch.Thumb className="SwitchThumb" />
          </Switch.Root>
        </div>
      </form>
    
    )
}