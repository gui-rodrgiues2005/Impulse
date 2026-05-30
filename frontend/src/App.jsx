import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";

import StudentLayout from "./Layouts/StudentLayout/StudentLayout";
import CompanyLayout from "./Layouts/CompanyLayout/CompanyLayout";

import StudentProfile from "./Pages/student/StudentProfile/StudentProfile";
import CompanyProfile from "./Pages/company/CompanyProfile/CompanyProfile";

import CompanyDashboard from "./Pages/company/Dashboard/Dashboard";
import Vagas from "./Pages/company/Vagas/Vagas";
import Candidatos from "./Pages/company/Candidatos/Candidatos";
import Analytics from "./Pages/company/Analytics/Analytics";
import MensagensCompany from "./Pages/company/MensagensCompany/MensagensCompany";
import ConfigCompany from "./Pages/company/ConfigCompany/ConfigCompany";



import VagasStudent from "./Pages/student/Vagas/VagasStudent";

import Publicacoes from "./Components/Publicacoes/Publicacoes";
import Feed from "./Components/Feed/Feed";



import ProtectedRoute from "./Routes/ProtectedRoute/ProtectedRoute";

function AppRoutes() {

  // USER LOGADO
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const userRole = user?.role;

  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={
            user
              ? (
                userRole === "student"
                  ? <Navigate to="/student/profile" />
                  : <Navigate to="/company/dashboard" />
              )
              : <Login />
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            user
              ? (
                userRole === "student"
                  ? <Navigate to="/student/profile" />
                  : <Navigate to="/company/dashboard" />
              )
              : <Register />
          }
        />

        {/* ========================= */}
        {/* STUDENT */}
        {/* ========================= */}

        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="profile"
            element={<StudentProfile />}
          />

          <Route
            path="publicar"
            element={<Publicacoes />}
          />

          <Route
            path="feed"
            element={<Feed />}
          />

          <Route
            path="vagas"
            element={<VagasStudent />}
          />

        </Route>

        {/* ========================= */}
        {/* COMPANY */}
        {/* ========================= */}

        <Route
          path="/company"
          element={
            <ProtectedRoute>
              <CompanyLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="dashboard"
            element={<CompanyDashboard />}
          />

          <Route
            path="vagas"
            element={<Vagas />}
          />

          <Route
            path="publicar"
            element={<Publicacoes />}
          />

          <Route
            path="feed"
            element={<Feed />}
          />

          <Route
            path="candidatos"
            element={<Candidatos />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />

          <Route
            path="profile"
            element={<CompanyProfile />}
          />

          <Route
            path="mensagens"
            element={<MensagensCompany />}
          />

          <Route
            path="config"
            element={<ConfigCompany />}
          />

        </Route>

        {/* ========================= */}
        {/* FALLBACK */}
        {/* ========================= */}

        <Route
          path="*"
          element={
            !user
              ? <Navigate to="/" />
              : (
                userRole === "student"
                  ? <Navigate to="/student/profile" />
                  : userRole === "recruiter"
                    ? <Navigate to="/recruiter/profile" />
                    
                    : <Navigate to="/company/dashboard" />
              )
          }
        />
      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;