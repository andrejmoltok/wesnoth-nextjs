import { gql } from '@apollo/client';

export const QUERY_POSTS_FOR_PAGES = gql`query Query {
    posts {
      title
    }
  }`;