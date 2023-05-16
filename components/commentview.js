import styler from '../styles/CommentView.module.css';
import Image from 'next/image';
import Cookies from 'universal-cookie';
import { HatterContext } from '../pages/HatterContext';
import { KozepContext } from '../pages/KozepContext';
import { AfterContext } from '../pages/AfterContext';
import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeather, faCalendarDays, faTrashCan, faListOl } from '@fortawesome/free-solid-svg-icons'
import { useQuery, useMutation } from '@apollo/client';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { QUERY_POST_COMMENTS } from '../gql/CommentView/QUERY_POST_COMMENTS';
import { DELETE_COMMENT } from '../gql/CommentView/COMMENT_DELETE';
import { COMMENT_DISCONNECT } from '../gql/CommentView/COMMENT_DISCONNECT';
// import { COMMENT_REPLACE } from '../gql/CommentView/COMMENT_REPLACE';

export default function CommentView({postID}) {

    const { tarthatter, setTarthatter } = useContext(HatterContext);
    const { tartkozep, setTartkozep } = useContext(KozepContext);
    const { after, setAfter } = useContext(AfterContext);

    const { loading, error, data } = useQuery(QUERY_POST_COMMENTS, {
        variables: {
            "where": {
                "id": postID,
            }
        },
        pollInterval: 100,
    });

    const {author, name, race, races, image, url, createdAt, content, document, id: commentID, id: userID, commentsCount} = data?.post?.comments || {};

    // update data
    let dataLen = data?.post?.comments.length-1;
    const commentBox = 208;
    const tartkozepdiv = 565;
    const stat = 24;
    const beforeBox = 20;
    const afterBox = 180;
    const commentwrite = 135;

      // .tarthatter update
      setTarthatter(((dataLen*commentBox) + tartkozepdiv + stat + commentwrite + beforeBox + afterBox));

      // .tartkozep update
      setTartkozep(((dataLen*commentBox) + tartkozepdiv + stat + beforeBox + commentwrite));

      // ::after update
      setAfter(((dataLen*commentBox) + tartkozepdiv + beforeBox  + commentwrite));

    // const [replace, { loading: replaceLoading, error: replaceError, data: replaceData }] = useMutation(COMMENT_REPLACE);
    
    // disconnect Comment mutation
    const [disconComment, { loading: disconLoading, error: disconError, data: discondata }] = useMutation(COMMENT_DISCONNECT);
    
    // delete Comment mutation
    const [deleteComment, { loading: deleteLoading, error: deleteError, data: deleteData }] = useMutation(DELETE_COMMENT);
    
    // cookies setup
    const cookies = new Cookies();

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
        <div className={styler.commentView}>
            {(data?.post?.comments.length === 0) ? <div className={styler.commentViewNone}>Még senki sem szólt hozzá</div> : <>{data?.post?.comments.map((v,i) => {return <>
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
                  <div className={styler.focimData}><FontAwesomeIcon icon={faFeather} size={"sm"} /> Szerző: {v?.author?.name}</div>
                  <div className={styler.focimData}>
                    <FontAwesomeIcon icon={faCalendarDays} size="sm" /> Dátum: {v?.createdAt?.slice(0,10)} {'(' + new Date(v?.createdAt).toLocaleString('hu-HU', {weekday: 'short'}) + ')'} {new Date(v?.createdAt).toTimeString().slice(0,8)}
                  </div>
                  <div className={styler.focimData}><FontAwesomeIcon icon={faListOl} size="sm" /> Hozzászólások: {v?.author?.commentsCount}</div>
                </div>
                {(v?.author?.id === cookies.get('id')) && <><div className={styler.deleteIcon}>
                  <div onClick={() => 
                      {disconComment({variables: {"where": {"id": postID}, "data": {"comments":{"disconnect":[{"id": v?.id}]}}}}),
                        deleteComment({variables: {"where": {"id": v?.id}}})
                        }}>
                          <FontAwesomeIcon icon={faTrashCan} />
                  </div>
                </div></>}
            </div>
            <div className={styler.document}>
              <DocumentRenderer document={v?.content?.document} renderers={renderers}/>
            </div>
            </div>
            </>})} {/* .map() function END */}
            </>} {/* Ternary END */}
        </div>
        </>
    )
}

{/*disconComment({variables: {"where": {"id": postID}, "data": {"comments":{"disconnect":[{"id": v?.id}]}}}}),
  deleteComment({variables: {"where": {"id": v?.id}}}) 
// {replace({variables: {
                  //   "where": {"id": v?.id}, 
                  //   "data": {
                  //     "content":[{
                  //       "type":"paragraph",
                  //       "children":[{
                  //         "text":"Ezt a hozzászólást a szerzője törölte. - Admin"
                  //       }]
                  //     }]
                  //   }
                  // }})}*/}