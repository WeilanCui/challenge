import React, { Component } from "react";
import get from "lodash.get";
import moment from "moment";
import {
  Map as LeafletMap,
  TileLayer,
  Marker,
  LayersControl,
  LayerGroup,
  Tooltip,
  ScaleControl,
  Polyline,
  ZoomControl,
} from "react-leaflet";
import L, { latLng, latLngBounds } from "leaflet";

const LAYER_KEY = "map-layer";

export default class ReactMap extends Component {
  static getDerivedStateFromProps(props, state) {
    const bounds = latLngBounds([]);
    const devices = get(props, ["devices"]) || [];
    devices.forEach(function (device) {
      const lat = get(device, ["positionsByDeviceId", "nodes", 0, "latitude"]);
      const lng = get(device, ["positionsByDeviceId", "nodes", 0, "longitude"]);

      if (lat || lng) {
        bounds.extend({ lat, lng });
        bounds.extend({ lat: lat + 0.001, lng: lng + 0.001 });
        bounds.extend({ lat: lat - 0.001, lng: lng - 0.001 });
      }
    });

    if (!bounds.isValid()) {
      // continental us
      bounds.extend(
        L.latLngBounds({ lat: 50, lng: -130 }, { lat: 20, lng: -60 })
      );
    }
    return Object.assign({}, state, bounds.isValid() ? { bounds } : {});
  }

  state = {
    satellite: localStorage.getItem(LAYER_KEY) === "Satellite",
    "Show current location": !(
      localStorage.getItem("Show current location") === "false"
    ),
    bounds: null,
    selectedDate: moment("06/21/2020").startOf("D"),
  };

  renderDevice = (device, node, nodeIndex) => {
    const { selectedDate } = this.state;
    const { id, name, batteryPercentage } = device;
    const lat = get(node, [
      // "positionsByDeviceId",
      // "nodes",
      // nodeIndex,
      "latitude",
    ]);
    const lng = get(node, [
      // "positionsByDeviceId",
      // "nodes",
      // nodeIndex,
      "longitude",
    ]);
    const address = get(node, [
      // "positionsByDeviceId",
      // "nodes",
      // nodeIndex,
      "address",
    ]);
    const positionAt = get(node, [
      // "positionsByDeviceId",
      // "nodes",
      // nodeIndex,
      "positionAt",
    ]);
    const start = moment(selectedDate).startOf("D");
    const end = moment(selectedDate).endOf("D");
    if (lat || lng) {
      return (
        <>
          {/* Insert Device Track */}
          <Marker
            key={`${id}${nodeIndex}`}
            iconSize={100}
            position={latLng({ lat, lng })}
          >
            <Tooltip
              permanent={true}
              direction='top'
              maxWidth={240}
              autoPan={false}
              closeButton={false}
              autoClose={false}
              closeOnClick={false}
              interactive={true}
            >
              <div>
                <div>
                  <b>{name || "Unknown device"}</b>{" "}
                  {`(${Math.round(batteryPercentage)}%)`}
                </div>
                {address ? (
                  <div className='small'>
                    <a href={`https://maps.google.com/maps?q=${lat},${lng}`}>
                      {address}
                    </a>
                  </div>
                ) : null}
                {positionAt ? (
                  <div className='small'>
                    Updated: {moment(positionAt).format("ddd MMM D, h:mma")}
                  </div>
                ) : null}
              </div>
            </Tooltip>
          </Marker>
        </>
      );
    } else {
      return null;
    }
  };

  renderPolyline = (device) => {
    const nodes = this.filterNode(device);
    return nodes.map((node) => {
      let lat = get(node, ["latitude"]);
      let lng = get(node, ["longitude"]);
      return [lat, lng];
    });
  };

  filterNode = (device) => {
    const filtered = [];
    let date = new Date(this.props.selectedDate).toISOString();
    date = date.slice(0, 10);

    const nodes = get(device, ["positionsByDeviceId", "nodes"]);
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      if (node.positionAt.slice(0, 10) === date) {
        filtered.push(node);
      }
    }

    return filtered;
  };

  renderNodes = (device) => {
    const nodes = this.filterNode(device);
    const renderNode = nodes.map((node, i) => {
      return this.renderDevice(device, node, i);
    });
    return renderNode;
  };
  render() {
    const { devices } = this.props;
    const { bounds } = this.state;

    return (
      <LeafletMap
        ref={(map) => (this._map = map)}
        bounds={bounds}
        onBaselayerchange={(e) => {
          this.setState({ satellite: e.name === "Satellite" });
          localStorage.setItem(LAYER_KEY, e.name);
        }}
        onOverlayadd={(e) => {
          this.setState({ [e.name]: true });
          localStorage.setItem(e.name, "true");
        }}
        onOverlayremove={(e) => {
          this.setState({ [e.name]: false });
          localStorage.setItem(e.name, "false");
        }}
        maxZoom={16}
        zoomControl={false}
        style={{ minHeight: 800, width: "100%" }}
      >
        <ScaleControl position='bottomleft' />
        <ZoomControl position='topright' />
        <LayersControl
          position='topleft'
          sortLayers={true}
          sortFunction={function (layerA, layerB, nameA, nameB) {
            const order = ["Map", "Satellite", "Show current location"];
            const idxA = order.indexOf(nameA),
              idxB = order.indexOf(nameB);

            return idxA > idxB ? +1 : idxA < idxB ? -1 : 0;
          }}
        >
          <LayersControl.BaseLayer name='Map' checked={!this.state.satellite}>
            <TileLayer
              crossOrigin
              tileSize={512}
              minZoom={1}
              maxZoom={20}
              zoomOffset={-1}
              url='https://d1y5pbzf4dj7w6.cloudfront.net/maps/streets/{z}/{x}/{y}@2x.png?key=9itgsP62snlBhRn8G4sH'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer
            name='Satellite'
            checked={this.state.satellite}
          >
            <TileLayer
              url='https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}'
              maxZoom={20}
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
            />
          </LayersControl.BaseLayer>
          {(devices || []).length > 0 ? (
            <LayersControl.Overlay
              name='Show current location'
              checked={this.state["Show current location"]}
            >
              <LayerGroup>
                {(devices || []).map(this.renderNodes)}
                {console.log("line 213")}
              </LayerGroup>
            </LayersControl.Overlay>
          ) : null}
        </LayersControl>
        <Polyline
          pathOptions={{ color: "red" }}
          positions={(devices || []).map(this.renderPolyline)}
        />
      </LeafletMap>
    );
  }
}
