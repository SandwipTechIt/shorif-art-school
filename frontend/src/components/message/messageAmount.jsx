import { getApi } from "../../api";
import { useQuery } from "@tanstack/react-query";


export default () => {
    const { data, loading, error } = useQuery({
        queryKey: ["messageAmount"],
        queryFn: () => getApi("messageAmount"),
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <div className="flex flex-col justify-center items-center p-3">
        <div className="max-w-xl w-full bg-white/50 rounded-lg px-4 py-10 border border-[#00c2ff80]">
            <h1 className="text-2xl font-bold">Message Amount: <span className="text-green-500">৳{data?.balance}</span></h1>
            <h1 className="text-2xl font-bold"><span className="text-green-500">{Math.floor(Number(data?.balance / 0.35))}</span> message can be send</h1>
        </div>
    </div>;
}