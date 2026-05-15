// Hook do React para criar variáveis reativas
import { useState } from "react";

// Componente principal — ponto de entrada da aplicação
export default function App() {

  // Perfil selecionado: "estudante" ou "recrutador"
  const [role, setRole] = useState("estudante");

  // Controla se a senha está visível
  const [showPassword, setShowPassword] = useState(false);

  // Dados dos campos do formulário
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // Atualiza o campo correto quando o usuário digita
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Chamado ao clicar em "Criar conta" — conecte sua API aqui
  const handleSubmit = () => {
    console.log("Criar conta como", role, form);
    // fetch("/api/register", { method: "POST", body: JSON.stringify({ role, ...form }) });
  };

  return (
    // Layout dividido em dois lados
    <div style={styles.root}>

      {/* ── LADO ESQUERDO: apresentação roxa ── */}
      <div style={styles.sideLeft}>
        <div style={styles.logo}>&lt;/&gt;</div>

        <div style={styles.heroCard}>
          <p style={styles.heroTitle}>Conecte seu talento ao mercado real</p>
          <p style={styles.heroDesc}>
            Transforme conhecimento em experiência prática. Participe de
            projetos reais, construa seu portfólio e dê o próximo passo na sua
            carreira com a Impulse.
          </p>
        </div>

        <p style={styles.footerLeft}>© 2026 Impulse • HackaTown Unifenas</p>
      </div>

      {/* Linha azul separadora */}
      <div style={styles.divider} />

      {/* ── LADO DIREITO: formulário ── */}
      <div style={styles.sideRight}>
        <p style={styles.formTitle}>Criar Conta</p>
        <p style={styles.formSubtitle}>Escolha seu perfil e comece agora</p>

        {/* Botões de seleção de perfil */}
        <div style={styles.roleSelector}>
          {["estudante", "recrutador"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                ...styles.roleBtn,
                // Aplica estilo ativo no botão selecionado
                ...(role === r ? styles.roleBtnActive : styles.roleBtnInactive),
              }}
            >
              <span style={styles.roleIcon}>{r === "estudante" ? "🎓" : "👔"}</span>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Texto descritivo muda conforme o perfil */}
        <p style={styles.roleDesc}>
          {role === "estudante"
            ? "Publique projetos e construa sua trajetória"
            : "Encontre talentos e publique vagas"}
        </p>

        {/* Campo Nome */}
        <div style={styles.fieldGroup}>
          <label style={styles.fieldLabel}>Nome</label>
          <input
            style={styles.fieldInput}
            type="text"
            name="name"
            placeholder="Seu nome completo"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        {/* Campo E-mail */}
        <div style={styles.fieldGroup}>
          <label style={styles.fieldLabel}>E-mail</label>
          <input
            style={styles.fieldInput}
            type="email"
            name="email"
            placeholder="seuemail@gmail.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* Campo Senha com botão para mostrar/ocultar */}
        <div style={styles.fieldGroup}>
          <label style={styles.fieldLabel}>Senha</label>
          <div style={styles.pwWrap}>
            <input
              style={styles.fieldInput}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={handleChange}
            />
            <button style={styles.pwToggle} onClick={() => setShowPassword(!showPassword)}>
              👁
            </button>
          </div>
        </div>

        {/* Botão de submit — label muda com o perfil selecionado */}
        <button style={styles.submitBtn} onClick={handleSubmit}>
          Criar conta como {role.charAt(0).toUpperCase() + role.slice(1)} ›
        </button>

        <p style={styles.loginLink}>
          Já tem uma conta?{" "}
          <a href="/login" style={styles.loginAnchor}>Fazer Login</a>
        </p>
      </div>
    </div>
  );
}

// ── ESTILOS ──────────────────────────────────────────────────────────────────
// Em React, estilos inline usam camelCase (fontSize, borderRadius...)
const styles = {
  // Divide a tela em duas colunas
  root: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "system-ui, sans-serif",
  },

  // Coluna roxa da esquerda
  sideLeft: {
    background: "linear-gradient(135deg, #3b1f8c 0%, #6b21d6 50%, #2d1b69 100%)",
    width: "42%",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    color: "#fff",
    border: "2.5px solid #fff",
    padding: "4px 10px",
    borderRadius: 6,
    display: "inline-block",
  },
  heroCard: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 14,
    padding: "1.5rem",
  },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: "0.75rem" },
  heroDesc: { color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.6 },
  footerLeft: { color: "rgba(255,255,255,0.5)", fontSize: 12 },

  // Linha azul vertical
  divider: { width: 3, background: "#3b82f6", flexShrink: 0 },

  // Coluna escura da direita
  sideRight: {
    background: "#111827",
    flex: 1,
    padding: "3rem 2.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  formTitle: { color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 4 },
  formSubtitle: { color: "#9ca3af", fontSize: 14, marginBottom: "1.5rem" },

  // Botões de perfil
  roleSelector: { display: "flex", gap: 12, marginBottom: "1rem" },
  roleBtn: {
    flex: 1,
    padding: "0.75rem",
    borderRadius: 10,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 500,
    border: "1.5px solid transparent",
  },
  roleBtnActive: { background: "#374151", borderColor: "#7c3aed", color: "#fff" },
  roleBtnInactive: { background: "transparent", borderColor: "#374151", color: "#9ca3af" },
  roleIcon: { fontSize: 18 },
  roleDesc: { color: "#6b7280", fontSize: 12, textAlign: "center", marginBottom: "1.5rem" },

  // Campos do formulário
  fieldGroup: { marginBottom: "1rem" },
  fieldLabel: { color: "#d1d5db", fontSize: 14, fontWeight: 500, marginBottom: 6, display: "block" },
  fieldInput: {
    width: "100%",
    background: "#1f2937",
    border: "1.5px solid #374151",
    borderRadius: 8,
    padding: "0.65rem 1rem",
    color: "#f9fafb",
    fontSize: 14,
    outline: "none",
  },

  // Container relativo para posicionar o ícone do olho
  pwWrap: { position: "relative" },
  pwToggle: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
    fontSize: 16,
  },

  // Botão e link de login
  submitBtn: {
    width: "100%",
    padding: "0.75rem",
    background: "#7c3aed",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "1.25rem",
  },
  loginLink: { textAlign: "center", color: "#6b7280", fontSize: 13, marginTop: "1rem" },
  loginAnchor: { color: "#7c3aed", textDecoration: "none" },
};