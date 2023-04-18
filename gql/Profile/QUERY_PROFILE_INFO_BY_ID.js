import { gql } from "@apollo/client";

export const QUERY_PROFILE_INFO_BY_ID = gql`
query QUERY_PROFILE_INFO($where: UserWhereUniqueInput!) {
    user(where: $where) {
      name
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