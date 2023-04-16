import { gql } from "@apollo/client";

export const QUERY_POST_BY_ID = gql`
query Query($where: PostWhereUniqueInput!) {
    post(where: $where) {
    title
    content {
      document
    }
    author {
      name
      race {
        image {
          url
        }
        races
      }
    }
    createdAt
    id
    commentsCount
  }
}`;