import React, { useState, useEffect, useMemo } from "react";

import { Col, Row } from 'reactstrap';

//import images
import avatar from "../../assets/images/users/avatar-1.jpg";

const Section = () => {


    return (
        <React.Fragment>

            <Row className="mb-4">
                <Col lg={12}>
                    <div className="d-flex align-items-center">
                        <img src={avatar} alt="" className="avatar-sm rounded" />
                        <div className="ms-3 flex-grow-1">
                            <h5 className="mb-2 card-title">Hello</h5>
                            <p className="text-muted mb-0">Dashboard for admin</p>
                        </div>
                       
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default Section;