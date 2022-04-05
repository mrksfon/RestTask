import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import Countdown from "react-countdown";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Pusher from "pusher-js";
import ItemBidHistoryModal from "../components/layout/ItemBidHistoryModal";
import { API_KEY } from "../constants/helpers";

const BidNow = () => {
  const { id } = useParams();

  const { token, user, isAdmin, setNotificationCount } = useAuth();

  const [item, setItem] = useState({});
  const [bidErrors, setBidErrors] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [currentBidAmount, setCurrentBidAmount] = useState("");
  const [currentUserBidAmount, setCurrentUserBidAmount] = useState("");
  const [message, setMessage] = useState("");
  const [itemBidHistory, setItemBidHistory] = useState([]);
  const [autoBid, setAutoBid] = useState(false);
  const [auctionStatus, setAuctionStatus] = useState(true);

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
        setAuctionStatus(response.data.is_active);
      } catch (err) {
        setBidErrors(err.response.data);
      }
    };

    const fetchBidHistoryData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/item_bidding_history/${id}`,
          config
        );
        setItemBidHistory(response.data);
      } catch (err) {}
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
      } catch (err) {}
    };

    const fetchAutoBidData = async () => {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/auto_bid`,
          {
            user_id: user.id,
            auction_item_id: id,
            is_active: false,
          },
          config
        );

        setAutoBid(response.data.is_active);
      } catch (err) {}
    };

    fetchData();
    fetchBidData();
    fetchBidHistoryData();
    fetchAutoBidData();

    const pusher = new Pusher(API_KEY, {
      cluster: "eu",
    });

    let channel = pusher.subscribe(`auction_item_${id}`);

    channel.bind(`auction_item_${id}`, (data) => {
      if (data.data.hasOwnProperty("auction_end")) {
        setMessage(data.data.auction_end);
        setAuctionStatus(false);
      }
      if (data.data.hasOwnProperty("message") && user.id == data.data.user_id) {
        setMessage(data.data.message);
      }
      if (
        data.data.hasOwnProperty("not_enough_funds") &&
        user.id == data.data.not_enough_funds
      ) {
        setMessage(data.data.not_enough_funds);
      }
      if (
        data.data.hasOwnProperty("item_bidding_history") &&
        user.id == data.data.item_bidding_history.user_id
      ) {
        setCurrentUserBidAmount(data.data.item_bidding_history.bid_amount);
        setMessage("");
      }
      if (
        data.data.hasOwnProperty("does_not_have_funds") &&
        user.id == data.data.user.id
      ) {
        setMessage(data.data.does_not_have_funds);
        setAutoBid(false);
      }
      if (data.data.hasOwnProperty("item_bidding_history")) {
        setCurrentBidAmount(data.data.item_bidding_history.bid_amount);
        setItemBidHistory((prevItemBidHistory) => [
          ...prevItemBidHistory,
          data.data.item_bidding_history,
        ]);
      }
    });

    let userChannel = pusher.subscribe(`user_${user.id}`);

    userChannel.bind(`user_${user.id}`, (data) => {
      setNotificationCount(
        (prevNotificationCount) => prevNotificationCount + 1
      );
    });
  }, []);

  const handleBid = async () => {
    const requestType = autoBid ? "1" : "2";
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/bid",
        {
          user_id: user.id,
          auction_item_id: id,
          request_type: requestType,
        },
        config
      );
    } catch (err) {}
  };

  const handleSubmitAutoBid = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/auto_bid/users/${user.id}`,
        {
          user_id: user.id,
          auction_item_id: id,
        },
        config
      );
      setAutoBid(response.data.is_active);
    } catch (err) {}
  };

  if (currentUserBidAmount < currentBidAmount && autoBid) {
    handleBid();
  }

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
              {auctionStatus === 1 && (
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
              )}

              <Col>
                <Card.Text>
                  {auctionStatus === true ? "Current Bid" : "Last bid"} :{" "}
                  {currentBidAmount} $
                </Card.Text>
              </Col>
              {auctionStatus === 1 && (
                <>
                  <Col>
                    <Card.Text>
                      Your latest Bid : {currentUserBidAmount} $
                    </Card.Text>
                  </Col>
                  <Col>
                    <Button
                      variant={`${autoBid ? "success" : "primary"}`}
                      style={{ width: "70%" }}
                      onClick={handleSubmitAutoBid}
                    >
                      Auto bid
                    </Button>
                  </Col>
                </>
              )}
              {message && (
                <Card.Text style={{ marginTop: "5px", color: "red" }}>
                  {message}
                </Card.Text>
              )}
            </Row>
          </Card.Body>
        </Card>
        {isAdmin === 1 && (
          <ItemBidHistoryModal itemBidHistory={itemBidHistory} />
        )}
      </Container>
    </>
  );
};

export default BidNow;
