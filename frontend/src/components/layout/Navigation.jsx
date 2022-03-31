import { NavLink } from "react-router-dom";
import {
  CONFIGURATION,
  CREATE_AUCTION_ITEM,
  DASHBOARD,
  LOGIN_PAGE,
} from "../../constants/routes";
import useAuth from "../../hooks/useAuth";

const Navigation = () => {
  const { token, onLogout, isAdmin } = useAuth();
  console.log("navigacija");
  return (
    <nav>
      <NavLink to="/">Home</NavLink>

      {!token && <NavLink to={LOGIN_PAGE}>Login</NavLink>}
      {token && (
        <>
          <NavLink to={DASHBOARD}>DashBoard</NavLink>
          <NavLink to={CONFIGURATION}>Auction settings</NavLink>
          {isAdmin && (
            <NavLink to={CREATE_AUCTION_ITEM}>Create auction item</NavLink>
          )}
          <button type="button" onClick={onLogout}>
            Sign Out
          </button>
        </>
      )}
    </nav>
  );
};

export default Navigation;
