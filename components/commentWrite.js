import styler from '../styles/CommentWrite.module.css';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import { hasCookie, setCookie, getCookie, deleteCookie } from 'cookies-next';

const CONNECT_COMMENT_TO_POST = gql`
mutation Mutation($where: PostWhereUniqueInput!, $data: PostUpdateInput!) {
    updatePost(where: $where, data: $data) {
      comments {
        name
        author {
          name
        }
        createdAt
      }
    }
  }
`;

export default function CommentWrite({isWrite,id}) {

    const [commentObjects, setCommentObjects] = useState([]);
    const [commentName, setCommentName] = useState("");
    const [inputValue, setInputValue] = useState('');

    function handleChange(event) {
        const newValue = event.target.value;
        setInputValue(newValue);
        const inputLines = newValue.split('\n');
        const newCommentObjects = inputLines.map((line) => (
            { "type":"paragraph",
            "children":[{
            "text": line
            }] 
        }));
        const newCommentName = newCommentObjects[0].children[0].text.slice(0,10);
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
                            "id": getCookie('id')
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