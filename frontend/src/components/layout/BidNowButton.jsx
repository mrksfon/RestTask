import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const BidNowButton = ({ id }) => {
  return (
    <Link to={`/auction_item/${id}`}>
      <Button variant="success">Bid</Button>
    </Link>
  );
};

export default BidNowButton;
