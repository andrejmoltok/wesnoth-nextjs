import styler from '../styles/CommentWrite.module.css';
import { useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { CONNECT_COMMENT_TO_POST } from '../gql/CommentWrite/CONNECT_COMMENT_TO_POST';


export default function CommentWrite({isWrite,id}) {

    const [commentObjects, setCommentObjects] = useState([]);
    const [commentName, setCommentName] = useState("");
    const [inputValue, setInputValue] = useState('');
    const [getID, setGetID] = useState(null);

    
    useEffect(() => {
      const cookies = new Cookies();
      const getIDCookie = cookies.get('id');
      setGetID(getIDCookie);
    },[]);

    function handleChange(event) {
        const newValue = event.target.value;
        setInputValue(newValue);
        const inputLines = newValue.split('\n');
        const newCommentObjects = inputLines.map((line) => (
            { 
              "type":"paragraph",
              "children":[{
                "text": line
              }] 
            }
        ));
        const newCommentName = newCommentObjects[0].children[0].text.slice(0,12);
        setCommentName(newCommentName);
        setCommentObjects(newCommentObjects);
    };

    const [commenter, { data, loading, error }] = useMutation(CONNECT_COMMENT_TO_POST, {
        variables: {
            "where": {
                "id": id,
            },
            "data": {
                "comments": {
                    "create": [
                      {
                        "name": commentName,
                        "author": {
                          "connect": {
                            "id": getID
                          }
                        },
                        "content": commentObjects
                      }
                    ]
                  }
            }
        }
    });

    return (
        <>
        <form onSubmit={(e) => {
            e.preventDefault();
            commenter();
            setCommentObjects([]);
            setInputValue('');
        }} 
            className={isWrite ? styler.formExpand : styler.formHidden}>
            <textarea 
                onChange={handleChange}
                value={inputValue}
                autoFocus
                rows="3" cols="80"
                className={isWrite ? styler.commentTextExpand : styler.commentTextHidden}
            />
            <div className={isWrite ? styler.submitVisible : styler.submitHidden}>
                <button 
                    type={"submit"} 
                    className={isWrite ? styler.submitBtnVisible : styler.submitBtnHidden}
                    >
                    Küldés
                </button>
            </div>
        </form>
        </>
    )
}