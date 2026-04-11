// ─────────────────────────────────────────────────────────────────────────────
// IMPORTAÇÕES
// useState é um "hook" do React que permite criar variáveis reativas:
// quando o valor muda, a tela atualiza automaticamente.
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// Todo projeto React precisa de uma função chamada App como ponto de entrada.
// É ela que o arquivo main.jsx renderiza na tela.
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {

  // ── ESTADOS ────────────────────────────────────────────────────────────────
  // useState("estudante") cria uma variável 'role' com valor inicial "estudante".
  // 'setRole' é a função usada para mudar esse valor.
  const [role, setRole] = useState("estudante");

  // Controla se a senha está visível (true) ou oculta (false)
  const [showPassword, setShowPassword] = useState(false);

  // Armazena os valores digitados nos campos do formulário
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // ── FUNÇÕES ────────────────────────────────────────────────────────────────

  // Atualiza o campo correto do formulário quando o usuário digita.
  // e.target.name pega o atributo 'name' do input (ex: "email")
  // e.target.value pega o que foi digitado
  // O "..." (spread) mantém os outros campos intactos e só muda o que foi digitado
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Função chamada ao clicar no botão de criar conta.
  // Aqui você vai conectar com sua API no futuro.
  const handleSubmit = () => {
    console.log("Criar conta como", role, form);
    // TODO: substituir pelo fetch da sua API, exemplo:
    // fetch("/api/register", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ role, ...form }),
    // });
  };

  // ── RENDERIZAÇÃO (JSX) ─────────────────────────────────────────────────────
  // JSX parece HTML mas é JavaScript. Cada elemento aqui vira um elemento real
  // na tela do navegador.
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    // Container principal: divide a tela em dois lados (esquerdo e direito)
    <div style={styles.root}>

      {/* ── LADO ESQUERDO ── área roxa com a mensagem de apresentação */}
      <div style={styles.sideLeft}>

        {/* Logo da Impulse no topo */}
        <div style={styles.logo}>&lt;/&gt;</div>

        {/* Card com o texto principal de apresentação */}
        <div style={styles.heroCard}>
          <p style={styles.heroTitle}>Conecte seu talento ao mercado real</p>
          <p style={styles.heroDesc}>
            Transforme conhecimento em experiência prática. Participe de
            projetos reais, construa seu portfólio e dê o próximo passo na sua
            carreira com a Impulse.
          </p>
        </div>

        {/* Rodapé do lado esquerdo */}
        <p style={styles.footerLeft}>© 2026 Impulse • Hackathon Unifenas</p>
      </div>

      {/* Linha azul vertical que separa os dois lados */}
      <div style={styles.divider} />

      {/* ── LADO DIREITO ── área escura com o formulário de cadastro */}
      <div style={styles.sideRight}>

        {/* Título e subtítulo do formulário */}
        <p style={styles.formTitle}>Criar Conta</p>
        <p style={styles.formSubtitle}>Escolha seu perfil e comece agora</p>

        {/* ── SELETOR DE PERFIL ── botões Estudante / Recrutador */}
        {/* O .map() percorre o array e cria um botão para cada perfil */}
        <div style={styles.roleSelector}>
          {["estudante", "recrutador"].map((r) => (
            <button
              key={r}                      // chave única obrigatória em listas React
              onClick={() => setRole(r)}   // ao clicar, muda o perfil selecionado
              style={{
                ...styles.roleBtn,
                // Aplica estilo "ativo" se este botão for o perfil selecionado
                ...(role === r ? styles.roleBtnActive : styles.roleBtnInactive),
              }}
            >
              {/* Ícone muda conforme o perfil */}
              <span style={styles.roleIcon}>
                {r === "estudante" ? "🎓" : "👔"}
              </span>
              {/* Coloca a primeira letra em maiúsculo no label do botão */}
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Texto descritivo que muda conforme o perfil selecionado */}
        <p style={styles.roleDesc}>
          {role === "estudante"
            ? "Publique projetos e construa sua trajetória"
            : "Encontre talentos e publique vagas"}
        </p>

        {/* ── CAMPO: NOME ── */}
        <div style={styles.fieldGroup}>
          <label style={styles.fieldLabel}>Nome</label>
          <input
            style={styles.fieldInput}
            type="text"
            name="name"                   // deve bater com a chave no objeto 'form'
            placeholder="Seu nome completo"
            value={form.name}             // valor vem do estado
            onChange={handleChange}       // atualiza o estado ao digitar
          />
        </div>

        {/* ── CAMPO: E-MAIL ── */}
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

        {/* ── CAMPO: SENHA ── com botão para mostrar/ocultar */}
        <div style={styles.fieldGroup}>
          <label style={styles.fieldLabel}>Senha</label>

          {/* pwWrap é um container relativo para posicionar o ícone do olho */}
          <div style={styles.pwWrap}>
            <input
              style={styles.fieldInput}
              // type muda entre "password" (oculto) e "text" (visível)
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={handleChange}
            />
            {/* Botão do olho: alterna showPassword entre true e false */}
            <button
              style={styles.pwToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </button>
          </div>
        </div>

        {/* ── BOTÃO DE SUBMIT ── */}
        {/* O label muda dinamicamente conforme o perfil selecionado */}
        <button style={styles.submitBtn} onClick={handleSubmit}>
          Criar conta como {role.charAt(0).toUpperCase() + role.slice(1)} ›
        </button>

        {/* Link para quem já tem conta */}
        <p style={styles.loginLink}>
          Já tem uma conta?{" "}
          <a href="/login" style={styles.loginAnchor}>
            Fazer Login
          </a>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS
// Objeto JavaScript com todos os estilos da página.
// Em React, estilos inline usam camelCase (ex: fontSize em vez de font-size)
// e valores numéricos são em pixels por padrão.
// ─────────────────────────────────────────────────────────────────────────────
const styles = {

  // Container raiz: divide a tela em linha (esquerda | divisor | direita)
  root: {
    display: "flex",
    minHeight: "100vh",           // ocupa a altura toda da janela
    fontFamily: "system-ui, sans-serif",
  },

  // ── Lado esquerdo ──
  sideLeft: {
    background: "linear-gradient(135deg, #3b1f8c 0%, #6b21d6 50%, #2d1b69 100%)",
    width: "42%",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",      // empilha logo, card e rodapé verticalmente
    justifyContent: "space-between", // espaça logo no topo, card no meio, rodapé embaixo
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
    background: "rgba(255,255,255,0.1)",   // branco semi-transparente
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 14,
    padding: "1.5rem",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: 700,
    marginBottom: "0.75rem",
  },
  heroDesc: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    lineHeight: 1.6,
  },
  footerLeft: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },

  // Linha azul vertical separadora
  divider: {
    width: 3,
    background: "#3b82f6",
    flexShrink: 0,               // impede que a linha encolha
  },

  // ── Lado direito ──
  sideRight: {
    background: "#111827",
    flex: 1,                     // ocupa o restante do espaço disponível
    padding: "3rem 2.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  formTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 4,
  },
  formSubtitle: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: "1.5rem",
  },

  // ── Seletor de perfil ──
  roleSelector: {
    display: "flex",
    gap: 12,
    marginBottom: "1rem",
  },
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
    transition: "all 0.15s",
    border: "1.5px solid transparent",
  },
  roleBtnActive: {
    background: "#374151",
    borderColor: "#7c3aed",      // borda roxa quando selecionado
    color: "#fff",
  },
  roleBtnInactive: {
    background: "transparent",
    borderColor: "#374151",
    color: "#9ca3af",
  },
  roleIcon: { fontSize: 18 },
  roleDesc: {
    color: "#6b7280",
    fontSize: 12,
    textAlign: "center",
    marginBottom: "1.5rem",
  },

  // ── Campos do formulário ──
  fieldGroup: { marginBottom: "1rem" },
  fieldLabel: {
    color: "#d1d5db",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 6,
    display: "block",
  },
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

  // Container da senha (position relative para posicionar o ícone do olho)
  pwWrap: { position: "relative" },
  pwToggle: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",  // centraliza verticalmente
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
    fontSize: 16,
  },

  // ── Botão de submit e link de login ──
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
  loginLink: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 13,
    marginTop: "1rem",
  },
  loginAnchor: {
    color: "#7c3aed",
    textDecoration: "none",
  },
};