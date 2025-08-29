const Alert = ({ type = 'error', message = "Something went wrong" }) => {
    const alertStyles = {
        error: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            border: 'border-red-300',
            icon: 'fas fa-exclamation-triangle',
        },
        success: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            border: 'border-green-300',
            icon: 'fas fa-check-circle',
        },
    };

    const alertType = alertStyles[type] || alertStyles.error;

    return (
        <div className={`mb-6 p-5 ${alertType.bg} ${alertType.text} rounded-lg flex items-center gap-3 border ${alertType.border} shadow-sm`}>
            <i className={`${alertType.icon} text-xl`}></i>
            <span className="font-semibold">{message}</span>
        </div>
    );
};

export default Alert;