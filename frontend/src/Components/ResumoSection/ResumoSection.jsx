import { useState } from "react";
import { Plus, X } from "lucide-react"; // ou a biblioteca de ícones que usar

export default function ResumeSection({ resumeUrl }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Transforma a URL do PDF em Imagem para o HTML conseguir exibir na tag <img>
  const resumeAsImageUrl = resumeUrl ? resumeUrl.replace(/\.pdf$/, ".jpg") : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        {resumeUrl
          ? "Currículo enviado e visível para recrutadores."
          : "Envie seu CV em PDF para recrutadores visualizarem seu perfil."}
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {/* MINIATURA DO CURRÍCULO (SÓ APARECE SE TIVER URL) */}
        {resumeAsImageUrl && (
          <div 
            onClick={() => setIsModalOpen(true)}
            style={{ 
              cursor: "pointer", 
              border: "1px solid #ccc", 
              borderRadius: "4px", 
              overflow: "hidden",
              width: "80px",
              height: "110px",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            <img 
              src={resumeAsImageUrl} 
              alt="Preview do Currículo" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        <button onClick={() => document.getElementById("resume-input").click()}>
          <Plus size={14} />
          {resumeUrl ? "Atualizar" : "Upload"}
        </button>
      </div>

      {/* MODAL / OVERLAY PARA EXPANDIR A IMAGEM */}
      {isModalOpen && resumeAsImageUrl && (
        <div 
          onClick={() => setIsModalOpen(false)} // Fecha ao clicar fora
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "zoom-out"
          }}
        >
          {/* Botão de fechar */}
          <button 
            onClick={() => setIsModalOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "#ff4d4d",
              color: "#fff",
              border: "none",
              padding: "10px",
              borderRadius: "50%",
              cursor: "pointer"
            }}
          >
            <X size={20} />
          </button>

          {/* Imagem do Currículo Expandida */}
          <img 
            src={resumeAsImageUrl} 
            alt="Currículo Expandido" 
            onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar na imagem em si
            style={{ 
              maxHeight: "90vh", 
              maxWidth: "90vw", 
              borderRadius: "8px",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.5)",
              cursor: "default"
            }}
          />
        </div>
      )}
    </div>
  );
}