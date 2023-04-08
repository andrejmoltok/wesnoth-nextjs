import { gql, useQuery, useLazyQuery } from '@apollo/client';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/Getposts.module.css'


const QUERY_POSTS = gql`
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
  }
}`;

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
      pollInterval: 1000,
    });

    const {loading: postLoading, error: postError, data: postData} = useQuery(QUERY_POSTS, {
      variables: {
        "take": 2,
        "skip": 0,
        "orderBy": [
          {
            "createdAt": "desc"
          }
        ],
      },
      pollInterval: 1000
    });

    const {content, document,type,children,text,title,author,name,race,races,image,url,createdAt} = postData?.posts || pagerData?.posts || {};

    // const {content, document,type,children,text,title,author,name,race,image,url,createdAt} = pagerData?.posts || {};

    const {} = pageData?.posts || {};

    const range = (start, end) => Array.from({ length: (end - start) + 1}, (_, idx) => idx + 1);

    return (
        <>
        {/* Automatic first load of Posts with normal useQuery */}
        {postData?.posts.map((v,i) => {return (
        <div className={styles.posts} key={i}>
          <div className={styles.focim}>
            <div>
              <Image 
                src={v?.author?.race?.image.url}
                width={72}
                height={72}
                alt={`${v?.author?.race?.races} icon`}/>
            </div>
            <div className={styles.focimAdatok}>
              <div><h2>{v?.title}</h2></div>
              <div>Szerző: {v?.author?.name}</div>
              <div style={{fontSize: '14px'}}>Dátum: {v?.createdAt.slice(0,10)}</div>
            </div>
          </div>
          <div className={styles.document}>
          <DocumentRenderer document={v?.content.document}/>
          </div>
        </div>)})}
        {/* Oldalászámozás */}
        <div className={styles.pagination}>
          {pageData?.posts.length % 2 === 0 ? <>{range(1,((pageData?.posts.length)/2)).map((v,i,a) => (
            <><div className={styles.page}>{v}</div></>))}</> : <>{range(1,Math.ceil((pageData?.posts.length)/2)).map((v,i,a) => (
              <><div className={styles.page}>{v}</div></>))}</>}
        </div>
        </>
    )

}