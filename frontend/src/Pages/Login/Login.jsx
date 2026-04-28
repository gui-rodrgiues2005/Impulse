import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/IMPULSE-BRANCA.png";
import "./Login.scss";
import API_URL from "../../service/api";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      // Salvar token (UserId) no localStorage
      localStorage.setItem("token", data.userId);
      
      navigate('/feed')
      
    } catch (error) {
      setError(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      {/* LADO ESQUERDO */}
      <div className="register__left">
        <div className="register__left-logo">
          <img src={Logo} alt="Impulse Logo" />
        </div>
        <div className="register__left-card">
          <p className="register__left-title">Bem-vindo de volta</p>
          <p className="register__left-desc">
            Acesse sua conta e continue construindo sua trajetória com a Impulse.
          </p>
        </div>
        <p className="register__left-footer">
          © 2026 Impulse • Hackathon Unifenas
        </p>
      </div>
      {/* Divider */}
      <div className="register__divider" />
      {/* LADO DIREITO */}
      <div className="register__right">
        {/* Feedback visual */}
        {error && <div className="register__error">{error}</div>}

        {/* INPUT EMAIL */}
        <div className="register__field">
          <label>E-mail</label>
          <input
            type="email"
            name="email"
            placeholder="seuemail@gmail.com"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* INPUT SENHA */}
        <div className="register__field register__password">
          <label>Senha</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Digite sua senha"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
            👁
          </button>
        </div>

        {/* BOTÃO */}
        <button className="register__submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "Entrando..." : "Entrar →"}
        </button>

        {/* REGISTER */}
        <p className="register__login">
          Não tem uma conta? <a href="/register">Criar conta</a>
        </p>
      </div>
    </div>
  );
}