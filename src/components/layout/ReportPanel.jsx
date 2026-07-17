import RadiusSlider from "./RadiusSlider"

export default function ReportPanel({value, setValue, loc, riskPointAvail, openModal}) {
    return (
        <div
        className="fixed w-full flex flex-row left-0 bottom-24 bg-transparent items-center justify-center z-9997 font-bold font-sans text-lg"
        >
            <div
                className="flex flex-row rounded-full bg-neutral-900/60 border border-white/20 backdrop-blur-xs items-stretch justify-center gap-5 py-3 px-3 transition-all duration-300 ease-in-out"
            >
                <div
                className="flex flex-col items-left justify-center pl-3"
                >
                    <RadiusSlider 
                    value={value}
                    setValue={setValue}
                    />
                </div>

                <button
                disabled={riskPointAvail === null}
                className={`flex items-center justify-center bg-red-700 rounded-full p-3 px-5 hover:bg-red-600 transition-all duration-300 ease-in-out select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                onClick={() => openModal()}
                >
                    Report
                </button>
            </div>
        </div>
    )
}