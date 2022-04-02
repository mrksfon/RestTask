import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Countdown from "react-countdown";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const BidNow = () => {
  const { id } = useParams();

  const { token } = useAuth();

  const [item, setItem] = useState({});
  const [itemErrors, setItemErrors] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/auction_items/${id}`,
          config
        );
        // console.log(response);
        setItemErrors(null);
        setItem(response.data);
        setTimeLeft(response.data.formatted_date);
      } catch (err) {
        // console.log(err.response);
        setItemErrors(err.response.data);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Container style={{ marginTop: "5px" }}>
        <Card>
          <Card.Body>
            <Card.Title>{item.name}</Card.Title>
            <Card.Text>{item.description}</Card.Text>

            <Card.Text style={{ fontSize: "30px" }}>
              Time Left : <Countdown date={new Date(item.auction_start)} />
            </Card.Text>

            <Row>
              <Col>
                <Button variant="primary" style={{ width: "70%" }}>
                  Bid
                </Button>
              </Col>
              <Col>
                <Form.Control type="number" id="inputNumber" />
              </Col>
              <Col>
                <Card.Text>Current Bid : 15 $</Card.Text>
              </Col>
              <Col>
                <Button variant="primary" style={{ width: "70%" }}>
                  Auto bid
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default BidNow;
