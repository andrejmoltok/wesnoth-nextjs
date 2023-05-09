import { useQuery } from "@apollo/client";
import { QUERY_PROFILE_INFO_BY_ID } from "../gql/Profile/QUERY_PROFILE_INFO_BY_ID";
import styles from '../styles/Profile.module.css';

function Profile({getID}) {

    const { data, loading, error} = useQuery(QUERY_PROFILE_INFO_BY_ID, {
        variables: {
            "where": {
                "id": getID
            }
        },
        pollInterval: 1000,
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
    });

    const { name, email, race, races, image, url, adminRole, userRole, isAdmin, isEditor, isUser} = data?.user || {};

    return (
        <>
        <div style={{color:'black', marginLeft:'35px'}}>Profile of {name}</div>
        </>
    )
}

export default Profile;