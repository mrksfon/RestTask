import axios from "axios";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const DeleteModal = ({ id }) => {
  const [show, setShow] = useState(false);
  const [deleteErrors, setDeleteErrors] = useState(null);
  const { token, navigate } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = async () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/auction_items/${id}`,
        config
      );

      navigate("/");
      setDeleteErrors(null);
      handleClose();
    } catch (err) {
      setDeleteErrors(err.response.data);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        Delete
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Auction item deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Delete
          </Button>
          {deleteErrors != null && (
            <ul>
              {Object.keys(deleteErrors.errors).map((error, index) => (
                <li style={{ color: "red" }} key={index}>
                  {deleteErrors.errors[error][0]}
                </li>
              ))}
            </ul>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteModal;
