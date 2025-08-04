
export const ErrorMessage = ({ error, onRetry }) => {
    return (
        <div className="bg-red-50 p-8 rounded-xl text-center shadow-md border border-red-200 max-w-md mx-auto">
            <i className="fas fa-exclamation-circle mx-auto text-red-600 text-5xl mb-4"></i>
            <h3 className="text-2xl font-semibold text-red-800 mb-3 capitalize">{error?.message}</h3>
            <button
                onClick={onRetry}
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition focus:ring-4 focus:ring-red-300 focus:outline-none"
            >
                Retry
            </button>
        </div>
    )
};