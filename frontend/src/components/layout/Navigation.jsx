import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  CONFIGURATION,
  CREATE_AUCTION_ITEM,
  DASHBOARD,
  HOME_PAGE,
  LOGIN_PAGE,
  NOTIFICATIONS,
} from "../../constants/routes";
import useAuth from "../../hooks/useAuth";

const Navigation = () => {
  const { token, onLogout, isAdmin, notificationCount } = useAuth();
  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand>
            <NavLink
              style={{ textDecoration: "none", color: "black" }}
              to={HOME_PAGE}
            >
              Home
            </NavLink>
          </Navbar.Brand>
          <Nav className="me-auto">
            {!token && (
              <Navbar.Brand>
                <NavLink
                  to={LOGIN_PAGE}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Login
                </NavLink>
              </Navbar.Brand>
            )}
            {token && (
              <>
                <Navbar.Brand>
                  <NavLink
                    to={DASHBOARD}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      marginLeft: "3px",
                    }}
                  >
                    Dashboard
                  </NavLink>
                </Navbar.Brand>
                <Navbar.Brand>
                  <NavLink
                    to={CONFIGURATION}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      marginLeft: "3px",
                    }}
                  >
                    Settings
                  </NavLink>
                </Navbar.Brand>

                <Navbar.Brand>
                  <NavLink
                    to={NOTIFICATIONS}
                    style={{
                      textDecoration: "none",
                      color: "black",
                      marginLeft: "3px",
                    }}
                  >
                    Notifications {notificationCount}
                  </NavLink>
                </Navbar.Brand>

                {isAdmin === 1 && (
                  <Navbar.Brand>
                    <NavLink
                      to={CREATE_AUCTION_ITEM}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        marginLeft: "3px",
                      }}
                    >
                      Create
                    </NavLink>
                  </Navbar.Brand>
                )}
                <Button variant="danger" onClick={onLogout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
