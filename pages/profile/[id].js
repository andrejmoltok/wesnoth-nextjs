import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/Home.module.scss';
import SideProfile from "../../components/sideprofile";
import LoginReg from '../../components/loginreg';
import Profile from '../../components/profile';
import Cookies from 'universal-cookie';
import client from '../../apollo-client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client';

function ID() {

    const router = useRouter();

    const { id } = router.query;

    const [getID, setGetID] = useState(null);

    useEffect(() => {
      const cookies = new Cookies();
      const cookieValue = cookies.get("id");
      setGetID(cookieValue);
    }, []);

    const handleHome = () => {
        router.push('/');
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
                <div className={styles.navbarText}>Profil</div>
                <div className={styles.navbarText}>Fórum</div>
          </div>
        </div>
        
      <div className={styles.tarthatter}>
          <div className={styles.sideProfile}>
            {(!getID) ? <LoginReg /> : <SideProfile />}
          </div>
        <div className={styles.kozep}>
          <div className={styles.tartkozep}>
              <Profile getID={id} />
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

export default ID;