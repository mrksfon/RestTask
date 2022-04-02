import axios from "axios";
import { useEffect, useState } from "react";
import AuctionItemsTable from "../components/layout/AuctionItemsTable";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { token, setLoginErrors, loginErrors } = useAuth();

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
        setLoginErrors(null);
        setAuctionItems(response.data);
      } catch (err) {
        setLoginErrors(err.response.data);
      }
    };

    fetchData();
  }, []);

  return (
    <>
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
