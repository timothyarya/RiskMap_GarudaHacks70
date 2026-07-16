import RadiusSlider from "./RadiusSlider"

export default function ReportPanel({value, setValue, loc}) {
    return (
        <div
        className="fixed w-full flex flex-row left-0 bottom-24 bg-transparent items-center justify-center z-99 font-bold font-sans text-lg"
        >
            <div
                className="flex flex-row rounded-full bg-neutral-900/50 border border-white/20 backdrop-blur-xs items-stretch justify-center gap-5 py-3 px-3 transition-all duration-300 ease-in-out"
            >
                <div
                className="flex flex-col items-center justify-center pl-3"
                >
                    <RadiusSlider 
                    value={value}
                    setValue={setValue}
                    />
                </div>

                <div
                className="flex items-center justify-center bg-red-700 rounded-full p-3 px-5"
                >
                    Report
                </div>
            </div>
        </div>
    )
}