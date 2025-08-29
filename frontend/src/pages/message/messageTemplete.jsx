import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApi, postApi } from "../../api";
import {formateDate} from "../../utiils/formateDate";
export default function MessageTemplateForm() {
    const [message, setMessage] = useState("");
    const queryClient = useQueryClient();

    const {
        data: response,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["messageTemplate"],
        queryFn: () => getApi("getMessageTemplete"),
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });

    // Populate local state once data arrives
    useEffect(() => {
        if (response?.message != null) {
            setMessage(response.message);
        }
    }, [response]);


    const mutation = useMutation({
        mutationFn: (newMessage) =>
            postApi(`updateMessageTemplete/${response._id}`, { message: newMessage }),
        onSuccess: (res) => {
            alert(res?.message || "Message template updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["messageTemplate"] });
        },
        onError: (err) => {
            console.error("Error updating message template:", err);
            alert("Failed to update message template. Please try again.");
        },
    });

    /* ------------------------------------------------------------------ */
    /* 3. Handlers                                                        */
    /* ------------------------------------------------------------------ */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) {
            alert("Please enter a message template.");
            return;
        }
        mutation.mutate(message);
    };

    /* ------------------------------------------------------------------ */
    /* 4. Render                                                          */
    /* ------------------------------------------------------------------ */
    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="bgGlass rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-3 rounded-full">
                                <i className="fas fa-comment-dots text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Message Template</h1>
                                <p className="text-blue-100 mt-1">
                                    Create and manage your message templates
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
                                <p className="text-gray-600">Loading message template...</p>
                            </div>
                        ) : isError ? (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                                <div className="flex items-center">
                                    <i className="fas fa-exclamation-circle text-red-500 mr-3" />
                                    <p className="text-sm text-red-700">
                                        Error loading message template:{" "}
                                        {(error)?.message || "Unknown error"}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label
                                        htmlFor="message"
                                        className="block text-gray-700 dark:text-white font-medium mb-2"
                                    >
                                        <i className="fas fa-edit text-blue-500 mr-2" />
                                        Message Template
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#00c2ff80] focus:border-[#00c2ff80] outline-0 transition duration-200 shadow-sm border-2 border-[#00c2ff80] dark:text-white" 
                                        placeholder="Enter your message template here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="text-sm text-gray-500 dark:text-white">
                                        <i className="fas fa-clock mr-1" />
                                        Last updated:{" "}
                                        { formateDate(response?.updatedAt)|| "Never"}
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            type="submit"
                                            disabled={mutation.isPending}
                                            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center ${mutation.isPending ? "opacity-70 cursor-not-allowed" : ""
                                                }`}
                                        >
                                            {mutation.isPending ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin mr-2" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save mr-2" />
                                                    Update Template
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}