import Register from "./register"
import Login from './login';
import { useState } from "react";

export default function LoginReg() {

    const [isLoginActive, setIsLoginActive] = useState(false);
    const [isRegisterActive, setIsRegisterActive] = useState(false);

    const handleToggle = (type) => {
        if (type === "login") {
            setIsLoginActive(true);
            setIsRegisterActive(false);
        } else {
            setIsLoginActive(false);
            setIsRegisterActive(true);
        }
    };

    return (
        <>
            <div>
                <button onClick={() => handleToggle("login")} disabled={isLoginActive}>Bejelentkezés</button>
            </div>
            <div>
                <button onClick={() => handleToggle("register")} disabled={isRegisterActive}>Regisztráció</button>
            </div>
            {isLoginActive && <Login />}
            {isRegisterActive && <Register />}
        </>
    );
}