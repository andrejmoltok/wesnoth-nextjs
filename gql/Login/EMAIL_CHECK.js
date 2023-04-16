import { gql } from "@apollo/client";

export const EMAIL_CHECK = gql`
query Query($where: UserWhereUniqueInput!) {
  user(where: $where) {
    name
    email
    userRole
    id
  }
}
`;