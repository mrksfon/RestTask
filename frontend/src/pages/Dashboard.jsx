import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { token } = useAuth();

  return (
    <>
      <h3>All auction items</h3>

      <div>Authenticated as {token}</div>
    </>
  );
};

export default Dashboard;
