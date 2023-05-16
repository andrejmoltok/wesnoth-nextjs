import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Getposts.module.css';
import { useQuery, useLazyQuery } from '@apollo/client';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeather, faCalendarDays, faListOl } from '@fortawesome/free-solid-svg-icons'
import { QUERY_POSTS_LAZY } from '../gql/GetPosts/QUERY_POSTS_LAZY';
import { QUERY_POSTS_FOR_PAGES } from '../gql/GetPosts/QUERY_POSTS_FOR_PAGES';


export default function Getposts() {

  const [skipper, setSkipper] = useState(0);

  const [pager, {loading: pagerLoading, error: pagerError, data: pagerData}] = useLazyQuery(QUERY_POSTS_LAZY, {
    variables: {
      "take": 2,
      "skip": skipper,
      "orderBy": [
        {
          "createdAt": "desc"
        }
      ],
      "where": {
        "publishedState": {
          "equals": "Published",
        }
      }
    },
    pollInterval: 1000,
  });

  const {loading: pageLoading, error: pageError, data: pageData} = useQuery(QUERY_POSTS_FOR_PAGES,
    { variables: {
      "where": {
        "publishedState": {
          "equals": "Published",
        }
      }
    },
      pollInterval: 5000,
    });

    const {commentsCount,content,document,type,children,text,id,title,author,name,race,races,image,url,createdAt} = pagerData?.posts || {};

    const {} = pageData?.posts || {};

    const range = (start, end) => Array.from({ length: (end - start) + 1}, (_, idx) => idx + 1);

    // pager() function runs every time there's a click
    useEffect(() => {
      pager()
    }, [pager]);

    // DocuemntRendererProps
    const renderers = {
      block: {
        paragraph: ({ margin, children }) => {
          return <p style={{ margin: '0' }}>{children}</p>
        }
      }
    };

    return (
        <>
        {/* Automatic first load of Posts with normal useQuery */}
        {(pagerLoading) ? (<div style={{marginLeft: '35px', color: 'black'}}>Betöltés...</div>) : <>{pagerData?.posts.map((v,i) => {return (
        <div key={i}>
        <div key={i} className={styles.posts}>
          <div className={styles.focim}>
            <div>
              <Image 
                src={v?.author?.race?.image.url}
                width={72}
                height={72}
                alt={`${v?.author?.race?.races} icon`}/>
            </div>
            <div className={styles.focimAdatok}>
              <div>
                <Link href={`/post/${v?.id}`} scroll={false} className={styles.postLink}><h2>{v?.title}</h2></Link>
              </div>
              <div className={styles.focimData}>
                <FontAwesomeIcon icon={faFeather} size={"sm"} /> Szerző: {v?.author?.name}
              </div>
              <div className={styles.focimData}>
                <FontAwesomeIcon icon={faCalendarDays} size="sm" /> Dátum: {v?.createdAt.slice(0,10)} {'(' + new Date(v?.createdAt).toLocaleString('hu-HU', {weekday: 'short'}) + ')'} {new Date(v?.createdAt).toTimeString().slice(0,8)}
              </div>
            </div>
          </div>

          <div key={i} className={styles.document}>
            <DocumentRenderer document={v?.content.document} renderers={renderers}/>
          </div>
          
          <div>
            <Link href={`/post/${v?.id}/?from=comments`} className={styles.commentCount} ><FontAwesomeIcon icon={faListOl} size="sm" /> {v?.commentsCount} hozzászólás</Link>
          </div>
        </div>
        </div>)})}
       
        {/* Oldalászámozás */}
        <div className={styles.pagination}>
          {pageData?.posts.length % 2 === 0 ? <>{range(1,((pageData?.posts.length)/2)).map((v,i,a) => (
            <><div key={i} className={styles.page} onClick={() => {setSkipper(i === 0 ? 0 : (v - 1) * 2),pager}}>{v}</div></>))}</> : <>{range(1,Math.ceil((pageData?.posts.length)/2)).map((v,i,a) => (
              <><div key={i} className={styles.page} onClick={() => {setSkipper(i === 0 ? 0 : (v - 1) * 2),pager}}>{v}</div></>))}</>}
        </div>
        </>}
        </>
    )

}