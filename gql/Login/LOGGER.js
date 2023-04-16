import { gql } from "@apollo/client";

export const LOGGER = gql`
mutation Mutation($data: LogCreateInput!) {
  createLog(data: $data) {
    who
    what {
      document
    }
    when
  }
}
`;