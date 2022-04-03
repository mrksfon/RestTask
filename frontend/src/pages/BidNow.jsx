import axios from "axios";
import Echo from "laravel-echo";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Countdown from "react-countdown";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Pusher from "pusher-js";
const BidNow = () => {
  const { id } = useParams();

  const { token, user } = useAuth();

  const [item, setItem] = useState({});
  const [bidErrors, setBidErrors] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [currentBidAmount, setCurrentBidAmount] = useState("");
  const [currentUserBidAmount, setCurrentUserBidAmount] = useState("");
  const [marko, setMarko] = useState("");
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
        setBidErrors(null);
        setItem(response.data);
        setTimeLeft(response.data.formatted_date);
      } catch (err) {
        setBidErrors(err.response.data);
      }
    };

    const fetchBidData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/item_bidding_history/${id}/${user.id}`,
          config
        );
        setBidErrors(null);
        setCurrentBidAmount(response.data.auction_item_last_bid);
        setCurrentUserBidAmount(response.data.user_last_bid);
      } catch (err) {
        // setBidErrors(err.response.data);
      }
    };

    fetchData();
    fetchBidData();

    const pusher = new Pusher("1a439697d7e76e04d5eb", {
      cluster: "eu",
    });

    let channel = pusher.subscribe(`auction_item_${id}`);

    channel.bind(`auction_item_${id}`, (data) => {
      console.log(data);
      if (user.id == data.data.user_id) {
        if (data.data.hasOwnProperty("message")) {
          setMessage(data.data.message);
          console.log(user);
        }
        if (data.data.hasOwnProperty("item_bidding_history")) {
          setCurrentUserBidAmount(data.data.item_bidding_history.bid_amount);
        }
      }

      if (data.data.hasOwnProperty("item_bidding_history")) {
        setCurrentBidAmount(data.data.item_bidding_history.bid_amount);
      }
    });

    // let channel = pusher.subscribe(`auction_item${id}`);
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
