
import React, { useState, useRef, useEffect } from 'react';
import { putApi, getApi } from '../../api';
import { useNavigate, useParams } from 'react-router';
import { ErrorMessage } from '../../components/ui/errorMessage';
import { LoadingSpinner } from '../../components/ui/loader';
const editCourse = () => {
    const [formData, setFormData] = useState({
        name: '',
        time: '',
        fee: '',
    });

    const [isError, setError] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [submiting, setSubmiting] = useState(false);


    const navigate = useNavigate();
    const { id } = useParams();


    // Create refs for each input
    const nameRef = useRef(null);
    const timeRef = useRef(null);
    const feeRef = useRef(null);

    // Auto focus name on component mount
    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Course name is required';
        if (!formData.time) newErrors.time = 'Time is required';
        if (!formData.fee) {
            newErrors.fee = 'Fee is required';
        } else if (isNaN(formData.fee)) {
            newErrors.fee = 'Fee must be a number';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setSubmiting(true);
            try {
                await putApi(`updateCourse/${id}`, formData);
                navigate('/course/all');
                console.log("error 1");
            } catch (error) {
                console.log("error 2");
                setError(true);
            } finally {
                console.log("error 3");
                setErrors({});
                setFormData({ name: '', time: '', fee: '' });
                if (nameRef.current) nameRef.current.focus();
                setSubmiting(false);
            }
        }
    };

    // Handle Enter key press to focus next input or submit form
    const handleKeyDown = (e, field) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (field === 'name' && timeRef.current) {
                timeRef.current.focus();
            } else if (field === 'time' && feeRef.current) {
                feeRef.current.focus();
            } else if (field === 'fee') {
                handleSubmit(e);
            }
        }
    };

    const fetchCourse = async () => {
        try {
            const response = await getApi(`getCourse/${id}`);
            setFormData(response);
        } catch (error) {
            setError(true);
            console.error('Error fetching course:', error);
            // navigate('/course/all');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [id]);

    if (isError) {
        return <ErrorMessage error={{ message: 'Error fetching course' }} onRetry={() => fetchCourse()} />
    }
    if (loading) {
        return <LoadingSpinner />
    }
    return (
        <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl p-6 rounded-lg shadow-md dark:bg-boxdark bgGlass">
                <div className="flex items-center justify-center mb-6">
                    <h2 className="text-2xl font-bold text-center text-black dark:text-white">Edit Course</h2>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-black dark:text-white">
                            Course Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onKeyDown={(e) => handleKeyDown(e, 'name')}
                            placeholder="Enter Course Name"
                            className={`w-full px-3 py-2 text-black bg-transparent border rounded-md outline-none focus:border-primary dark:text-white dark:border-strokedark dark:focus:border-primary ${errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                            ref={nameRef}
                            autoComplete="off"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="time" className="block mb-2 text-sm font-medium text-black dark:text-white">
                            Time
                        </label>
                        <input
                            type="text"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            onKeyDown={(e) => handleKeyDown(e, 'time')}
                            placeholder="e.g. 9:00 AM"
                            className={`w-full px-3 py-2 text-black bg-transparent border rounded-md outline-none focus:border-primary dark:text-white dark:border-strokedark dark:focus:border-primary ${errors.time ? 'border-red-500' : 'border-gray-300'
                                }`}
                            ref={timeRef}
                            autoComplete="off"
                        />
                        {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time}</p>}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="fee" className="block mb-2 text-sm font-medium text-black dark:text-white">
                            Fee
                        </label>
                        <input
                            type="text"
                            id="fee"
                            name="fee"
                            value={formData.fee}
                            onChange={handleChange}
                            onKeyDown={(e) => handleKeyDown(e, 'fee')}
                            placeholder="Enter Course Fee"
                            className={`w-full px-3 py-2 text-black bg-transparent border rounded-md outline-none focus:border-primary dark:text-white dark:border-strokedark dark:focus:border-primary ${errors.fee ? 'border-red-500' : 'border-gray-300'
                                }`}
                            ref={feeRef}
                            autoComplete="off"
                        />
                        {errors.fee && <p className="mt-1 text-xs text-red-500">{errors.fee}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={submiting}
                        className="w-full px-4 py-2 font-medium text-white bg-brand-500 rounded-md hover:bg-opacity-90 focus:outline-none"
                    >
                        {submiting ? <i className="fas fa-spinner animate-spin"></i> : 'Update Course'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default editCourse;





