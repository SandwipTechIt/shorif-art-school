import { useState } from 'react';
import { postApi } from '../../api';
import { setContext } from '../../context/authContext';
import './SignIn.css';

export default () => {

    const initialLoginData = {
        name: "",
        password: ""
    };

    const [showPassword, setShowPassword] = useState(false);
    const [passwordIcon, setPasswordIcon] = useState('fa-solid fa-eye-slash');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setPasswordIcon(
            passwordIcon === 'fa-solid fa-eye'
                ? 'fa-solid fa-eye-slash'
                : 'fa-solid fa-eye'
        );
    };

    const [loginData, setLoginData] = useState(initialLoginData);

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const { state, setState } = setContext();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setState((prev)=>({...prev,isFeatching:true}));
        try {
            const response = await postApi("loginAdmin", loginData);
            setState((prev)=>({...prev,admin:response,islogin:true}));
        } catch (error) {
            setState((prev)=>({...prev,error:true}));
        } finally {
            setState((prev)=>({...prev,isFeatching:false}));
        }
    };

    return (
        <div className="adduser">
            <div className="login">
                <form onSubmit={handleLogin} autoComplete="off" className="login__form">
                    <h1 className="login__title">Login</h1>
                    <div className="login__content">
                        <div className="login__box">
                            <i className="fa-solid fa-user login__icon"></i>
                            <div className="login__box-input">
                                <input
                                    type="text"
                                    name="name"
                                    value={loginData.name}
                                    onChange={handleChange}
                                    required
                                    className="login__input"
                                    placeholder=" "
                                />
                                <label htmlFor="" className="login__label">Name</label>
                            </div>
                        </div>
                        <div className="login__box">
                            <i className="fa-solid fa-lock login__icon"></i>
                            <div className="login__box-input">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    required
                                    className="login__input passPad"
                                    id="login-pass"
                                    placeholder=" "
                                />
                                <label htmlFor="" className="login__label">Password</label>
                                <i
                                    onClick={togglePasswordVisibility}
                                    className={`${passwordIcon} login__eye`}
                                    id="login-eye"
                                ></i>
                            </div>
                        </div>
                    </div>
                    {state.error && <p className='error'>Your name and password do not match</p>}
                    <button
                        type="submit"
                        disabled={state.isFeatching}
                        className="login__button"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};