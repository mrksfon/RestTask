import React from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

const BidNow = () => {
  const { id } = useParams();
  return (
    <>
      <Container>
        <h3>BID NOW PAGE {id}</h3>
      </Container>
    </>
  );
};

export default BidNow;
