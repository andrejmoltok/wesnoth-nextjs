import { gql } from '@apollo/client';

export const QUERY_POSTS_FOR_PAGES = gql`
query Query($where: PostWhereInput!) {
  posts(where: $where) {
    title
  }
}
`;