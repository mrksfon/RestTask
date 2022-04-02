import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const EditAuctionItem = () => {
  const { id } = useParams();
  const { token, navigate } = useAuth();
  const [auctionItemErrors, setAuctionItemErrors] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/auction_items/15",
          config
        );
        setAuctionItemErrors(null);
        setName(response.data.name);
        setDescription(response.data.description);
        setTime(response.data.formatted_date);
      } catch (err) {
        setAuctionItemErrors(err.response.data);
      }
    };

    fetchData();
  }, []);

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleChangeTime = (e) => {
    setTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/auction_items/${id}`,
        {
          name: name,
          description: description,
          auction_start: time,
        },
        config
      );
      setAuctionItemErrors(null);
      navigate("/dashboard");
    } catch (err) {
      setAuctionItemErrors(err.response.data);
    }
  };
  return (
    <>
      <Container style={{ marginTop: "5px" }}>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              onChange={handleChangeName}
              value={name}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <FloatingLabel controlId="floatingTextarea2" label="Description">
              <Form.Control
                as="textarea"
                placeholder="Leave a description here"
                style={{ height: "100px" }}
                onChange={handleChangeDescription}
                value={description}
              />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-3">
            <input
              type="datetime-local"
              id="meeting-time"
              name="meeting-time"
              value={time}
              onChange={handleChangeTime}
            />
          </Form.Group>

          <Button variant="primary" type="button" onClick={handleSubmit}>
            Edit
          </Button>
          {auctionItemErrors != null && (
            <ul>
              {Object.keys(auctionItemErrors.errors).map((error, index) => (
                <li style={{ color: "red" }} key={index}>
                  {auctionItemErrors.errors[error][0]}
                </li>
              ))}
            </ul>
          )}
        </Form>
      </Container>
    </>
  );
};

export default EditAuctionItem;
