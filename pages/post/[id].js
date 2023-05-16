import styler from '../../styles/GetPost.module.css';
import CommentView from '../../components/commentview';
import CommentWrite from '../../components/commentWrite';
import Cookies from 'universal-cookie';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery} from '@apollo/client';
import { DocumentRenderer } from '@keystone-6/document-renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faFeather, faCalendarDays, faListOl, faCoins, faPoo } from '@fortawesome/free-solid-svg-icons'
import { QUERY_POST_BY_ID } from '../../gql/ID/QUERY_POST_BY_ID';


export default function GetPost() {

    const router = useRouter();

    const { id, from } = router.query;

    const { data, loading, error } = useQuery(QUERY_POST_BY_ID, {
      variables: { "where": { "id": id } },
      pollInterval: 1000, // masodpercenkent frissit
      
    });

    const { title, content, document, author, name, race, races, image, url, createdAt, commentsCount, id: postID } = data?.post || {};

    const [isWrite, setIsWrite] = useState(false);
    const [getTheID, setGetTheID] = useState(false);

    useEffect(() => {
      const cookies = new Cookies();
      if (cookies.get('id')) {
        setGetTheID(true);
        setIsWrite(true);
      } else {
        setIsWrite(false);
      }
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
                <div><FontAwesomeIcon icon={faCoins} />  /  <FontAwesomeIcon icon={faPoo} /></div>
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
            
            <CommentView postID={id} />
            
            {(getTheID || (getTheID && from === 'comments')) && <CommentWrite isWrite={true} id={id} />}

          </div> {/* comment END */}
        </div> {/* posts END */}
      </>
    );

  }
