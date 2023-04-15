import { gql, useQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import Login from '../components/login';
import Cookies from 'universal-cookie';

const QUERY_PROFILE_INFO_BY_ID = gql`
query QUERY_PROFILE_INFO($where: UserWhereUniqueInput!) {
    user(where: $where) {
      name
      email
      race {
        races
        image {
          url
        }
      }
      adminRole
      userRole
      isAdmin
      isEditor
      isUser
    }
  }
`;

const LOGGER = gql`
mutation Mutation($data: LogCreateInput!) {
  createLog(data: $data) {
    who
    what {
      document
    }
    when
  }
}
`;

export default function Profile() {

    const [getID, setGetID] = useState("");

    const cookies = new Cookies();

    useEffect(() => {
      const cookieValue = cookies.get("id");
      setGetID(cookieValue);
    }, [setGetID]);

    const { data, loading, error} = useQuery(QUERY_PROFILE_INFO_BY_ID, {
        variables: {
            "where": {
                "id": getID
            }
        },
        pollInterval: 100
    });

    const { name, email, race, races, image, url, adminRole, userRole, isAdmin, isEditor, isUser} = data?.user || {};

    const [setName,setSetName] = useState("");

    useEffect(() => {
      if (data?.user) {
        setSetName(name);
        activity();
      }
    },[]);

    const [activity, { loading: loggerLoading, error: loggerError, data: loggerData }] = useMutation(LOGGER, {
      variables: {
        "data": {
          "who": setName,
          "what": [
            {
              "type": "paragraph",
              "children": [
                {
                  "text": "Kijelentkezett"
                }
              ]
            }
          ]
        }
      }
    });

    const handleLogout = () => {
      cookies.remove('id', {
        path: '/',
        maxAge: 3600,
      });
      cookies.remove('keystonejs-session',{
        path: '/',
        maxAge: 3600,
      });
      setGetID(!getID);
    };

    return (
        <>
            {(!getID) && <Login />}
            {getID && <><div>{name} is logged in</div><button onClick={handleLogout}>Kilépés</button></>}
        </>
    )
}