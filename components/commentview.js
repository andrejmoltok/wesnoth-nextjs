import styler from '../styles/CommentView.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeather, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import { gql, useQuery } from '@apollo/client';
import { DocumentRenderer } from '@keystone-6/document-renderer';

const QUERY_POST_COMMENTS = gql`
query PostCommentsQuery($where: PostWhereUniqueInput!) {
    post(where: $where) {
      comments {
        id
        author {
          name
          race {
            image {
              url
            }
          }
        }
        createdAt
        content {
          document
        }
      }
    }
  }`;

export default function CommentView({id}) {

    const { loading, error, data } = useQuery(QUERY_POST_COMMENTS, {
        variables: {
            "where": {
                "id": id,
            }
        },
        pollInterval: 1000,
    });

    const {author, name, race, races, image, url, createdAt, content, document} = data?.post?.comments || {};
    
    return (
        <>
        <div className={styler.commentView}>
            {data?.post?.comments.map((v,i) => {return <>
            <div key={i} className={styler.commentViewUnique}>
            <div className={styler.focim}>
                <div>
                  <Image 
                    src={v?.author?.race?.image.url}
                    width={72}
                    height={72}
                    alt={`${v?.author?.race?.races} icon`}/>
                </div>
                <div className={styler.focimAdatok}>
                  <div><FontAwesomeIcon icon={faFeather} size={"sm"} /> Szerző: {v?.author?.name}</div>
                  <div>
                    <FontAwesomeIcon icon={faCalendarDays} size="sm" /> Dátum: {v?.createdAt?.slice(0,10)}
                  </div>
                </div>
                {/* Delete icon <FontAwesomeIcon icon={faTrashCan} size="sm" /> */}
            </div>
            <div className={styler.document}>
              <DocumentRenderer document={v?.content?.document}/>
            </div>
            </div></>})}
        </div>
        </>
    )
}