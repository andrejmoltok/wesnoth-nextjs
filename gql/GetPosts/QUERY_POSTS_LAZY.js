import { gql } from '@apollo/client';

export const QUERY_POSTS_LAZY = gql`
query Query($take: Int, $skip: Int!, $orderBy: [PostOrderByInput!]!, $where: PostWhereInput!) {
  posts(take: $take, skip: $skip, orderBy: $orderBy, where: $where) {
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
    isPublished
    commentsCount
  }
}`;