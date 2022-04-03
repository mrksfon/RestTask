import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Countdown from "react-countdown";
import { useParams } from "react-router-dom";
import { useAsyncDebounce } from "react-table/dist/react-table.development";
import useAuth from "../hooks/useAuth";

const BidNow = () => {
  const { id } = useParams();

  const { token, user } = useAuth();

  const [item, setItem] = useState({});
  const [bidErrors, setBidErrors] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [currentBidAmount, setCurrentBidAmount] = useState("");
  const [currentUserBidAmount, setCurrentUserBidAmount] = useState("");
  const [message, setMessage] = useState("");

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
        setBidErrors(null);
        setItem(response.data);
        setTimeLeft(response.data.formatted_date);
      } catch (err) {
        // console.log(err.response);
        setBidErrors(err.response.data);
      }
    };

    const fetchBidData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/item_bidding_history/${id}/${user.id}`,
          config
        );
        // console.log(response);
        setBidErrors(null);
        console.log(response.data);
        setCurrentBidAmount(response.data.auction_item_last_bid);
        setCurrentUserBidAmount(response.data.user_last_bid);
      } catch (err) {
        // console.log(err.response);
        // setBidErrors(err.response.data);
        // console.log(err.data);
      }
    };

    fetchData();
    fetchBidData();
  }, []);

  const handleBid = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/bid",
        {
          user_id: user.id,
          auction_item_id: id,
        },
        config
      );
      const { data } = response;
      console.log(response.data);
      setBidErrors(null);
      if (
        data.hasOwnProperty("auction_item_last_bid") &&
        data.hasOwnProperty("user_last_bid")
      ) {
        setCurrentBidAmount(data.auction_item_last_bid);
        setCurrentUserBidAmount(response.data.user_last_bid);
        setMessage("");
      } else if (data.hasOwnProperty("message")) {
        setMessage(data.message);
      }
    } catch (err) {
      // console.log(err.response);
      // setBidErrors(err.response.data);
    }
  };

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
                <Button
                  variant="primary"
                  style={{ width: "70%" }}
                  type="button"
                  onClick={handleBid}
                >
                  Bid
                </Button>
              </Col>

              <Col>
                <Card.Text>Current Bid : {currentBidAmount} $</Card.Text>
              </Col>
              <Col>
                <Card.Text>
                  Your latest Bid : {currentUserBidAmount} $
                </Card.Text>
              </Col>
              <Col>
                <Button variant="primary" style={{ width: "70%" }}>
                  Auto bid
                </Button>
              </Col>
              {message && (
                <Card.Text style={{ marginTop: "5px", color: "red" }}>
                  {message}
                </Card.Text>
              )}
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default BidNow;
