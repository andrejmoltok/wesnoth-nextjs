import { useQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { LOGGER } from '../gql/Login/LOGGER';
import { QUERY_PROFILE_INFO_BY_ID } from '../gql/Profile/QUERY_PROFILE_INFO_BY_ID';
import Cookies from 'universal-cookie';

export default function SideProfile() {

    const router = useRouter();

    const [getID, setGetID] = useState("");

    const cookies = new Cookies();

    useEffect(() => {
      const cookies = new Cookies();
      const cookieValue = cookies.get("id");
      setGetID(cookieValue);
    }, []);

    const { data, loading, error} = useQuery(QUERY_PROFILE_INFO_BY_ID, {
        variables: {
            "where": {
                "id": getID
            }
        },
        pollInterval: 1000,
    });

    const { name, email, race, races, image, url, adminRole, userRole, isAdmin, isEditor, isUser} = data?.user || {};


    const [activity, { loading: loggerLoading, error: loggerError, data: loggerData }] = useMutation(LOGGER, {
      variables: {
        "data": {
          "who": data?.user?.name,
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
      activity();
      cookies.remove('id', {
        path: '/',
        maxAge: 3600,
      });
      cookies.remove('keystonejs-session',{
        path: '/',
        maxAge: 3600,
      });
      setGetID(!getID);
      router.push('/');
    };

    return (
        <>
            {/* {(!getID) && <Login />} */}
            {(getID) && <><div>{name} is logged in</div><button onClick={() => {handleLogout()}}>Kilépés</button></>}
        </>
    )
}