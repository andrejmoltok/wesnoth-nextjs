import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/Home.module.scss';
import styler from '../../styles/ID.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery, ApolloProvider } from '@apollo/client';
import client from '../../apollo-client';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faFeather, faCalendarDays } from '@fortawesome/free-solid-svg-icons'


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
  }
}`

function GetPost() {

  const router = useRouter();
  const { id } = router.query;
  const {data, loading, error} = useQuery(QUERY_POST_BY_ID,{
    variables: { "where": { "id": id}},
    pollInterval: 500,
  });

  const {title, content, document, author, name, race, races, image, url, createdAt} = data?.post || {};

  const [isWrite, setIsWrite] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
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
              <div style={{fontSize: '14px'}}>
                <FontAwesomeIcon icon={faCalendarDays} size="sm" /> Dátum: {createdAt?.slice(0,10)}
              </div>
            </div>
          </div>
          
          <div className={styler.document}>
            <DocumentRenderer document={content?.document}/>
          </div>

          <div className={styler.comment}>
            <div className={styler.writeBtn} onClick={() => {setIsWrite(!isWrite)}}>
              <div><FontAwesomeIcon icon={faPenToSquare} size="sm"/> Komment írása</div>
            </div>
            <div>
            <textarea 
              autofocus
              rows="3" cols="80"
              className={isWrite ? styler.commentTextExpand : styler.commentText}
            >
            </textarea>
            <div className={styler.submit}>
              <div className={isWrite ? styler.submitBtnVisible : styler.submitBtnHidden}>Küldés</div>
            </div>
            </div>
            
          </div>
        </div>
        
        </>
    )

}

export default function ID() {
    

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
            {/* <div className={styles.loginreg}>
              <LoginReg />
            </div> */}
          <div className={styles.kozep}>
          <div className={styles.tartkozep}>
          <ApolloProvider client={client}>
              <GetPost/>
        </ApolloProvider>
          </div>
            <div className={styles.tartszelStart}><div className={styles.tartszel}></div></div>
            <div className={styles.tartszelEnd}><div className={styles.tartszel}></div></div>
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
