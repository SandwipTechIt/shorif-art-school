import { useEffect } from 'react';
import { setContext } from '../../context/authContext';
import { useNavigate } from 'react-router';


export default () => {
    const { setState } = setContext();
    const navigate = useNavigate();

    useEffect(() => {
        setState((prev)=>({...prev,admin:null,islogin:false,isFeatching:false,error:false}));
        navigate('/');
    }, [])
    return (
        <div>
            <h1>Sign Out</h1>
        </div>
    )
}
