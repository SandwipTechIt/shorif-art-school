import { useQuery } from "@tanstack/react-query";
import { getApi, postApi } from "../../api";
import MessageAmount from "../../components/message/messageAmount";
export default () => {
    const { data: messageExample, loading, error } = useQuery({
        queryKey: ["messageExample"],
        queryFn: () => getApi("getMessageExample"),
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    const handelMessageSend = async () => {
        try  {
            const res = await postApi("sendDueMessage");
            alert(`${res.totalSentMessageAmount} message sent successfully out of ${res.totalStudent}`);
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <div>
            <MessageAmount />
            <div className="flex justify-center items-center mt-4 md:mt-10 p-3">
                <div className="max-w-xl w-full shadow-lg p-6 bg-white/50 rounded-lg px-4 py-10 border border-[#00c2ff80]">
                    <div className="flex items-center mb-4">
                        <i className="fas fa-envelope text-green-500 text-xl mr-2"></i>
                        <h2 className="text-xl font-semibold text-gray-800">পেমেন্ট মেসেজ ফরমেট স্যাম্পল</h2>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed text-[17px]">
                        {messageExample}
                    </p>
                </div>
            </div>

            <div className="flex justify-center items-center mt-6 md:mt-10">
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition" onClick={handelMessageSend}>
                    পেমেন্ট মেসেজ পাঠিয়ে দিন
                </button>
            </div>
        </div>
    );
}