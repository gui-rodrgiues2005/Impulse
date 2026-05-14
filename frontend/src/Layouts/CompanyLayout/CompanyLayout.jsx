import CompanySidebar from "../../Components/sidebars/CompanySidebar/CompanySidebar";
import { Outlet } from "react-router-dom";

const CompanyLayout = () => {
  return (
    <div className="dashboard-layout">

      <CompanySidebar />

      <main className="dashboard-content">
        <Outlet />
      </main>

    </div>
  );
};

export default CompanyLayout;