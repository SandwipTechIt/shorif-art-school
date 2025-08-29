import { useState } from 'react';
import { useNavigate } from "react-router";
import { postApi } from '../api';
import { setContext } from '../context/authContext';


export default () => {
  const navigate = useNavigate();
  const { state, setState } = setContext();
  const initialLoginData = {
    name: state?.admin?.name || "",
    password: state?.admin?.password || ""
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



  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await postApi(`updateAdmin/${state?.admin?._id}`, loginData);
      alert("Admin updated successfully");
      setState((prev)=>({...prev,admin:response}));
    } catch (error) {
      alert(error.message || "Admin updated failed");
    }
  };

  return (
    <div className="adduser">
      <div className="login">
        <form onSubmit={handleUpdate} className="login__form" autoComplete='off'>
          <h1 className="login__title">Update Profile</h1>
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
          <button
            type="submit"
            disabled={state.isFeatching}
            className="login__button"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};