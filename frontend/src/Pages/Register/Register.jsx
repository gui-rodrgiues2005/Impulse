import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

import Logo from "../../assets/IMPULSE-BRANCA.png";
import API_URL from "../../service/api";

import "./Register.scss";

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roles = [
    {
      label: "Estudante",
      value: "student",
      icon: "🎓",
    },
    {
      label: "Empresa",
      value: "company",
      icon: "🏢",
    },
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: role,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const text = await response.text();
        throw new Error(`Erro ao processar resposta do servidor: ${text}`);
      }

      if (!response.ok) {
        console.log("Erro completo:", data);

        if (data.errors) {
          const mensagens = Object.values(data.errors)
            .flat()
            .join(" | ");

          throw new Error(mensagens);
        }

        throw new Error(data.message || "Erro ao registrar");
      }

      setSuccess("Usuário criado com sucesso!");

      setForm({
        name: "",
        email: "",
        password: "",
      });

      navigate("/");

    } catch (error) {
      console.error("Erro capturado:", error);

      setError(error.message || "Erro ao registrar");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">

      <div className="register__left">

        <div className="register__left-logo">
          <img
            src={Logo}
            className="logo"
            alt="Impulse Logo"
          />
        </div>

        <div className="register__left-card">
          <p className="register__left-title">
            Conecte seu talento ao mercado real
          </p>

          <p className="register__left-desc">
            Transforme conhecimento em experiência prática e
            aproxime-se das oportunidades certas para sua carreira.
          </p>
        </div>

        <p className="register__left-footer">
          © 2026 Impulse • Hackathon Unifenas
        </p>

      </div>

      <div className="register__divider" />

      <div className="register__right">

        <p className="register__right-title">
          Criar Conta
        </p>

        <p className="register__right-subtitle">
          Escolha seu perfil e comece agora
        </p>

        <div className="register__roles">

          {roles.map((r) => (
            <button
              key={r.value}
              onClick={() => setRole(r.value)}
              className={role === r.value ? "active" : ""}
              type="button"
              disabled={loading}
            >
              <span>{r.icon}</span>
              {r.label}
            </button>
          ))}

        </div>

        <p className="register__role-desc">

          {role === "student" &&
            "Publique projetos e construa sua trajetória"}

          {role === "company" &&
            "Gerencie recrutadores, vagas e talentos da empresa"}

        </p>

        {error && (
          <div className="register__error">
            {error}
          </div>
        )}

        {success && (
          <div className="register__success">
            {success}
          </div>
        )}

        <div className="register__field">
          <label>Nome</label>

          <input
            type="text"
            name="name"
            placeholder="Seu nome completo"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

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

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            <Eye size={18} />
          </button>

        </div>

        <button
          className="register__submit"
          onClick={handleSubmit}
          disabled={loading}
        >

          {loading
            ? "Criando conta..."
            : `Criar conta como ${
                role === "student"
                  ? "Estudante"
                  : "Empresa"
              } ›`}

        </button>

        <p className="register__login">
          Já tem uma conta? <a href="/">Fazer login</a>
        </p>

      </div>
    </div>
  );
}