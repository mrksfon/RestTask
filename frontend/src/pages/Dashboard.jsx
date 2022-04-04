import axios from "axios";
import { useEffect, useState } from "react";
import AlertNotification from "../components/layout/AlertNotification";
import AuctionItemsTable from "../components/layout/AuctionItemsTable";
import useAuth from "../hooks/useAuth";
import Pusher from "pusher-js";
import { ToastContainer } from "react-bootstrap";

const Dashboard = () => {
  const {
    token,
    setLoginErrors,
    loginErrors,
    user,
    setBidAmount,
    setAlertNotification,
    setNotificationCount,
  } = useAuth();

  const [userChannel, setUserChannel] = useState("");
  const [message, setMessage] = useState(null);
  const [show, setShow] = useState(false);

  const [auctionItems, setAuctionItems] = useState([]);

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/auction_items",
          config
        );
        // console.log(response);
        setLoginErrors(null);
        // console.log(response);
        setAuctionItems(response.data);
      } catch (err) {
        // console.log(err.response);
        setLoginErrors(err.response.data);
      }
    };

    const fetchDataSettings = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/settings/users/${user.id}`,
          config
        );

        const { data } = response;
        // console.log(data);
        setBidAmount(data.maximum_bid_amount);
        setAlertNotification(data.bid_alert_notification);
        // setBidErrors(null);
      } catch (err) {
        // setBidErrors(err.response.data);
      }
    };

    fetchData();
    fetchDataSettings();
  }, []);

  return (
    <>
      {message != null && <AlertNotification />}
      <AuctionItemsTable auctionItems={auctionItems} />
      {loginErrors != null && (
        <ul>
          {Object.keys(loginErrors.errors).map((error, index) => (
            <li style={{ color: "red" }} key={index}>
              {loginErrors.errors[error][0]}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Dashboard;
