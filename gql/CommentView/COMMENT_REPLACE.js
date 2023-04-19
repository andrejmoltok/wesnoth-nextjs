import { gql } from "@apollo/client";

export const COMMENT_REPLACE = gql`
mutation UpdateComment($where: CommentWhereUniqueInput!, $data: CommentUpdateInput!) {
    updateComment(where: $where, data: $data) {
      content {
        document
      }
    }
  }
`;