import StudentSidebar from "../../Components/sidebars/StudentSidebar/StudentSidebar";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
  return (
    <div className="dashboard-layout">

      <StudentSidebar />

      <main className="dashboard-content">
        <Outlet />
      </main>

    </div>
  );
};

export default StudentLayout;