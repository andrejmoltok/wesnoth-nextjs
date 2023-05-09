import styles from '../styles/Register.module.css';
import SideProfile from './sideprofile';
import client from '../apollo-client';
import Cookies from 'universal-cookie';
import { useState } from "react";
import { EMAIL_CHECK } from '../gql/Login/EMAIL_CHECK';
import { LOGIN } from '../gql/Login/LOGIN';
import { LOGGER } from '../gql/Login/LOGGER';

export default function Login() {

    // email input value
    const [email, setEmail] = useState("");
    // password input value
    const [password, setPassword] = useState("");
    // emailData
    const [data, setData] = useState(null);

    const handleLogin = async (e) => {
      e.preventDefault();

      // Verify email
    const { data: emailData } = await client.query({
      query: EMAIL_CHECK,
      variables: {
        where: {
          email: email,
        },
      },
    });

    // Authenticate user with password
    const { data: authData } = await client.mutate({
      mutation: LOGIN,
      variables: {
        email: email,
        password: password,
      },
    });

    const { sessionToken } = authData?.authenticateUserWithPassword || {};
    const { id, userRole, name } = emailData?.user || {};

    // Log activity
    const { data: loggerData } = await client.mutate({
      mutation: LOGGER,
      variables: {
        data: {
          who: name,
          what: [
            {
              type: 'paragraph',
              children: [{ text: 'Bejelentkezett' }],
            },
          ],
        },
      },
    });

    // Set cookies
    const cookies = new Cookies();
    cookies.set('id', id, {
      path: '/',
    });
    cookies.set('keystonejs-session', sessionToken, {
      path: '/',
    });

    // check if there is data set, if not do nothing, 
    // otherwise set the data with the incoming `emailData`
    if (!data) {
      // do nothing here
    } else {
      setData(emailData);
    }
  }

    return (
        <>
        {(data && data?.userRole !== 'Pending') && <SideProfile />}
        {<>
        <div className={styles.register}>
        <form className={styles.form}
          onSubmit={handleLogin}>
        <div><label htmlFor="email" className={styles.dist}>Email:</label></div>
        <input type="email" name="email" onChange={(e) => {setEmail(e.target.value)}} className={styles.email}/>
        
        <div><label htmlFor="password" className={styles.dist}>Jelszó:</label></div>
        <input type="password" name="password" onChange={(p) => {setPassword(p.target.value)}} className={styles.password}/> 
        
        <div className={styles.button}>
            <button type='submit'>Belépés</button>
        </div>

        </form>
        </div>
        </>}
        </>
    )
}