import { gql, useMutation, useLazyQuery } from "@apollo/client"
import styles from '../styles/Register.module.css';
import { useState } from "react";
import Image from 'next/image';

const LOGIN = gql`
mutation AuthenticateUserWithPassword($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          name
          email
          adminRole
          userRole
          race {
            races
            image {
              url
            }
          }
        }
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
    name
    adminRole
    userRole
    race {
      races
      image {
        url
      }
    }
  }
}
`;

export default function Login() {

    // email input value
    var [emailInput, setEmailInput] = useState("");
    // password input value
    var [passwordInput, setPasswordInput] = useState("");

    const [ checkEmail, {loading, error, data} ] = useLazyQuery(EMAIL_CHECK, {
      variables: {
          "where": {
            "email": emailInput
          }
      },
      onCompleted: (data) => {
        if (data?.user.email === emailInput) {
          login({ variables: { "email": emailInput, "password": passwordInput } });
        }
      },
    });

    const {name, email, adminRole, userRole, race, races, image, url} = data?.user || {};

    const [login] = useMutation(LOGIN, {
      refetchQueries: [{query: EMAIL_CHECK}]
    });

    

    return (
        <>
        {(!data) && <>
        <div className={styles.register}>
        <form className={styles.form}
            onSubmit={e => {
                e.preventDefault();
                checkEmail();
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
        {(data?.user === null) && <div>Hibás emailcím</div>}
        {(data) && (data?.user) && (userRole !== 'Pending' ) && <>
            <div>Username: {name}</div>
            <div>Email: {email}</div>
            <div>Role: {adminRole !== null && adminRole}
                        {userRole !== 'Pending' && userRole}</div>
            <div>Race: {race?.races}</div>
            <div><Image 
                    src={race?.image.url}
                    alt={`${race?.races}-icon`}
                    width={72}
                    height={72}/></div>
            </>}
        </>
    )
}