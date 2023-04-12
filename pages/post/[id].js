import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/Home.module.scss';
import styler from '../../styles/ID.module.css';
import CommentView from '../../components/commentview';
import CommentWrite from '../../components/commentWrite';
import Login from '../../components/login';
import Profile from '../../components/profile';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery, ApolloProvider } from '@apollo/client';
import client from '../../apollo-client';
import { hasCookie, setCookie, getCookie, deleteCookie } from 'cookies-next';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, 
        faFeather, 
        faCalendarDays, 
        faBookOpenReader,
        faListOl } from '@fortawesome/free-solid-svg-icons'


const QUERY_POST_BY_ID = gql`
query Query($where: PostWhereUniqueInput!) {
    post(where: $where) {
    title
    content {
      document
    }
    author {
      name
      race {
        image {
          url
        }
        races
      }
    }
    createdAt
    id
    commentsCount
  }
}`

function GetPost() {

  const router = useRouter();
  const { id } = router.query;
  const {data, loading, error} = useQuery(QUERY_POST_BY_ID,{
    variables: { "where": { "id": id }},
    pollInterval: 500
  });

  const {title, content, document, author, name, race, races, image, url, createdAt, commentsCount} = data?.post || {};

  const [isWrite, setIsWrite] = useState(false);
  const [isView, setIsView] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 240,
      behavior: 'smooth',
    })
  },[])

  if (loading) {
    return <div style={{color: 'black', marginLeft: '35px'}}>Betöltés...</div>;
  }

  if (error) {
    return <div style={{color: 'black', marginLeft: '35px'}}>Hiba: {error.message}</div>;
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
                alt={`${author?.race?.races} icon`}/>
            </div>
            <div className={styler.focimAdatok}>
              <div><h2>{title}</h2></div>
              <div><FontAwesomeIcon icon={faFeather} size={"sm"} /> Szerző: {author?.name}</div>
              <div>
                <FontAwesomeIcon icon={faCalendarDays} size="sm" /> Dátum: {createdAt?.slice(0,10)} {createdAt?.slice(11,19)}
              </div>
            </div>
          </div>
          
          <div className={styler.document}>
            <DocumentRenderer document={content?.document}/>
          </div>

          <div className={styler.comment}>
            <div  className={styler.postStat}>
              <div className={styler.writeBtn} onClick={() => {setIsWrite(!isWrite)}}>
                <div><FontAwesomeIcon icon={faPenToSquare} size="sm"/> Hozzászólok</div>
              </div>
              <div className={styler.commentView} onClick={() => {setIsView(!isView)}}>
                <FontAwesomeIcon icon={faBookOpenReader} size="sm" /> Hozzászólások megtekintése</div>
              <div><FontAwesomeIcon icon={faListOl} size="sm" /> Hozzászólások száma: {commentsCount}</div>
            </div> {/* postStat END */}
            <div className={styler.commentText}>
              <CommentWrite isWrite={isWrite} id={id}/>
            </div> {/* commentText END */}
            {isView && <CommentView id={id} />}
          </div> {/* comment END */}
        </div>
        
        </>
    )

}

export default function ID() {

    const [cookieSetting, setCookieSetting] = useState(false);

    const router = useRouter();
    
    useEffect(() => {
      getCookie('id') !== undefined ? setCookieSetting(!cookieSetting) : null;
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
                <div className={styles.navbarText} onClick={() => {handleHome}}>Főoldal</div>
                <div className={styles.navbarText}>Profil</div>
                <div className={styles.navbarText}>Cikkek</div>
                <div className={styles.navbarText}>Fórum</div>
          </div>
        </div>
        
      <div className={styles.tarthatter}>
          <div className={styles.sideProfile}>
            {cookieSetting ? <Profile /> : <Login />}
          </div>
        <div className={styles.kozep}>
          <div className={styles.tartszelTarto}>
            <div className={styles.tartszelStart}><div className={styles.tartszel}></div></div>
            
            <div className={styles.tartszelEnd}><div className={styles.tartszel}></div></div>
          </div>
          <div className={styles.tartkozep}>
              <GetPost />
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
