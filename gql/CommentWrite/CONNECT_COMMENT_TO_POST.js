import { gql } from '@apollo/client';

export const CONNECT_COMMENT_TO_POST = gql`
mutation Mutation($where: PostWhereUniqueInput!, $data: PostUpdateInput!) {
    updatePost(where: $where, data: $data) {
      comments {
        name
        author {
          name
        }
        createdAt
      }
    }
  }
`;