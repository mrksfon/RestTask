import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { onLogin, setEmail, setPassword, loginErrors } = useAuth();

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <Container style={{ marginTop: "5px" }}>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={handleChangeEmail}
              required={true}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={handleChangePassword}
              required={true}
            />
          </Form.Group>
          <Button variant="primary" type="button" onClick={onLogin}>
            Login
          </Button>
          {loginErrors != null && (
            <ul>
              {Object.keys(loginErrors.errors).map((error, index) => (
                <li style={{ color: "red" }} key={index}>
                  {loginErrors.errors[error][0]}
                </li>
              ))}
            </ul>
          )}
        </Form>
      </Container>
    </>
  );
};

export default Login;
