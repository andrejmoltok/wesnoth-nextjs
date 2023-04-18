import { gql } from "@apollo/client";

export const COMMENT_DISCONNECT = gql`
mutation UpdatePost($where: PostWhereUniqueInput!, $data: PostUpdateInput!) {
    updatePost(where: $where, data: $data) {
      commentsCount
    }
  }
`;