import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Container, FloatingLabel } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const CreateAuctionItem = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const { token, navigate } = useAuth();
  const [createItemErrors, setCreateItemErrors] = useState(null);

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
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auction_items",
        {
          name: name,
          description: description,
          auction_start: time,
        },
        config
      );
      setCreateItemErrors(null);
      navigate("/dashboard");
    } catch (err) {
      setCreateItemErrors(err.response.data);
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
            Save
          </Button>
          {createItemErrors != null && (
            <ul>
              {Object.keys(createItemErrors.errors).map((error, index) => (
                <li style={{ color: "red" }} key={index}>
                  {createItemErrors.errors[error][0]}
                </li>
              ))}
            </ul>
          )}
        </Form>
      </Container>
    </>
  );
};

export default CreateAuctionItem;
