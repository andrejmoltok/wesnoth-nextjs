import { gql, useQuery } from '@apollo/client';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import Image from 'next/image';
import styles from '../styles/Getposts.module.css'


const QUERY_POSTS = gql`
query Query {
  posts {
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
      }
    }
  }
}`;

export default function Getposts() {


    const {loading, error, data: postData} = useQuery(QUERY_POSTS, {
      pollInterval: 30000
    });

    const {content, document,type,children,text,title,author,name,race,image,url} = postData?.posts || {};

    

    return (
        <>
        {postData?.posts.map((v,i) => {return (
        <div className={styles.posts} key={i}>
          <div className={styles.focim}>
            <div><Image 
            src={postData?.posts[i]?.author?.race?.image.url}
            width={72}
            height={72}
            alt={'race-image'}/>
            </div>
            <div className={styles.focimAdatok}>
              <div><h2>{v.title}</h2></div>
              <div>Szerző: {postData?.posts[i]?.author?.name}</div>
            </div>
          </div>
          <div className={styles.document}>
          <DocumentRenderer document={postData?.posts[i]?.content.document}/>
          </div>
        </div>)})
        }
        </>
    )

}