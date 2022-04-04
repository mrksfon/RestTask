import axios from "axios";
import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import useAuth from "../hooks/useAuth";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationErrors, setNotificationErrors] = useState(null);
  const { token, user, setNotificationCount } = useAuth();

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/notifications/${user.id}`,
          config
        );

        const { data } = response;
        setNotifications(response.data);
        setNotificationErrors(null);
        setNotificationCount(0);
        // console.log(data);
      } catch (err) {
        // setBidErrors(err.response.data);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {notifications.map((item, index) => {
        return (
          <Alert variant={`${item.type == 1 ? "info" : "danger"}`} key={index}>
            <p>{item.message}</p>
          </Alert>
        );
      })}
    </>
  );
};

export default Notifications;

// {auctionStatus === true ? "Current Bid" : "Last bid"} :{" "}
