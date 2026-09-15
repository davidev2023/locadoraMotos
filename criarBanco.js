
// ============================================================
// criarBanco.js
// LOCADORA DE MOTOS
// ============================================================

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// ============================================================
// CONFIGURAÇÃO FIREBASE
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyBEWdkn1-Sg5-3j2PtIvHIFGQ3Ae1dBpjM",
  authDomain: "locadora-motos01.firebaseapp.com",
  projectId: "locadora-motos01",
  storageBucket: "locadora-motos01.firebasestorage.app",
  messagingSenderId: "661789704863",
  appId: "1:661789704863:web:d8048a9de4f35ee179d8aa",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ============================================================
// UID DO USUÁRIO NO FIREBASE AUTHENTICATION
// ============================================================

const UID = "TEDfFc3AGrWPHGYFu1CLDpGZ2bW2";

// ============================================================
// DADOS DO CLIENTE
// ============================================================

const usuario = {
  nome: "Davi",

  sobrenome: "Silva",

  // COLOQUE AQUI O MESMO E-MAIL DO FIREBASE AUTH
  email: "davi.teste@gmail.com",

  telefone: "(62) 99999-0001",

  cpf: "111.111.111-01",
};

// ============================================================
// CRIAR BANCO
// ============================================================

async function criarBanco() {
  console.log("");
  console.log("================================================");
  console.log("       LOCADORA DE MOTOS - FIRESTORE");
  console.log("================================================");
  console.log("");

  try {
    // ========================================================
    // USUÁRIO
    //
    // usuarios/{UID}
    // ========================================================

    const usuarioRef = doc(
      db,
      "usuarios",
      UID
    );

    await setDoc(usuarioRef, {
      uid: UID,

      nome: usuario.nome,

      sobrenome: usuario.sobrenome,

      nomeCompleto:
        `${usuario.nome} ${usuario.sobrenome}`,

      email: usuario.email,

      telefone: usuario.telefone,

      cpf: usuario.cpf,

      tipo: "cliente",

      ativo: true,

      fotoPerfil: "",

      endereco: {
        rua: "",

        numero: "",

        bairro: "",

        cidade: "Inhumas",

        estado: "GO",

        cep: "",
      },

      configuracoes: {
        notificacoes: true,
      },

      criadoEm: serverTimestamp(),
    });

    console.log("✓ Usuário criado");
    console.log(`✓ UID: ${UID}`);

    // ========================================================
    // ALUGUEL
    //
    // usuarios/{UID}/alugueis/aluguel_01
    // ========================================================

    const aluguelRef = doc(
      db,
      "usuarios",
      UID,
      "alugueis",
      "aluguel_01"
    );

    await setDoc(aluguelRef, {
      status: "alugado",

      clienteId: UID,

      clienteNome:
        `${usuario.nome} ${usuario.sobrenome}`,

      moto: {
        id: "moto_01",

        modelo: "Honda CG 160",

        placa: "ABC-1234",

        ano: 2025,

        cor: "Preta",
      },

      contrato: {
        inicio: "29/08/2026",

        fim: "29/11/2026",

        duracaoMeses: 3,

        fotos: [],
      },

      pagamento: {
        valor: 350,

        periodo: "semanal",

        jurosPorDia: 10,

        proximoVencimento: "05/09/2026",

        historico: [
          {
            id: "pagamento_01",

            descricao: "Primeira semana",

            data: "29/08/2026",

            valor: 350,

            status: "pendente",
          },
        ],
      },

      criadoEm: serverTimestamp(),
    });

    console.log("✓ Aluguel criado");

    // ========================================================
    // VISTORIA 30/08/2026
    //
    // usuarios/{UID}/vistorias/2026-08-30
    // ========================================================

    const vistoriaAtualRef = doc(
      db,
      "usuarios",
      UID,
      "vistorias",
      "2026-08-30"
    );

    await setDoc(vistoriaAtualRef, {
      id: "2026-08-30",

      aluguelId: "aluguel_01",

      usuarioId: UID,

      dataVistoria: "30/08/2026",

      status: "pendente",

      aprovada: false,

      rejeitada: false,

      motivoRejeicao: "",

      // ======================================================
      // AS FOTOS COMEÇAM VAZIAS.
      //
      // O APP NÃO ENVIA IMEDIATAMENTE PARA O CLOUDINARY.
      //
      // Depois das 8 fotos:
      //
      // 1. usuário tira as fotos
      // 2. ficam temporariamente no aparelho
      // 3. usuário clica em enviar
      // 4. fotos vão para Cloudinary
      // 5. URLs são salvas aqui
      // ======================================================

      fotos: {
        lateralEsquerda: "",

        lateralDireita: "",

        frente: "",

        traseira: "",

        pneuDianteiro: "",

        pneuTraseiro: "",

        painelKm: "",

        tripOleo: "",
      },

      enviadaEm: null,

      analisadaEm: null,

      adminId: "",

      criadoEm: serverTimestamp(),
    });

    console.log("✓ Vistoria 30/08/2026 criada");

    // ========================================================
    // PRÓXIMA VISTORIA
    //
    // usuarios/{UID}/vistorias/2026-09-06
    // ========================================================

    const proximaVistoriaRef = doc(
      db,
      "usuarios",
      UID,
      "vistorias",
      "2026-09-06"
    );

    await setDoc(proximaVistoriaRef, {
      id: "2026-09-06",

      aluguelId: "aluguel_01",

      usuarioId: UID,

      dataVistoria: "06/09/2026",

      status: "pendente",

      aprovada: false,

      rejeitada: false,

      motivoRejeicao: "",

      fotos: {
        lateralEsquerda: "",

        lateralDireita: "",

        frente: "",

        traseira: "",

        pneuDianteiro: "",

        pneuTraseiro: "",

        painelKm: "",

        tripOleo: "",
      },

      enviadaEm: null,

      analisadaEm: null,

      adminId: "",

      criadoEm: serverTimestamp(),
    });

    console.log("✓ Vistoria 06/09/2026 criada");

    // ========================================================
    // NOTIFICAÇÃO
    //
    // usuarios/{UID}/notificacoes/notificacao_01
    // ========================================================

    const notificacaoRef = doc(
      db,
      "usuarios",
      UID,
      "notificacoes",
      "notificacao_01"
    );

    await setDoc(notificacaoRef, {
      titulo: "Bem-vindo!",

      mensagem:
        "Seu cadastro foi realizado com sucesso.",

      tipo: "sistema",

      lida: false,

      criadoEm: serverTimestamp(),
    });

    console.log("✓ Notificação criada");

    // ========================================================
    // FINAL
    // ========================================================

    console.log("");
    console.log("================================================");
    console.log("          BANCO CRIADO COM SUCESSO!");
    console.log("================================================");
    console.log("");

    console.log("USUÁRIO:");
    console.log(`UID: ${UID}`);
    console.log(`Nome: ${usuario.nomeCompleto}`);
    console.log(`E-mail: ${usuario.email}`);

    console.log("");

    console.log("ESTRUTURA:");

    console.log(`
usuarios
└── ${UID}
    ├── nome
    ├── sobrenome
    ├── email
    ├── telefone
    ├── cpf
    ├── tipo
    ├── ativo
    │
    ├── alugueis
    │   └── aluguel_01
    │       ├── status
    │       ├── moto
    │       ├── contrato
    │       └── pagamento
    │
    ├── vistorias
    │   ├── 2026-08-30
    │   │   ├── dataVistoria
    │   │   ├── status
    │   │   ├── aprovada
    │   │   ├── rejeitada
    │   │   ├── motivoRejeicao
    │   │   └── fotos
    │   │
    │   └── 2026-09-06
    │       ├── dataVistoria
    │       ├── status
    │       ├── aprovada
    │       ├── rejeitada
    │       ├── motivoRejeicao
    │       └── fotos
    │
    └── notificacoes
        └── notificacao_01
`);

    console.log("================================================");
    console.log("");
    console.log("PRONTO!");
    console.log("");
  } catch (error) {
    console.log("");
    console.log("================================================");
    console.log("              ERRO AO CRIAR BANCO");
    console.log("================================================");
    console.log("");

    console.error(error);

    console.log("");
  }
}

// ============================================================
// EXECUTAR
// ============================================================

criarBanco();
