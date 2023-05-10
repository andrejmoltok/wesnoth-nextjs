import Register from "./register"
import Login from './login';
import { useState } from "react";

export default function LoginReg() {

    // show Register component
    const [showReg, setShowReg] = useState(false);

    // show Login component
    const [showLogin, setShowLogin] = useState(false);

    // change Register state
    const handleShowRegister = (newRegisterState) => {
        setShowReg(newRegisterState);
    };

    // change Login state
    const handleShowLogin = (newLoginState) => {
        setShowLogin(newLoginState);
    };

    return (
        <>
            {(!showLogin) && <Login handleShowRegister={handleShowRegister} handleShowLogin={handleShowLogin}/>}
            {(showReg) && <Register handleShowLogin={handleShowLogin} handleShowRegister={handleShowRegister}/>}
        </>
    );
}