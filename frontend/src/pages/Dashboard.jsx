import axios from "axios";
import { useEffect, useState } from "react";
import AuctionItemsTable from "../components/layout/AuctionItemsTable";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { token, user, setBidAmount, setAlertNotification } = useAuth();

  const [auctionItems, setAuctionItems] = useState([]);
  const [dashboardErrors, setDashboardErrors] = useState(null);

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
        setDashboardErrors(null);
        setAuctionItems(response.data);
      } catch (err) {
        setDashboardErrors(err.response.data);
      }
    };

    const fetchDataSettings = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/settings/users/${user.id}`,
          config
        );

        const { data } = response;
        setBidAmount(data.maximum_bid_amount);
        setAlertNotification(data.bid_alert_notification);
      } catch (err) {}
    };

    fetchData();
    fetchDataSettings();
  }, []);

  return (
    <>
      <AuctionItemsTable auctionItems={auctionItems} />
      {dashboardErrors != null && (
        <ul>
          {Object.keys(dashboardErrors.errors).map((error, index) => (
            <li style={{ color: "red" }} key={index}>
              {dashboardErrors.errors[error][0]}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Dashboard;
