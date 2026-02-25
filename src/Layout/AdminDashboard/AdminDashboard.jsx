import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <>
      <div>
        <Outlet></Outlet>
        {/* Others... */}
      </div>
    </>
  );
};

export default AdminDashboard;