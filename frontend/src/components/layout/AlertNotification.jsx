import React, { useState } from "react";
import { Button, Col, Container, Row, Toast } from "react-bootstrap";

const AlertNotification = () => {
  const [show, setShow] = useState(true);
  return (
    <Container>
      <Row>
        <Col xs={6}>
          <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">Bootstrap</strong>
              <small>11 mins ago</small>
            </Toast.Header>
            <Toast.Body>
              Woohoo, you're reading this text in a Toast!
            </Toast.Body>
          </Toast>
        </Col>
      </Row>
    </Container>
  );
};

export default AlertNotification;
