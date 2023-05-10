import { gql } from '@apollo/client';

export const QUERY_POST_COMMENTS = gql`
query PostCommentsQuery($where: PostWhereUniqueInput!) {
    post(where: $where) {
      comments {
        id
        author {
          id
          name
          race {
            image {
              url
            }
          }
          commentsCount
        }
        createdAt
        content {
          document
        }
      }
    }
  }`;