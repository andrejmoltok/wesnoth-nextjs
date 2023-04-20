import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/Home.module.scss';
import styler from '../../styles/ID.module.css';
import CommentView from '../../components/commentview';
import CommentWrite from '../../components/commentWrite';
import Login from '../../components/login';
import Profile from '../../components/profile';
import Cookies from 'universal-cookie';
import client from '../../apollo-client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, ApolloProvider } from '@apollo/client';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faFeather, faCalendarDays, faListOl } from '@fortawesome/free-solid-svg-icons'
import { QUERY_POST_BY_ID } from '../../gql/ID/QUERY_POST_BY_ID';

function GetPost({getTheID}) {

    const router = useRouter();
    const { id } = router.query;
    const { data, loading, error } = useQuery(QUERY_POST_BY_ID, {
      variables: { "where": { "id": id } },
      pollInterval: 1000, // 5 masodpercenkent frissit
      
    });

    const { title, content, document, author, name, race, races, image, url, createdAt, commentsCount } = data?.post || {};

    const [isWrite, setIsWrite] = useState(false);

    useEffect(() => {
      window.scrollTo({
        top: 240,
        behavior: 'smooth',
      });
    }, []);

    if (loading) {
      return <div style={{ color: 'black', marginLeft: '35px' }}>Betöltés...</div>;
    }

    if (error) {
      return <div style={{ color: 'black', marginLeft: '35px' }}>Hiba: {error.message}</div>;
    }

    const timezone = new Date(createdAt).toTimeString().slice(0,8)

    return (
      <>
        <div className={styler.posts}>
          <div className={styler.focim}>
            <div>
              <Image
                src={author?.race?.image.url}
                width={72}
                height={72}
                alt={`${author?.race?.races} icon`} />
            </div>
            <div className={styler.focimAdatok}>
              <div><h2>{title}</h2></div>
              <div><FontAwesomeIcon icon={faFeather} size={"sm"} /> Szerző: {author?.name}</div>
              <div>
                <FontAwesomeIcon icon={faCalendarDays} size="sm" /> Dátum: {createdAt?.slice(0, 10)} {timezone}
              </div>
            </div>
            <div className={styler.voting}>
              <div>Voting</div>
            </div>
          </div>

          <div className={styler.document}>
            <DocumentRenderer document={content?.document} />
          </div>

          <div className={styler.comment}>
            <div className={styler.postStat}>
              {/* GetTheID for LoggedIn/LoggedOut State */}
              {(!getTheID) ? <>
                <div className={styler.writeBtn} >
                  <div><FontAwesomeIcon icon={faPenToSquare} size="sm" /> Jelentkezz be</div>
                </div></> : <>
                <div className={styler.writeBtn} onClick={() => {setIsWrite(!isWrite)}}>
                  <div><FontAwesomeIcon icon={faPenToSquare} size="sm" /> Hozzászólok</div>
                </div>
              </>}

              <div><FontAwesomeIcon icon={faListOl} size="sm" /> Hozzászólások száma: {commentsCount}</div>

            </div> {/* postStat END */}

            {<CommentView postID={id} />}

            {(getTheID) && <CommentWrite isWrite={isWrite} id={id} />}

          </div> {/* comment END */}
        </div>
      </>
    );

  }


export default function ID() {

    const router = useRouter();
    
    const [getTheID, setGetTheID] = useState(false);

    function IDSetter() {
      const cookies = new Cookies();
      if (cookies.get('id')) {
        setGetTheID(!getTheID)
      } else {
        setGetTheID(getTheID)
      }
    };

    useEffect(() => {
      const interval = setInterval(() => {
        IDSetter();
      }, 1000)
        return () => clearInterval(interval)
    }, []);

    const handleHome = () => {
      router.push(`/`);
    }

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
                <div className={styles.navbarText}>Cikkek</div>
                <div className={styles.navbarText}>Fórum</div>
          </div>
        </div>
        
      <div className={styles.tarthatter}>
          <div className={styles.sideProfile}>
            {(!getTheID) ? <Login /> : <Profile />}
          </div>
        <div className={styles.kozep}>
          <div className={styles.tartszelTarto}>
            <div className={styles.tartszelStart}><div className={styles.tartszel}></div></div>
            
            <div className={styles.tartszelEnd}><div className={styles.tartszel}></div></div>
          </div>
          <div className={styles.tartkozep}>
              <GetPost getTheID={getTheID}/>
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
