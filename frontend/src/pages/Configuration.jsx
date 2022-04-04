import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import useAuth from "../hooks/useAuth";

const Configuration = () => {
  const { token, user, navigate, setBidAmount, setAlertNotification } =
    useAuth();

  const [maximumBidAmount, setMaximumBidAmount] = useState(0);
  const [bidAlertNotification, setBidAlertNotification] = useState(0);
  const [bidErrors, setBidErrors] = useState(null);

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
        setBidErrors(null);
      } catch (err) {
        setBidErrors(err.response.data);
      }
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
      setBidErrors(null);
      setBidAmount(maximumBidAmount);
      setAlertNotification(bidAlertNotification);
      navigate("/dashboard");
    } catch (err) {
      // console.log(err.response);
      setBidErrors(err.response.data);
    }
  };

  const handleChangeMaximumBidAmount = (e) => {
    setMaximumBidAmount(e.target.value);
  };

  const handleChangeBidAlertNotification = (e) => {
    setBidAlertNotification(e.target.value);
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
        {bidErrors != null && (
          <ul>
            {Object.keys(bidErrors.errors).map((error, index) => (
              <li style={{ color: "red" }} key={index}>
                {bidErrors.errors[error][0]}
              </li>
            ))}
          </ul>
        )}
      </Form>
    </Container>
  );
};

export default Configuration;
