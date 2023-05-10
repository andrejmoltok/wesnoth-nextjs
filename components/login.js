import styles from '../styles/Register.module.css';
import client from '../apollo-client';
import Cookies from 'universal-cookie';
import { useState } from "react";
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
    // set emailData
    const [emaildata, setEmaildata] = useState(null);

    async function verify() {
      // Verify email
      const { data: emailData } = await client.query({
        query: EMAIL_CHECK,
        variables: {
          where: {
            email: email,
          },
        },
      });
      
      // const { id, userRole, name } = emailData?.user || {};

      if (!emailData) {

      } else {
        setEmaildata(emailData);
        setErrorEmailMsg(emailData?.userRole === 'Pending' ? 'A fiók nincs aktiválva' : '');
      }
    };

    const handleLogin = async (e) => {
      e.preventDefault();

    // Authenticate user with password
    const { data: authData } = await client.mutate({
      mutation: LOGIN,
      variables: {
        email: email,
        password: password,
      },
    });

    if (!authData?.authenticateUserWithPassword) {
      // Handle error here, such as displaying an error message
      return;
    }

    const { sessionToken } = authData?.authenticateUserWithPassword || {};
    
    // Log activity
    const { data: loggerData } = await client.mutate({
      mutation: LOGGER,
      variables: {
        data: {
          who: emaildata.user.name,
          what: [
            {
              type: 'paragraph',
              children: [{ text: 'Bejelentkezett' }],
            },
          ],
        },
      },
    });

    // Set cookies instance
    const cookies = new Cookies();
    cookies.set('id', emaildata.user.id, {
      path: '/',
    });
    cookies.set('keystonejs-session', sessionToken, {
      path: '/',
    });

    client.clearStore();
  }

    return (
        <>
        
        <div className={styles.register}>
          <form className={styles.form}
            onSubmit={handleLogin}>
          <div><label htmlFor="email" className={styles.dist}>Email:</label></div>
          <input type="email" name="email" onChange={(e) => {setEmail(e.target.value)}} onBlur={() => {verify()}} className={styles.email}/>
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