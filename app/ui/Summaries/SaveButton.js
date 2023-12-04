'use client'

export default function SaveButton({className, style, onClick}) {
    
    return (
        <div className={"SaveButton p-2 h-[26px] "+className} style={style} onClick={onClick}>Save</div>

    )
}