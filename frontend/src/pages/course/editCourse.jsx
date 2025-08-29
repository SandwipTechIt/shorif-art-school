
import React, { useState, useEffect } from 'react';
import { putApi, getApi } from '../../api';
import { useNavigate, useParams } from 'react-router';
import ErrorMessage from '../../components/ui/errorMessage';
import Loader from '../../components/ui/loader';
import AddCourse from '../../components/course/courseForm';

const editCourse = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const[loading, setLoading] = useState(true);
    const[isError, setError] = useState(false);
    const[formData, setFormData] = useState({
        id: 1,
        name: "Advanced Mathematics",
        fee: "$150",
        time: ["9:00 AM", "2:00 PM"]
      });

    const handleSubmit = async (data) => {
        try {
            await putApi(`updateCourse/${id}`, data);
            navigate('/course/all');
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourse = async () => {
        try {
            const response = await getApi(`getCourse/${id}`);
            setFormData(response);
        } catch (error) {
            setError(true);
            console.error('Error fetching course:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [id]);

    if (isError) {
        return <ErrorMessage message="Error fetching the course" />
    }
    if (loading) {
        return <Loader />
    }
    return (
        <AddCourse initialData={formData} onSubmit={handleSubmit} />
    );
};

export default editCourse;





