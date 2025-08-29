import { useState } from "react";
import { messageApi } from "../../api";
import MessageAmount from "../../components/message/messageAmount";

export default function MainMessage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("all");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await messageApi("sendMessage", { message, status });
      alert(response?.data?.message);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-md rounded-2xl bg-white/50 p-6 shadow-xl sm:p-8">
        {/* Header */}
        <header className="mb-6 flex justify-center">
          <MessageAmount />
        </header>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Message textarea */}
          <div>
            <label
              htmlFor="message"
              className="mb-1 block text-sm font-semibold text-slate-700"
            >
              Message
            </label>
            <div className="relative">
              <i className="fas fa-comment absolute top-3 left-3 text-slate-400" />
              <textarea
                id="message"
                rows={3}
                placeholder="Enter Message"
                className="w-full resize-none rounded-md border border-slate-300 py-2 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          {/* Status select */}
          <div>
            <label
              htmlFor="status"
              className="mb-1 block text-sm font-semibold text-slate-700"
            >
              Status
            </label>
            <div className="relative">
              <i className="fas fa-chevron-down pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" />
              <select
                id="status"
                name="status"
                className="w-full appearance-none rounded-md border border-slate-300 bg-white/50 py-2.5 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-md bg-[#465fff] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            <i className="fas fa-paper-plane" />
            Send
          </button>
        </form>
      </div>
    </section>
  );
}