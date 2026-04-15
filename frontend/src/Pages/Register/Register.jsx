import { useState } from "react";
import "./Register.scss";

export default function Register() {
  const [role, setRole] = useState("estudante");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Criar conta como", role, form);
  };

  return (
    <div className="register">
      
      {/* 🔵 LADO ESQUERDO */}
      <div className="register__left">
        <div className="register__left-logo">&lt;/&gt;</div>

        <div className="register__left-card">
          <p className="register__left-title">
            Conecte seu talento ao mercado real
          </p>
          <p className="register__left-desc">
            Transforme conhecimento em experiência prática. Participe de
            projetos reais, construa seu portfólio e dê o próximo passo na sua
            carreira com a Impulse.
          </p>
        </div>

        <p className="register__left-footer">
          © 2026 Impulse • Hackathon Unifenas
        </p>
      </div>

      {/* Divider */}
      <div className="register__divider" />

      {/* ⚫ LADO DIREITO */}
      <div className="register__right">
        <p className="register__right-title">Criar Conta</p>
        <p className="register__right-subtitle">
          Escolha seu perfil e comece agora
        </p>

        {/* PERFIL */}
        <div className="register__roles">
          {["estudante", "recrutador"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={role === r ? "active" : ""}
            >
              <span>{r === "estudante" ? "🎓" : "👔"}</span>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <p className="register__role-desc">
          {role === "estudante"
            ? "Publique projetos e construa sua trajetória"
            : "Encontre talentos e publique vagas"}
        </p>

        {/* INPUTS */}
        <div className="register__field">
          <label>Nome</label>
          <input
            type="text"
            name="name"
            placeholder="Seu nome completo"
            value={form.name}
            onChange={handleChange}
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
          />
        </div>

        <div className="register__field register__password">
          <label>Senha</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mínimo 8 caracteres"
            value={form.password}
            onChange={handleChange}
          />
          <button onClick={() => setShowPassword(!showPassword)}>
            👁
          </button>
        </div>

        {/* BOTÃO */}
        <button className="register__submit" onClick={handleSubmit}>
          Criar conta como {role.charAt(0).toUpperCase() + role.slice(1)} ›
        </button>

        {/* LOGIN */}
        <p className="register__login">
          Já tem uma conta? <a href="/login">Fazer login</a>
        </p>
      </div>
    </div>
  );
}