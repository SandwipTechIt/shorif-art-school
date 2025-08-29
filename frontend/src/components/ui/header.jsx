import { Link } from "react-router";

export default ({ title, linkTo, linkText }) => (
    <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight">{title}</h1>
        <Link
            to={linkTo}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 focus:outline-none text-white font-semibold px-5 py-3 rounded-lg shadow-md transition"
        >
            <i className="fas fa-plus"></i> {linkText}
        </Link>
    </div>
);