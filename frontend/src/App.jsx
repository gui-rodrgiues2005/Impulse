import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Feed from "./Pages/Feed/Feed";
import Buscar from "./Pages/Buscar/Buscar";
import Mensagens from "./Pages/Mensagens/Mensagens";
import Perfil from "./Pages/Perfil/Perfil";

// Componentes
import Layout from "./Components/Layout/Layout";
import ProtectedRoute from "./Routes/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Privadas */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/feed" element={<Feed />} />
          <Route path="/publicar" element={<div>Publicar</div>} />
          <Route path="/perfil" element={<div>Perfil</div>} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/mensagens" element={<Mensagens />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;