import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { hasCookie, getCookie, deleteCookie } from 'cookies-next';

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

    useEffect(() => {
        if (hasCookie('id') && hasCookie('keystonejs-session')) {
            setGetID(getCookie('id'));
        }
    }, []);

    const { data, loading, error} = useQuery(QUERY_PROFILE_INFO_BY_ID, {
        variables: {
            "where": {
                "id": getID
            }
        },
        pollInterval: 500
    });

    const { name, email, race, races, image, url, adminRole, userRole, isAdmin, isEditor, isUser} = data?.user || {};

    return (
        <>
            <div>This is your profile</div>
            <div>{name}</div>
        </>
    )
}