import { gql } from '@apollo/client';

export const QUERY_POSTS_LAZY = gql`
query Query($take: Int, $skip: Int!, $orderBy: [PostOrderByInput!]!) {
  posts(take: $take, skip: $skip, orderBy: $orderBy) {
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