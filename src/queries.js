import { graphql } from "react-apollo";
import gql from "graphql-tag";

export const USER = gql`
  query User {
    me {
      id
      name
      email
    }
  }
`;

export const withUser = graphql(USER);

// export const DEVICE_LOCATIONS = gql`
// query DeviceLocations {
//       allDevices {
//         nodes {
//           id
//           name
//           batteryPercentage
//           positionsByDeviceId(first: 10, orderBy: POSITION_AT_DESC) {
//             nodes {
//               id
//               positionAt
//               address
//             }
//           }
//         }
//       }
//     }
// `;

export const DEVICE_LOCATIONS = gql`
  query DeviceLocations{
    allDevices {
      nodes {
        name
        id
        batteryPercentage
        userByUserId {
          id
        }
        positionsByDeviceId(first: 10, orderBy: POSITION_AT_DESC) {
          nodes {
            id
            positionAt
            latitude
            longitude
            address
          }
          pageInfo{
            endCursor
          }
        }
      }
    }
  }
`;


// export const DEVICE_LOCATIONS = gql`
//   query DeviceLocations($after: String){
//     allDevices {
//       nodes {
//         name
//         id
//         batteryPercentage
//         userByUserId {
//           id
//         }
//         positionsByDeviceId(first: 10, orderBy: POSITION_AT_DESC, after:$after) {
//           nodes {
//             id
//             positionAt
//             latitude
//             longitude
//             address
//           }
//           pageInfo{
//             endCursor
//           }
//         }
//       }
//     }
//   }
// `;

// function query(){
// const{data, error, loading, fetchMore }= useQuery(DEVICE_LOCATIONS, { variables:{after:null}})

// }

//creates higher component fxn
export const withDeviceLocations = graphql(DEVICE_LOCATIONS);
