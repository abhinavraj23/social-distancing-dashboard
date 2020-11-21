import React,{useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";

function Icons(props){

  const [dist,setDist] = useState("");

  useEffect(()=>{

    const district = props.match.params.q ;
    var  vide = document.getElementById("vid");
    vide.playbackRate=0.1
    setDist(district);
   
  },[])
    const hist = useHistory();

    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <h5 className="title">{`Cameras of District ${dist}`}</h5>
                  <p className="category">
                    Click on object to view stats
                  </p>
                </CardHeader>
                <CardBody className="all-icons">
                  <Row>
                    <Col
                      lg="4"
                      md="4"
                      sm="6"
                      >
                      <div className="font-icon-detail" onClick={()=>{
                        hist.push('/admin/performance/1')
                      }}>
                        <i className="tim-icons" />
                        <video controls className="small-player">
                          <source src="/videos/sample1.mp4" type="video/mp4"/>
                        </video>
                        <p>Camera 1</p>
                      </div>
                    </Col>
                    <Col
                      lg="4"
                      md="4"
                      sm="6"
                      >
                     <div className="font-icon-detail" onClick={()=>{
                        hist.push('/admin/performance/2')
                      }}>
                        <i className="tim-icons" />
                        <video id="vid" controls className="small-player" muted>
                          <source src="/videos/sample2.mp4" type="video/mp4"/>
                        </video>  
                        <p>Camera 2</p>
                      </div>
                    </Col>
                    <Col
                      lg="4"
                      md="4"
                      sm="6"
                    >
                       <div className="font-icon-detail" onClick={()=>{
                        hist.push('/admin/performance/3')
                          }}>
                        <i className="tim-icons" />
                        <video id="vid" controls className="small-player" muted>
                          <source src="/videos/sample3.mp4" type="video/mp4"/>
                        </video>  
                        <p>Camera 2</p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }

export default Icons;
