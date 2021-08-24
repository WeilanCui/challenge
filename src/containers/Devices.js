import React, { useState } from 'react';
import get from 'lodash.get';
import { withDeviceLocations, DEVICE_LOCATIONS } from '../queries';
import Map from '../components/Map';
import ReactDatePicker from 'react-datepicker';
import { gql, useQuery } from 'react-apollo'

import "react-datepicker/dist/react-datepicker.css";

const SuperDevice = (props) => (
  
  <div className="container">
    <div style={{ marginBottom: 300 }}>
      <div>
        lat,lng
      </div>
    </div>
    <div className="col-12">
      <Map devices={get(props, ['data', 'allDevices', 'nodes'], [])} />
    </div>
  </div>
);

const Devices = (props) => {
  const [selectedDate, setSelectedDate] = useState(null);
 
  return (
    <div className="container">
      <div style={{ marginBottom: 300 }}>
        <ReactDatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
      </div>
      <div className="col-12">
        <Map devices={get(props, ['data', 'allDevices', 'nodes'], [])} selectedDate={selectedDate} 
        endCursor= {get(props['data', 'allDevices', 'positionsByDeviceId','pageInfo'], [])}
      
        /> 
      </div> {console.log(props.endCursor, "hutzpah")}
      {console.log(selectedDate)}
    </div>
  );
}

// export default function FetchNWash(props){
  
//   const{data, error, loading, fetchMore }= useQuery(DEVICE_LOCATIONS, { variables:{after:null}})

//   if (loading) return 'Loading...';
//   // if (error ||!data) return `Error! ${error.message}`;
//  // "WyJwb3NpdGlvbl9hdF9kZXNjIixbIjIwMjAtMDYtMjRUMDc6Mzk6NDItMDQ6MDAiLDIyNzNdXQ=="
//   // const  {endCursor}= get(props['data', 'allDevices','pageInfo'],[])
//   console.log(endCursor)
//   fetchMore({
//     variables:{after:endCursor},
//     updateQuery:(prevResult,{fetchMoreResult})=>{

//     }

  

// })
// withDeviceLocations(Devices)
// }

export default withDeviceLocations(Devices);
