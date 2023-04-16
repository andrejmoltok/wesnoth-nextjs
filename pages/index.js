import Head from 'next/head'
import Image from "next/image"
import Router from 'next/router';
import styles from '../styles/Home.module.scss'
import client from "../apollo-client"
import Cookies from 'universal-cookie';
import Login from '../components/login';
import Profile from '../components/profile'
import Getposts from '../components/getposts';
import { useState, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client'

export default function App() {

  const handleHome = () => {
    Router.push(`/`);
  }

  const [getID, setGetID] = useState(null);

  useEffect(() => {
    const cookies = new Cookies();
    const cookieValue = cookies.get("id");
    setGetID(cookieValue);
  }, []);

  return (
      <>
      <Head>
        <title>Magyar Wesnoth Közösségi Portál</title>
        <meta name="description" content="Magyar Wesnoth Közösségi Portál" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ApolloProvider client={client}>
      <main className={styles.main}>
        <div className={styles.fejlec}>
          <div className={styles.logo}>
               <Image
                  src='/logo-hu.png'
                  alt="Logo"
                  width={415}
                  height={189}
                  priority
                  className={styles.logoImg}
              />
          </div>
          <div className={styles.navbar}>
                <div className={styles.navbarText} onClick={() => {handleHome}}>Főoldal</div>
                <div className={styles.navbarText}>Profil</div>
                <div className={styles.navbarText}>Cikkek</div>
                <div className={styles.navbarText}>Fórum</div>
          </div>
        </div>
        
      <div className={styles.tarthatter}>
          <div className={styles.sideProfile}>
            {(!getID) ? <Login /> : <Profile />}
          </div>
        <div className={styles.kozep}>
          <div className={styles.tartszelTarto}>
            <div className={styles.tartszelStart}><div className={styles.tartszel}></div></div>
            
            <div className={styles.tartszelEnd}><div className={styles.tartszel}></div></div>
          </div>
          <div className={styles.tartkozep}>
              <Getposts />
            </div>
        </div>
      </div>
      
      <div className={styles.lablec}>
        <div></div>
      </div>
      </main>
      </ApolloProvider>
      </>
  )
}
