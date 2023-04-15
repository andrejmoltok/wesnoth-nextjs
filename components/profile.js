import { gql, useQuery } from '@apollo/client';
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

export default function Profile() {

    const [getID, setGetID] = useState("");

    const cookies = new Cookies();

    useEffect(() => {
     
      const cookieValue = cookies.get("id");
      setGetID(cookieValue);
    }, [setGetID]);

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

    const { data, loading, error} = useQuery(QUERY_PROFILE_INFO_BY_ID, {
        variables: {
            "where": {
                "id": getID
            }
        },
        pollInterval: 100
    });

    const { name, email, race, races, image, url, adminRole, userRole, isAdmin, isEditor, isUser} = data?.user || {};

    return (
        <>
            {(!getID) && <Login />}
            {getID && <><div>{name} is logged in</div><button onClick={handleLogout}>Log Out</button></>}
        </>
    )
}