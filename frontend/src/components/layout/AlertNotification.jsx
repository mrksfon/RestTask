import { useState } from "react";
import { Alert, Button } from "react-bootstrap";

const AlertNotification = () => {
  const [show, setShow] = useState(true);

  return (
    <>
      <Alert show={show} variant="danger">
        <p>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget
          lacinia odio sem nec elit. Cras mattis consectetur purus sit amet
          fermentum.
        </p>
        <Button onClick={() => setShow(false)} variant="outline-danger">
          Close me y'all!
        </Button>
      </Alert>
    </>
  );
};

export default AlertNotification;
