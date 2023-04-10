import { gql, useQuery, useLazyQuery } from '@apollo/client';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Getposts.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeather, faCalendarDays, faListOl } from '@fortawesome/free-solid-svg-icons'

const QUERY_POSTS_LAZY = gql`
query Query($take: Int, $skip: Int!, $orderBy: [PostOrderByInput!]!) {
  posts(take: $take, skip: $skip, orderBy: $orderBy) {
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
}`;

const QUERY_POSTS_FOR_PAGES = gql`query Query {
  posts {
    title
  }
}`;

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
    },
    pollInterval: 1000,
  });

  const {loading: pageLoading, error: pageError, data: pageData} = useQuery(QUERY_POSTS_FOR_PAGES,
    {
      pollInterval: 60000,
    });

    const {commentsCount,content,document,type,children,text,id,title,author,name,race,races,image,url,createdAt} = pagerData?.posts || {};

    const {} = pageData?.posts || {};

    const range = (start, end) => Array.from({ length: (end - start) + 1}, (_, idx) => idx + 1);

    useEffect(() => {
      pager()
    }, []);

    return (
        <>
        {/* Automatic first load of Posts with normal useQuery */}
        {pagerData?.posts.map((v,i) => {return (
        <div key={i}>
        <div className={styles.posts}>
          <div className={styles.focim}>
            <div>
              <Image 
                src={v?.author?.race?.image.url}
                width={72}
                height={72}
                alt={`${v?.author?.race?.races} icon`}/>
            </div>
            <div className={styles.focimAdatok}>
              <div><Link href={`/post/${v?.id}`} key={i}><h2>{v?.title}</h2></Link></div>
              <div><FontAwesomeIcon icon={faFeather} size={"sm"} /> Szerző: {v?.author?.name}</div>
              <div>
                <FontAwesomeIcon icon={faCalendarDays} size="sm" /> Dátum: {v?.createdAt.slice(0,10)}
              </div>
              <div><FontAwesomeIcon icon={faListOl} size="sm" /> Hozzászólások száma: {v?.commentsCount}</div>
            </div>
          </div>
          <div className={styles.document}>
          <DocumentRenderer document={v?.content.document}/>
          </div>
        </div>
        </div>)})}

        {/* Komment szekcio */}
        
       
        {/* Oldalászámozás */}
        <div className={styles.pagination}>
          {pageData?.posts.length % 2 === 0 ? <>{range(1,((pageData?.posts.length)/2)).map((v,i,a) => (
            <><div key={i} className={styles.page} onClick={() => {setSkipper(i === 0 ? 0 : (v - 1) * 2),pager}}>{v}</div></>))}</> : <>{range(1,Math.ceil((pageData?.posts.length)/2)).map((v,i,a) => (
              <><div key={i} className={styles.page} onClick={() => {setSkipper(i === 0 ? 0 : (v - 1) * 2),pager}}>{v}</div></>))}</>}
        </div>
        </>
    )

}