import styles from '../styles/Register.module.css';
import Profile from '../components/profile';
import { useEffect, useState } from "react";
import Image from 'next/image';
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import Cookies from 'universal-cookie';

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
      const cookies = new Cookies();
      if (authData?.authenticate) {
        cookies.set('id', id, {
          path: '/',
          maxAge: 3600,
        });
        cookies.set('keystonejs-session', sessionToken, {
          path: '/',
          maxAge: 3600,
        });
      } else if (cookies.get('id') && cookies.get('keystonejs-session')) {
        return
      };
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
        {(userRole === 'Pending') && <div>A fiók nincs aktiválva</div>}
        {(userData?.user === null) && <div>Hibás emailcím</div>}
        {(authData?.authenticate) && cookieSetter()}
        {(authData?.authenticate) && <Profile /> }
        </>
    )
}