import styles from '../styles/Register.module.css';
import { useState } from "react";
import Image from 'next/image';
import { getCookies, setCookie, deleteCookie } from 'cookies-next';
import { gql, useMutation, useLazyQuery } from "@apollo/client"

const LOGIN = gql`
mutation ($email: String!, $password: String!) {
  authenticate: authenticateUserWithPassword(email: $email, password: $password) {
    ... on UserAuthenticationWithPasswordSuccess {
      sessionToken
      __typename
      item {
        name
        email
        id
        race {
          races
          image {
            url
          }
          __typename
        }
        adminRole
        userRole
      }
    }
    ... on UserAuthenticationWithPasswordFailure {
      message
      __typename
    }
    __typename
  }
}
`;

const EMAIL_CHECK = gql`
query Query($where: UserWhereUniqueInput!) {
  user(where: $where) {
    email
    name
    adminRole
    userRole
    race {
      races
      image {
        url
      }
    }
    isAdmin
    isEditor
    isUser
    id
  }
}
`;

export default function Login() {

    // email input value
    var [emailInput, setEmailInput] = useState("");
    // password input value
    var [passwordInput, setPasswordInput] = useState("");

    const [login, {loading: authLoading, error: authError, data}] = useMutation(LOGIN, {
      variables: { "email": `${emailInput}`, "password": `${passwordInput}` },
    });

    const [ checkEmail, {loading: userLoading, error: userError, data: userData} ] = useLazyQuery(EMAIL_CHECK, {
      variables: {
          "where": {
            "email": `${emailInput}`
          }
      },
      onCompleted: (userData) => {
        if (userData.email === `${emailInput}`) {
          login({variables: { "email": `${emailInput}`, "password": `${passwordInput}` }});
          
        }
      },
    });

    const {name, email, adminRole, userRole, race, races, image, url, isAdmin, isEditor, isUser, id} = userData?.user || {}; //userData

    const {sessionToken, item, message } = data?.authenticate || {}; //authData

    setCookie('id', id);
    setCookie('session', sessionToken);

    if (authError) {return <>Authentication Error</>}

    return (
        <>
        
        {(!userData) && (!data) && <>
        <div className={styles.register}>
        <form className={styles.form}
            onSubmit={e => {
                e.preventDefault();
                checkEmail();
          }}>
        <div><label htmlFor="email" className={styles.dist}>Email:</label></div>
        <input type="email" name="email" onChange={(e) => {setEmailInput(e.target.value),console.log(e.target.value)}} className={styles.email}/>
        {}
        <div><label htmlFor="password" className={styles.dist}>Jelszó:</label></div>
        <input type="password" name="password" onChange={(p) => {setPasswordInput(p.target.value),console.log(p.target.value)}} className={styles.password}/> 
        {}
        <div className={styles.button}>
            <button>Bejelentkezés</button>
        </div>

        </form>
        </div>
        </>}
        {console.log(data?.authenticate.sessionToken)}
        {(email === emailInput) && (userRole === 'Pending') && <div>Account not activated</div>}
        {(userData?.user === null) && <div>Hibás emailcím</div>}
        {(userData) && (userData?.user) && (userRole !== 'Pending' ) && <>
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
            
        </>}
        </>
    )
}