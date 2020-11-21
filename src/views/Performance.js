
import React,{useState,useEffect} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4
} from "variables/charts.js";

function Performance (props){

    const [videoId,setId] = useState("");

    useEffect(()=>{
        const id = props.match.params.q ;
        if(id == ":q"){
          setId("1")
          setBgChartData(`data${1}`);
        }else
        {
          setId(id);
          setBgChartData(`data${id}`);
        }
        

    },[])

    const [bigChartData,setBgChartData] = useState(`data2`);

    return (
      <>
        <div className="content">
          <Row>
            <Col xs="12">
            <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">
                      <h5 className="card-category">Live Tracking</h5>
                      <CardTitle tag="h2">Visualization</CardTitle>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <video controls style={{width:"100%", }}>
                          <source src={`/videos/output${videoId}.mp4`} type="video/mp4"/>
                  </video>
                </CardBody>
              </Card>
              <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">
                      <h5 className="card-category">Final Result</h5>
                      <CardTitle tag="h2">Violation</CardTitle>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={chartExample1[bigChartData]}
                      options={chartExample1.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }

export default Performance;
