import React, { useState } from 'react';
import get from 'lodash.get';
import { withDeviceLocations, DEVICE_LOCATIONS } from '../queries';
import Map from '../components/Map';
import ReactDatePicker from 'react-datepicker';
// import { gql, useQuery } from 'react-apollo'

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
  //   const{data, error, loading, fetchMore }= useQuery(DEVICE_LOCATIONS, { variables:{after:null}})

  //   if (loading) return 'Loading...';
  // if (error) return `Error! ${error.message}`;
  return (
    <div className="container">
      <div style={{ marginBottom: 300 }}>
        <ReactDatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
      </div>
      <div className="col-12">
        <Map devices={get(props, ['data', 'allDevices', 'nodes'], [])} selectedDate={selectedDate}/>
      </div>
      {console.log(selectedDate)}
    </div>
  );
}

export default withDeviceLocations(Devices);
