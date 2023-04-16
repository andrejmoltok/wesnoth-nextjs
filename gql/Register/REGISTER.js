import { gql } from "@apollo/client";

export const REGISTER = gql`
mutation Register($data: UserCreateInput!) {
    createUser(data: $data) {
      name
      email
      password {
        isSet
      }
      race {
        races
      }
      adminRole
      userRole
    }
  }`;