import { gql } from '@apollo/client';

export const QUERY_POST_COMMENTS = gql`
query PostCommentsQuery($where: PostWhereUniqueInput!) {
    post(where: $where) {
      comments {
        id
        author {
          name
          race {
            image {
              url
            }
          }
        }
        createdAt
        content {
          document
        }
      }
    }
  }`;