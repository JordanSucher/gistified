export default async function Loading() {
    const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-100/60 before:to-transparent';

    return (
        <div className={`w-full h-full max-w-[1000px] self-center md:mr-24 px-8 ${shimmer}`}>
                <div className="w-full pr-4 mt-5">
                    <span className="w-[100%] flex items-center">
                        <div className="w-[70px] h-[70px] rounded-md bg-gray-200 m-2"></div>
                        <span className="grow flex flex-col gap-4 w-full h-[70px] justify-center">
                            <p className="bg-gray-200 w-full h-[30px] mx-2 rounded-md"></p>
                            <p className="bg-gray-200 w-full h-[30px] mx-2 rounded-md"></p>
                        </span>
                    </span>
                </div>

                <div className="w-full pr-4 mt-5">
                    <span className="w-[100%] flex items-center">
                        <div className="w-[70px] h-[70px] rounded-md bg-gray-200 m-2"></div>
                        <span className="grow flex flex-col gap-4 w-full h-[70px] justify-center">
                            <p className="bg-gray-200 w-full h-[30px] mx-2 rounded-md"></p>
                            <p className="bg-gray-200 w-full h-[30px] mx-2 rounded-md"></p>
                        </span>
                    </span>
                </div>
            </div>
    )
}