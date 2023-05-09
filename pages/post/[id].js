import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/Home.module.scss';
import styler from '../../styles/ID.module.css';
import CommentView from '../../components/commentview';
import CommentWrite from '../../components/commentWrite';
import Login from '../../components/login';
import SideProfile from '../../components/sideprofile';
import Cookies from 'universal-cookie';
import client from '../../apollo-client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, ApolloProvider } from '@apollo/client';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faFeather, faCalendarDays, faListOl, faCoins, faPoo } from '@fortawesome/free-solid-svg-icons'
import { QUERY_POST_BY_ID } from '../../gql/ID/QUERY_POST_BY_ID';


function GetPost({tarthatterUpdate,tartkozepUpdate,afterUpdate}) {

    const router = useRouter();

    const { id, from } = router.query;

    const { data, loading, error } = useQuery(QUERY_POST_BY_ID, {
      variables: { "where": { "id": id } },
      pollInterval: 1000, // 5 masodpercenkent frissit
      
    });

    const { title, content, document, author, name, race, races, image, url, createdAt, commentsCount, id: postID } = data?.post || {};

    const [isWrite, setIsWrite] = useState(false);

    const [getTheID, setGetTheID] = useState(false);

    function IDSetter() {
      const cookies = new Cookies();
      if (cookies.get('id')) {
        setGetTheID(!getTheID)
      } else {
        setGetTheID(getTheID)
        setIsWrite(false)
      }
    };

    useEffect(() => {
      const interval = setInterval(() => {
        IDSetter();
      }, 100)
        return () => clearInterval(interval)
    }, []);

    useEffect(() => {
      window.scrollTo({
        top: 240,
        behavior: 'smooth',
      });
    }, []);

    // DocuemntRendererProps
    const renderers = {
      block: {
        paragraph: ({ margin, children }) => {
          return <p style={{ margin: '0' }}>{children}</p>
        }
      }
    };

    if (loading) {
      return <div style={{ color: 'black', marginLeft: '35px' }}>Betöltés...</div>;
    }

    if (error) {
      return <div style={{ color: 'black', marginLeft: '35px' }}>Hiba: {error.message}</div>;
    }

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
              <div className={styler.focimData}><FontAwesomeIcon icon={faFeather} size={"sm"} /> Szerző: {author?.name}</div>
              <div className={styler.focimData}>
                <FontAwesomeIcon icon={faCalendarDays} size="sm" /> Dátum: {createdAt?.slice(0, 10)} {'(' + new Date(createdAt).toLocaleString('hu-HU', {weekday: 'short'}) + ')'} {new Date(createdAt).toTimeString().slice(0,8)}
              </div>
            </div>
            <div className={styler.voting}>
                <div>
                  <FontAwesomeIcon icon={faCoins} />  /  <FontAwesomeIcon icon={faPoo} />
              </div>
            </div> 
          </div>

          <div className={styler.document}>
            <DocumentRenderer document={content?.document} renderers={renderers}/>
          </div>

          <div className={styler.comment}>
            <div className={styler.postStat}>
              {/* GetTheID for LoggedIn/LoggedOut State */}
              {(!getTheID) ? <>
                <div className={styler.writeBtn} >
                  <div><FontAwesomeIcon icon={faPenToSquare} size="sm" /> Jelentkezz be</div>
                </div></> : <>
                <div className={styler.writeBtn} onClick={() => {setIsWrite(true)}}>
                  <div><FontAwesomeIcon icon={faPenToSquare} size="sm" /> Hozzászólok</div>
                </div>
              </>}

              <div><FontAwesomeIcon icon={faListOl} size="sm" /> Hozzászólások száma: {commentsCount}</div>

            </div> {/* postStat END */}

            {<CommentView postID={id} hatter={tarthatterUpdate} kozep={tartkozepUpdate} after={afterUpdate}/>}

            {(getTheID && from === 'comments') && <CommentWrite isWrite={true} id={id} />}

            {(getTheID) && <CommentWrite isWrite={true} id={id} />}

          </div> {/* comment END */}
        </div>
      </>
    );

  }


export default function ID() {

    const router = useRouter();
    
    const [getTheID, setGetTheID] = useState(undefined);
    const [theID, setTheID] = useState('');

    const [tarthatter, setTarthatter] = useState(0);
    const [tartkozep, setTartkozep] = useState(0);
    const [after, setAfter] = useState(0);

    const handleTarthatter = (newtarthatter) => {
      setTarthatter(newtarthatter);
    };

    const handleTartkozep = (newtartkozep) => {
      setTartkozep(newtartkozep);
    };

    const handleAfter = (newafter) => {
      setAfter(newafter);
    };

    function IDSetter() {
      const cookies = new Cookies();
      if (cookies.get('id')) {
        setGetTheID(true);
        setTheID(cookies.get('id'))
      } else {
        setGetTheID(false);
        setTheID('');
      }
    };

    useEffect(() => {
      const interval = setInterval(() => {
        IDSetter();
      }, 10)
        return () => clearInterval(interval)
    }, []);

    const handleHome = () => {
      router.push(`/`);
    };

    const handleProfile = (value) => {
      router.push(`/profile/${value}`);
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
                <div className={styles.navbarText} onClick={getTheID && getTheID !== false? () => handleProfile(theID) : undefined}>Profil</div>
                <div className={styles.navbarText}>Fórum</div>
          </div>
        </div>
        
      <div className="tarthatter"> {/*The style has to be dynamic reading from query length */}
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
              height: ${tarthatter}px;
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
              top: ${after}px; /* 405px*/
              z-index: -1000;
              background-image: url('/tart-szel.jpg');
              background-repeat: no-repeat;
              background-size: contain;
            }
            
            .tartkozep {
              margin: 0 0;
              width: 100%;
              height: ${tartkozep}px;
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
            {(!getTheID) ? <Login /> : <SideProfile />}
          </div>
        <div className={styles.kozep}>
          <div className="tartkozep"> {/*The style has to be dynamic reading from query length */}
              <GetPost tarthatterUpdate={handleTarthatter} tartkozepUpdate={handleTartkozep} afterUpdate={handleAfter}/>
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
