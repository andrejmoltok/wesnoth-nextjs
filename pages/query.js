import { useQuery, gql  } from '@apollo/client';

const GET_USERS = gql`
query Users($where: UserWhereInput!) {
  users(where: $where) {
    name
    email
  }
}`

export default function Query() {
    const { loading, error, data } = useQuery(GET_USERS,
        {variables: {"where": {
            "isUser": {
              "equals": true
            }
          }}});
    const {name, email} = data?.users || {};
 
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
    return (
    <>
    <div key={name}>
      <ol>
        {data?.users.map((user) => (
          <ol key={user.name}>
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
          </ol>
        ))}
      </ol>
    </div>
    </>
)
}