import { gql } from "@apollo/client"

export const DELETE_COMMENT = gql`
mutation Mutation($where: CommentWhereUniqueInput!) {
    deleteComment(where: $where) {
      name
    }
  }
`;