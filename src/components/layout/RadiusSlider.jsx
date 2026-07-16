'use client'

export default function RadiusSlider({value, setValue, locPoint}) {

    return (
        <>
            <label className="text-white">
                Radius: <span className="font-mono text-neutral-300">{value}m</span>
            </label>
            <input 
            type="range" 
            min="50"
            max="2000"
            step="10"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            />
        </>
    )
}