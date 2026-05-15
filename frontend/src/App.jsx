import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";

import StudentLayout from "./Layouts/StudentLayout/StudentLayout";
import RecruiterLayout from "./Layouts/RecruiterLayout/RecruiterLayout";
import CompanyLayout from "./Layouts/CompanyLayout/CompanyLayout";

import StudentProfile from "./Pages/student/StudentProfile/StudentProfile";
import RecruiterProfile from "./Pages/recruiter/RecruiterProfile/RecruiterProfile";
import CompanyProfile from "./Pages/company/CompanyProfile/CompanyProfile";



import CompanyDashboard from "./Pages/company/Dashboard/Dashboard";



function AppRoutes() {

  // TESTE TEMPORÁRIO
  const userRole = "company";
  // student
  // recruiter
  // company

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* STUDENT */}
        {userRole === "student" && (
          <Route path="/student" element={<StudentLayout />}>
            <Route
              path="profile"
              element={<StudentProfile />}
            />
          </Route>
        )}

        {/* RECRUITER */}
        {userRole === "recruiter" && (
          <Route path="/recruiter" element={<RecruiterLayout />}>
            <Route
              path="profile"
              element={<RecruiterProfile />}
            />
          </Route>
        )}

        {/* COMPANY */}
        {userRole === "company" && (
          <Route path="/company" element={<CompanyLayout />}>
            <Route
              path="dashboard"
              element={<CompanyDashboard />}
            />
            <Route
              path="profile"
              element={<CompanyProfile />}
            />

          </Route>
        )}

        <Route
          path="*"
          element={<Navigate to={`/${userRole}/profile`} />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;