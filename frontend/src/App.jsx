import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import StudentLayout from "./Layouts/StudentLayout/StudentLayout";
import RecruiterLayout from "./Layouts/RecruiterLayout/RecruiterLayout";
import CompanyLayout from "./Layouts/CompanyLayout/CompanyLayout";

import StudentProfile from "./Pages/student/StudentProfile/StudentProfile";
import RecruiterProfile from "./Pages/recruiter/RecruiterProfile/RecruiterProfile";
import CompanyProfile from "./Pages/company/CompanyProfile/CompanyProfile";

function AppRoutes() {

  // TESTE TEMPORÁRIO
  const userRole = "recruiter";
  // student
  // recruiter
  // company

  return (
    <BrowserRouter>

      <Routes>

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