import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import * as yup from "yup";

const Configuration = () => {
  const { token, user, navigate, setBidAmount, setAlertNotification } =
    useAuth();

  const [maximumBidAmount, setMaximumBidAmount] = useState(0);
  const [bidAlertNotification, setBidAlertNotification] = useState(0);
  const [bidErrors, setBidErrors] = useState("");
  const [alertErrors, setAlertErrors] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/settings/users/${user.id}`,
          config
        );

        const { data } = response;
        // console.log(data);
        setMaximumBidAmount(data.maximum_bid_amount);
        setBidAlertNotification(data.bid_alert_notification);
      } catch (err) {}
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/settings/${user.id}`,
        {
          user_id: user.id,
          maximum_bid_amount: maximumBidAmount,
          bid_alert_notification: bidAlertNotification,
        },
        config
      );
      setBidAmount(maximumBidAmount);
      setAlertNotification(bidAlertNotification);

      navigate("/dashboard");
    } catch (err) {}
  };

  const handleChangeMaximumBidAmount = (e) => {
    const newBidAMount = e.target.value;
    if (newBidAMount < 0 || newBidAMount > user.account) {
      setBidErrors(`Bid must be in range of 0 and ${user.account} `);
      return;
    }
    setBidErrors("");
    setMaximumBidAmount(newBidAMount);
  };

  const handleChangeBidAlertNotification = (e) => {
    const newAlertBid = e.target.value;
    if (newAlertBid < 0 || newAlertBid > 100) {
      setAlertErrors(`Alert bid notification must be between 0 and 100`);
      return;
    }
    setBidAlertNotification(newAlertBid);
    setAlertErrors("");
  };

  return (
    <Container>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Maximum bid amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter maximum bid amount"
            onChange={handleChangeMaximumBidAmount}
            value={maximumBidAmount}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bid alert notification</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter bid alert notification in (%)"
            onChange={handleChangeBidAlertNotification}
            value={bidAlertNotification}
          />
        </Form.Group>

        <Button variant="primary" type="button" onClick={handleSubmit}>
          Save
        </Button>
      </Form>
      {bidErrors}
      <br />
      {alertErrors}
    </Container>
  );
};

export default Configuration;
