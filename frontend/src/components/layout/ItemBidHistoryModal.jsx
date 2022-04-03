import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const ItemBidHistoryModal = ({ itemBidHistory }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        style={{ marginTop: "5px" }}
      >
        Item Bidding History
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemBidHistory.map((item, index) => {
            return (
              <p key={index}>
                {item.user.name} {item.user.lastname} bidded {item.bid_amount} ${" "}
                {new Date(item.created_at).toLocaleString()}
              </p>
            );
          })}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ItemBidHistoryModal;
