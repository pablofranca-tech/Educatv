// =============================================================
// Quiz EducaTV Campinas
// =============================================================

const perguntas = [
  {
    pergunta: "O que significa a sigla \"TV\" em EducaTV?",
    opcoes: ["Televisão Comercial", "Televisão Educativa", "Transmissão Virtual", "Tecnologia Visual"],
    correta: 1
  },
  {
    pergunta: "A EducaTV Campinas integra qual órgão da Prefeitura Municipal de Campinas?",
    opcoes: ["Secretaria Municipal de Cultura e Turismo", "Secretaria Municipal de Educação de Campinas", "Secretaria Municipal de Comunicação", "Secretaria Municipal de Desenvolvimento e Assistência Social"],
    correta: 1
  },
  {
    pergunta: "Como a EducaTV Campinas se caracteriza?",
    opcoes: ["TV comercial", "Streaming privado", "Como uma emissora pública de caráter educativo", "Canal de entretenimento"],
    correta: 2
  },
  {
    pergunta: "Qual é um dos principais compromissos da EducaTV Campinas?",
    opcoes: ["Vender produtos", "Democratizar o acesso ao conhecimento e a conteúdos educativos", "Aumentar audiência de novelas", "Transmitir jogos de futebol"],
    correta: 1
  },
  {
    pergunta: "Onde você pode acompanhar os conteúdos da EducaTV?",
    opcoes: [
      "No canal 12.2 da TV aberta",
      "No YouTube",
      "Na plataforma de streaming EducaFlix",
      "Todas as alternativas anteriores"
    ],
    correta: 3
  }
];

const LETRAS = ["A", "B", "C", "D", "E"];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quiz");
  const botaoEnviar = form.querySelector(".botao-principal");
  const resultado = document.getElementById("resultado");
  const blocoProgresso = document.getElementById("progresso");
  const barra = document.getElementById("progresso-barra");
  const rotulo = document.getElementById("progresso-rotulo");
  const pct = document.getElementById("progresso-pct");

  // ---------- monta as perguntas ----------
  perguntas.forEach((p, i) => {
    const bloco = document.createElement("fieldset");
    bloco.className = "pergunta";
    bloco.id = `pergunta-${i}`;

    const legenda = document.createElement("legend");
    legenda.innerHTML = `<span class="pergunta__numero">${i + 1} de ${perguntas.length}</span>`;
    legenda.append(p.pergunta);
    bloco.appendChild(legenda);

    p.opcoes.forEach((texto, j) => {
      const opcao = document.createElement("label");
      opcao.className = "opcao";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${i}`;
      input.value = j;

      const letra = document.createElement("span");
      letra.className = "opcao__letra";
      letra.textContent = LETRAS[j];
      letra.setAttribute("aria-hidden", "true");

      opcao.append(input, letra, document.createTextNode(texto));
      bloco.appendChild(opcao);
    });

    form.insertBefore(bloco, botaoEnviar);
  });

  // ---------- progresso ----------
  function respondidas() {
    return perguntas.filter((_, i) => form.querySelector(`input[name="q${i}"]:checked`)).length;
  }

  function atualizarProgresso() {
    const n = respondidas();
    const porcento = Math.round((n / perguntas.length) * 100);
    barra.style.width = porcento + "%";
    rotulo.textContent = `${n} de ${perguntas.length} respondidas`;
    pct.textContent = porcento + "%";
  }

  form.addEventListener("change", (e) => {
    if (e.target.type === "radio") {
      e.target.closest(".pergunta").classList.remove("faltando");
      const aviso = form.querySelector(".aviso");
      if (aviso && respondidas() === perguntas.length) aviso.remove();
      atualizarProgresso();
    }
  });

  atualizarProgresso();

  // ---------- enviar ----------
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const faltantes = [];
    perguntas.forEach((_, i) => {
      const bloco = document.getElementById(`pergunta-${i}`);
      const marcada = form.querySelector(`input[name="q${i}"]:checked`);
      bloco.classList.toggle("faltando", !marcada);
      if (!marcada) faltantes.push(bloco);
    });

    if (faltantes.length > 0) {
      let aviso = form.querySelector(".aviso");
      if (!aviso) {
        aviso = document.createElement("p");
        aviso.className = "aviso";
        aviso.setAttribute("role", "alert");
        botaoEnviar.insertAdjacentElement("beforebegin", aviso);
      }
      aviso.textContent = faltantes.length === 1
        ? "Falta responder 1 pergunta, destacada acima."
        : `Faltam responder ${faltantes.length} perguntas, destacadas acima.`;
      faltantes[0].scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    mostrarResultado();
  });

  // ---------- resultado ----------
  function mostrarResultado() {
    let acertos = 0;
    const lista = document.getElementById("gabarito-lista");
    lista.innerHTML = "";

    perguntas.forEach((p, i) => {
      const escolha = parseInt(form.querySelector(`input[name="q${i}"]:checked`).value, 10);
      const acertou = escolha === p.correta;
      if (acertou) acertos++;

      const item = document.createElement("li");
      item.className = acertou ? "certo" : "errado";
      const marca = document.createElement("span");
      marca.className = "marca";
      marca.textContent = acertou ? "✓" : "✗";
      const texto = document.createElement("span");
      texto.textContent = acertou
        ? p.pergunta
        : `${p.pergunta} — resposta certa: ${p.opcoes[p.correta]}`;
      item.append(marca, texto);
      lista.appendChild(item);
    });

    const titulos = {
      5: "Você é fã da EducaTV!",
      4: "Quase tudo certo!",
      3: "Mandou bem!",
      2: "Bom começo!",
      1: "Bom começo!",
      0: "Bora conhecer melhor?"
    };

    const textos = {
      alto: "Você conhece bem a TV educativa de Campinas. Compartilhe o quiz com a turma.",
      medio: "Você já sabe o essencial. Os vídeos do canal ajudam a completar o resto.",
      baixo: "Dá uma olhada nos conteúdos da EducaTV e tente de novo — é rapidinho."
    };

    document.getElementById("placar-numero").textContent = acertos;
    document.querySelector(".placar").style.setProperty("--fatia", (acertos / perguntas.length) * 360 + "deg");
    document.getElementById("resultado-titulo").textContent = titulos[acertos];
    document.getElementById("resultado-texto").textContent =
      acertos >= 4 ? textos.alto : acertos >= 2 ? textos.medio : textos.baixo;

    form.classList.add("escondido");
    blocoProgresso.classList.add("escondido");
    resultado.classList.remove("escondido");
    resultado.focus();
    resultado.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- refazer ----------
  document.getElementById("btn-refazer").addEventListener("click", () => {
    form.reset();
    form.querySelectorAll(".faltando").forEach((b) => b.classList.remove("faltando"));
    const aviso = form.querySelector(".aviso");
    if (aviso) aviso.remove();
    resultado.classList.add("escondido");
    form.classList.remove("escondido");
    blocoProgresso.classList.remove("escondido");
    atualizarProgresso();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});