import RecruiterSidebar from "../../Components/sidebars/RecruiterSidebar/RecruiterSidebar";
import { Outlet } from "react-router-dom";

const RecruiterLayout = () => {
  return (
    <div className="dashboard-layout">

      <RecruiterSidebar />

      <main className="dashboard-content">
        <Outlet />
      </main>

    </div>
  );
};

export default RecruiterLayout;