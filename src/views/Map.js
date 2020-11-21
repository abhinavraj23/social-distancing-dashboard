import React from "react";
// react plugin used to create google maps
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

// reactstrap components
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import {
  D3_TRANSITION_DURATION,
  MAP_META,
  MAP_TYPES,
  MAP_VIEWS,
  MAP_VIZS,
  STATE_CODES,
  STATE_NAMES,
  STATISTIC_CONFIGS,
  UNKNOWN_DISTRICT_KEY} from '../constants';

import MapVisualizer from "../components/MapVisualizer/MapVisualizer.js";
class Map extends React.Component {
  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card className="card-plain">
                <CardHeader>District Maps- Click anyone</CardHeader>
                <CardBody>
                <MapVisualizer
                    mapCode= "GJ"
                    mapViz = {MAP_VIZS.CHOROPLETH}
                    mapView = {MAP_VIEWS.DISTRICTS}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Map;
