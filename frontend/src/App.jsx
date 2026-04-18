import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Feed from "./Pages/Feed/Feed";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;