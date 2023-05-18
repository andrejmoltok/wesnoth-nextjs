import styles from '../styles/Register.module.css';
import Cookies from 'universal-cookie';
import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from '@apollo/client';
import { EMAIL_CHECK } from '../gql/Login/EMAIL_CHECK';
import { LOGIN } from '../gql/Login/LOGIN';
import { LOGGER } from '../gql/Login/LOGGER';

export default function Login({handleShowRegister, handleShowLogin}) {

    // email input value
    const [email, setEmail] = useState("");
    // password input value
    const [password, setPassword] = useState("");
    // email validator
    const [errorEmailMsg, setErrorEmailMsg] = useState('');

    // EMAIL_CHECK query
    const [emailCheck, { data: emailData, loading: emailLoading, error: emailError }] = useLazyQuery(EMAIL_CHECK);

    const { id, userRole, name } = emailData?.user || {};

    // Authenticate user with password
    const [login, { data: authData, loading: authLoading, error: authError }] = useMutation(LOGIN);
     
    const { sessionToken, message } = authData?.authenticateUserWithPassword || {};
         
    // Log the Login activity
    const [logger, { data: loggerData, loading: loggerLoading, error: loggerError }] = useMutation(LOGGER);


    useEffect(() => {
      console.log("");
    }, [email]);
    // verify EMAIL from form
    // then handleLogin
    function verify(e) {
      e.preventDefault();
      // Verify email
      emailCheck({variables: { where: { email: email }}});
      
      if (emailData?.user?.userRole === "Pending") {
        setErrorEmailMsg('A fiók nincs aktiválva');
        return;
      } else {
        setErrorEmailMsg('');
        login({variables: { email: email, password: password }});
        if (emailData) {
          logger({variables: { data: { who: emailData?.user?.name, what: [{ type: 'paragraph', children: [{ text: 'Bejelentkezett' }]}]}}});
        
        // if (authData?.authenticateUserWithPassword.message) {
        //   // Handle error here, such as displaying an error message
        //   return `Error: ${message}`;
        // };

        const cookies = new Cookies();
        cookies.set('id', emailData?.user?.id, {
          path: '/',
        });
        cookies.set('keystonejs-session', sessionToken, {
          path: '/',
        });
        }

        setEmail('');
        setPassword('');
      }
    };

    return (
        <>
        <div className={styles.register}>
          <form className={styles.form}
            onSubmit={verify}>
          <div><label htmlFor="email" className={styles.dist}>Email:</label></div>
          <input type="email" name="email" onChange={(e) => {setEmail(e.target.value)}} className={styles.email}/>
          {errorEmailMsg === '' ? null :
                <span style={{
                        fontWeight: 'thin', 
                        color: 'red',
                }}>{errorEmailMsg}</span>}
          <div><label htmlFor="password" className={styles.dist}>Jelszó:</label></div>
          <input type="password" name="password" onChange={(p) => {setPassword(p.target.value)}} className={styles.password}/> 
        
          <div className={styles.button}>
            <button type='submit'>Belépés</button>
          </div>
          </form>
        </div>

        <div className={styles.showRegister}>
          <ul className={styles.showRegisterUL}>
            <li>
              <p className={styles.showRegisterP} onClick={() => {handleShowRegister(true),handleShowLogin(true)}}>Felhasználó létrehozása</p>
            </li>
          </ul>
        </div>

        </>
    )
}