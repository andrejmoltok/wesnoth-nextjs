import styles from '../styles/Register.module.css';
import Profile from '../components/profile';
import { useEffect, useState } from "react";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import Cookies from 'universal-cookie';
import { LOGIN } from '../gql/Login/LOGIN';
import { EMAIL_CHECK } from '../gql/Login/EMAIL_CHECK';
import { LOGGER } from '../gql/Login/LOGGER';

export default function Login() {

    // email input value
    var [emailInput, setEmailInput] = useState("");
    // password input value
    var [passwordInput, setPasswordInput] = useState("");

    // LOGIN Mutation
    const [login, {loading: authLoading, error: authError, data: authData}] = useMutation(LOGIN, {
      variables: { "email": emailInput, "password": passwordInput },
    });

    // EMAIL verification query
    const [ checkEmail, {loading: userLoading, error: userError, data: userData} ] = useLazyQuery(EMAIL_CHECK, {
      variables: {
          "where": {
            "email": emailInput
          }
      },
      pollInterval: 50,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
    });

    //userData
    const { id, userRole, name } = userData?.user || {};

    // activity mutation
    const [ activity, { loading: loggerLoading, error: loggerError, data: loggerData } ] = useMutation(LOGGER, {
      variables: {
        "data": {
          "who": userData?.user.name,
          "what": [
            {
              "type": "paragraph",
              "children": [
                {
                  "text": "Bejelentkezett"
                }
              ]
            }
          ]
        }
      }
    });

    //authData
    const {sessionToken} = authData?.authenticate || {}; 

    // set cookies
    function cookieSetter() {
      const cookies = new Cookies();
      if (authData?.authenticate) {
        cookies.set('id', id, {
          path: '/',
        });
        cookies.set('keystonejs-session', sessionToken, {
          path: '/',
        });
      } else if (cookies.get('id') && cookies.get('keystonejs-session')) {
        return
      };
    };

    useEffect(() => {
      if (userData?.user.name) {
        activity();
    }}, [activity,userData?.user.name]) 

    return (
        <>
        {(!userData) && (!authData) && <>
        <div className={styles.register}>
        <form className={styles.form}
            onSubmit={e => {
                e.preventDefault();
                checkEmail();
                login();
          }}>
        <div><label htmlFor="email" className={styles.dist}>Email:</label></div>
        <input type="email" name="email" onChange={(e) => {setEmailInput(e.target.value)}} className={styles.email}/>
        
        <div><label htmlFor="password" className={styles.dist}>Jelszó:</label></div>
        <input type="password" name="password" onChange={(p) => {setPasswordInput(p.target.value)}} className={styles.password}/> 
        
        <div className={styles.button}>
            <button>Belépés</button>
        </div>

        </form>
        </div>
        </>}
        {(userRole === 'Pending') && <div>A fiók nincs aktiválva</div>}
        {(userData?.user === null) && <div>Hibás emailcím</div>}
        {(authData?.authenticate) && cookieSetter()}
        {(authData?.authenticate) && <Profile /> }
        
        </>
    )
}