import { useLazyQuery, gql  } from '@apollo/client';

const GET_USERS = gql`
query Query {
  users {
    name
    email
    adminRole
    userRole
    race {
      races
      image {
        url
      }
    }
  }
}
`;

export default function Query() {

    const [ getUsers, { loading, error, data }] = useLazyQuery(GET_USERS);

    const {name, email, adminRole, userRole, race, races, image, url} = data?.users || {};
 
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
    return (
    <>
    <div>
      <button onClick={() => getUsers()}>Get Users!</button>
      <ol>
        {data && data?.users.map((user) => (
          <ol key={user.name}>
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
            <li>adminRole: {user.adminRole === null ? 'Non': user.adminRole}</li>
            <li>userRole: {user.userRole === null ? 'Non': user.userRole}</li>
            <li>race: {user.race?.races}</li>
            <li>image url: <a href={user.race?.image.url} target='_blank'>{user.race?.image.url}</a></li>
          </ol>
        ))}
      </ol>
    </div>
    </>
)
}