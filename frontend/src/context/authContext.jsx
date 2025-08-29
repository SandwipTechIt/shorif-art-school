import { createContext, useContext, useEffect, useState, } from "react";

const Context = createContext();

const ContextProvider = ({ children }) => {
    const I_S = {
        admin: JSON.parse(localStorage.getItem("admin")) || null,
        isFeatching: false,
        error: false,
        islogin: JSON.parse(localStorage.getItem("admin")) ? true : false
    }

    const [state, setState] = useState(I_S);
    useEffect(() => {
        localStorage.setItem("admin", JSON.stringify(state.admin));
    }, [state.admin])
    return (
        <div>
            <Context.Provider value={{ state, setState }}>
                {children}
            </Context.Provider>
        </div>
    )
}
export const setContext = () => useContext(Context)
export default ContextProvider


