import React from "react";
import { Button } from "react-bootstrap";
import { Link, Route } from "react-router-dom";

const EditButton = ({ id }) => {
  return (
    <Link to={`/auction_item/${id}/edit`}>
      <Button variant="primary">Edit</Button>
    </Link>
  );
};

export default EditButton;
