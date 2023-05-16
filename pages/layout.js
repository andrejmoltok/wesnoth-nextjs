import Head from 'next/head'
import Image from "next/image"
import Router from 'next/router';
import styles from '../styles/Home.module.scss'
import client from "../apollo-client"
import Cookies from 'universal-cookie';
import LoginReg from '@/components/loginreg';
import SideProfile from '@/components/sideprofile';
import { HatterContext } from '@/pages/HatterContext';
import { KozepContext } from '@/pages/KozepContext';
import { AfterContext } from '@/pages/AfterContext';
import { useState, useEffect, useContext } from 'react';
import { ApolloProvider } from '@apollo/client'


function Layout({ children }) {
    
    const [getID, setGetID] = useState(undefined);

    const { tarthatter, setTarthatter } = useContext(HatterContext);
    const { tartkozep, setTartkozep } = useContext(KozepContext);
    const { after, setAfter } = useContext(AfterContext);

    const tarthatterValue = tarthatter || 600;
    const tartkozepValue = tartkozep || 420;
    const afterValue = after || 405;

    useEffect(() => {
      const cookies = new Cookies();
      const interval = setInterval(() => {
        setGetID(cookies.get('id'));
      }, 1000);
      return () => clearInterval(interval);
    }, []);
  
    const handleHome = () => {
      Router.push(`/`);
    }
  
    const handleProfile = (value) => {
      Router.push(`/profile/${value}`);
    };
  
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
                  <div className={styles.navbarText} onClick={() => {handleHome()}}>Főoldal</div>
                  <div className={styles.navbarText} onClick={getID && getID !== "" ? () => handleProfile(getID) : undefined}>Profil</div>
                  <div className={styles.navbarText}>Fórum</div>
            </div>
          </div>
          
        <div className="tarthatter">
        <style jsx>{`
            .tarthatter {
              margin: 0px 56.5px;
              background-image: url('/tart-hatter.jpg');
              background-repeat: repeat-y;
              background-size: contain;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              color: #bdb58c;
              height: ${tarthatterValue}px;
            }

            .tartkozep::before {
              content: " ";
              display: block;
              width: 100%;
              height: 155px;
              position: absolute;
              top: -20px;
              z-index: -1000;
              background-image: url('/tart-szel.jpg');
              background-repeat: no-repeat;
              background-size: contain;
            }
            
            .tartkozep::after {
              content: " ";
              display: block;
              width: 100%;
              height: 155px;
              position: absolute;
              top: ${afterValue}px;
              z-index: -1000;
              background-image: url('/tart-szel.jpg');
              background-repeat: no-repeat;
              background-size: contain;
            }
            
            .tartkozep {
              margin: 0 0;
              width: 100%;
              height: ${tartkozepValue}px;
              display: flex;
              flex-direction: column;
              position: relative;
              top: 20px;
              left: 0px;
              background-image: url('/tart-kozep.jpg');
              background-size: contain;
              background-repeat: repeat-y;
            }
          `}</style>
            <div className={styles.sideProfile}>
              {(!getID) ? <LoginReg /> : <SideProfile />}
            </div>
          <div className={styles.kozep}>
            <div className="tartkozep">
                {children}
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

export default Layout;