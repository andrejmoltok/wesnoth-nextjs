import Head from 'next/head'
import Image from "next/image"
import styles from '../styles/Home.module.scss'
import client from "../apollo-client"
import { ApolloProvider } from '@apollo/client'
import LoginReg from '../components/loginreg';
import Getposts from '../components/getposts';

export default function App() {
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
        </div>
        
      <div className={styles.tarthatter}>
        
          <div className={styles.loginreg}>
            <LoginReg />
          </div>
        
        <div className={styles.kozep}>
          <div className={styles.tartszel}>
            <div className={styles.tartkozep}>
              <Getposts />
            </div>
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
