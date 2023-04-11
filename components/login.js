import styles from '../styles/Register.module.css';
import Profile from '../components/profile';
import { useEffect, useState } from "react";
import Image from 'next/image';
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { setCookie, hasCookie, getCookie, deleteCookie } from 'cookies-next';

const LOGIN = gql`
mutation ($email: String!, $password: String!) {
  authenticate: authenticateUserWithPassword(email: $email, password: $password) {
    ... on UserAuthenticationWithPasswordSuccess {
      sessionToken
    }
    ... on UserAuthenticationWithPasswordFailure {
      message
    }
  }
}
`;

const EMAIL_CHECK = gql`
query Query($where: UserWhereUniqueInput!) {
  user(where: $where) {
    email
    userRole
    id
  }
}
`;

export default function Login() {

    // email input value
    var [emailInput, setEmailInput] = useState("");
    // password input value
    var [passwordInput, setPasswordInput] = useState("");

    const [login, {loading: authLoading, error: authError, data: authData}] = useMutation(LOGIN, {
      variables: { "email": emailInput, "password": passwordInput },
    });

    const [ checkEmail, {loading: userLoading, error: userError, data: userData} ] = useLazyQuery(EMAIL_CHECK, {
      variables: {
          "where": {
            "email": emailInput
          }
      },
      fetchPolicy: 'cache-and-network',
    });

    const {email, userRole, id} = userData?.user || {}; //userData

    const {sessionToken} = authData?.authenticate || {}; //authData

    function cookieSetter() {
      if (hasCookie('id') && hasCookie('keystonejs-session')) {
        return
      } else if (authData?.authenticate) {
        setCookie('id', id);
        setCookie('keystonejs-session', sessionToken);
      }
    };

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
            <button>Bejelentkezés</button>
        </div>

        </form>
        </div>
        </>}
        {(email === emailInput) && (userRole === 'Pending') && <div>Account not activated</div>}
        {(userData?.user === null) && <div>Hibás emailcím</div>}
        {(authData?.authenticate) && <Profile />}
        {(authData?.authenticate) && cookieSetter()}
        {/* {(userData) && (userData?.user) && (userRole !== 'Pending' ) && <>
            <div>Username: {name}</div>
            <div>Email: {email}</div>
            <div>Role: {adminRole !== null && adminRole}
                        {userRole !== 'Pending' && userRole}</div>
            <div>Race: {race?.races}</div>
            <div><Image 
                    src={race?.image.url}
                    alt={`${race?.races}-icon`}
                    width={72}
                    height={72}/>
            </div>
            
        </>} */}
        </>
    )
}