
import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { PaperProvider } from "react-native-paper";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../services/firebaseConfig";


// ============================================================
// UID DO USUÁRIO
// ============================================================

const UID = "TEDfFc3AGrWPHGYFu1CLDpGZ2bW2";


// ============================================================
// PIX SCREEN
// ============================================================

export default function PixScreen({ navigation, route }) {

  // ==========================================================
  // ID DO ALUGUEL RECEBIDO DA TELA ANTERIOR
  // ==========================================================

  const aluguelId =
    route?.params?.aluguelId || "aluguel_01";


  // ==========================================================
  // ESTADOS
  // ==========================================================

  const [aluguel, setAluguel] =
    useState(null);

  const [carregando, setCarregando] =
    useState(true);


  // ==========================================================
  // CARREGAR ALUGUEL
  // ==========================================================

  useEffect(() => {

    async function carregarAluguel() {

      try {

        setCarregando(true);


        console.log("");
        console.log("====================================");
        console.log("CARREGANDO PAGAMENTO");
        console.log("====================================");

        console.log("UID:", UID);

        console.log(
          "Aluguel:",
          aluguelId
        );


        // ====================================================
        // CAMINHO CORRETO DO SEU FIRESTORE
        //
        // usuarios/{UID}/alugueis/{aluguelId}
        // ====================================================

        const aluguelRef = doc(
          db,
          "usuarios",
          UID,
          "alugueis",
          aluguelId
        );


        console.log(
          "Caminho:",
          `usuarios/${UID}/alugueis/${aluguelId}`
        );


        const aluguelSnap =
          await getDoc(aluguelRef);


        // ====================================================
        // DOCUMENTO NÃO EXISTE
        // ====================================================

        if (!aluguelSnap.exists()) {

          console.log(
            "Aluguel não encontrado."
          );

          setAluguel(null);

          return;
        }


        // ====================================================
        // DADOS
        // ====================================================

        const dados =
          aluguelSnap.data();


        console.log(
          "Pagamento carregado:",
          dados
        );


        setAluguel(dados);


      } catch (error) {

        console.log(
          "ERRO AO CARREGAR PAGAMENTO:",
          error
        );

        setAluguel(null);

      } finally {

        setCarregando(false);

      }

    }


    carregarAluguel();

  }, [aluguelId]);


  // ==========================================================
  // LOADING
  // ==========================================================

  if (carregando) {

    return (

      <PaperProvider>

        <View style={styles.loadingContainer}>

          <ActivityIndicator
            size="large"
            color="#D39B00"
          />

          <Text style={styles.loadingText}>
            Carregando pagamento...
          </Text>

        </View>

      </PaperProvider>

    );

  }


  // ==========================================================
  // ALUGUEL NÃO ENCONTRADO
  // ==========================================================

  if (!aluguel) {

    return (

      <PaperProvider>

        <View style={styles.errorContainer}>

          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={52}
            color="#D39B00"
          />

          <Text style={styles.errorTitle}>
            Aluguel não encontrado
          </Text>

          <Text style={styles.errorText}>
            Não foi possível carregar os dados
            do pagamento.
          </Text>


          <TouchableOpacity
            style={styles.backButtonError}
            activeOpacity={0.8}
            onPress={() =>
              navigation.goBack()
            }
          >

            <Text style={styles.backButtonErrorText}>
              Voltar
            </Text>

          </TouchableOpacity>

        </View>

      </PaperProvider>

    );

  }


  // ==========================================================
  // DADOS DO PAGAMENTO
  // ==========================================================

  const pagamento =
    aluguel?.pagamento || {};


  const valorOriginal =
    Number(
      pagamento?.valor || 0
    );


  const jurosPorDia =
    Number(
      pagamento?.jurosPorDia || 0
    );


  const vencimento =
    pagamento?.proximoVencimento || "";


  // ==========================================================
  // CALCULAR DIAS DE ATRASO
  // ==========================================================

  function calcularDiasAtraso(
    dataString
  ) {

    if (!dataString) {
      return 0;
    }


    try {

      const partes =
        String(dataString).split("/");


      if (partes.length !== 3) {
        return 0;
      }


      const dia =
        Number(partes[0]);


      const mes =
        Number(partes[1]) - 1;


      const ano =
        Number(partes[2]);


      if (
        !dia ||
        mes < 0 ||
        !ano
      ) {

        return 0;

      }


      const dataVencimento =
        new Date(
          ano,
          mes,
          dia
        );


      const hoje =
        new Date();


      dataVencimento.setHours(
        0,
        0,
        0,
        0
      );


      hoje.setHours(
        0,
        0,
        0,
        0
      );


      const diferenca =
        hoje.getTime() -
        dataVencimento.getTime();


      const dias =
        Math.floor(
          diferenca /
          (1000 * 60 * 60 * 24)
        );


      return dias > 0
        ? dias
        : 0;


    } catch (error) {

      console.log(
        "Erro ao calcular atraso:",
        error
      );

      return 0;

    }

  }


  // ==========================================================
  // ATRASO
  // ==========================================================

  const diasAtraso =
    calcularDiasAtraso(
      vencimento
    );


  // ==========================================================
  // JUROS
  // ==========================================================

  const jurosAtual =
    diasAtraso *
    jurosPorDia;


  // ==========================================================
  // TOTAL
  // ==========================================================

  const total =
    valorOriginal +
    jurosAtual;


  // ==========================================================
  // FORMATAR DINHEIRO
  // ==========================================================

  function formatarValor(valor) {

    return Number(
      valor || 0
    )
      .toFixed(2)
      .replace(".", ",");

  }


  // ==========================================================
  // GERAR PIX
  // ==========================================================

  function gerarPix() {

    console.log("");
    console.log(
      "===================================="
    );

    console.log(
      "SOLICITAR PAGAMENTO PIX"
    );

    console.log(
      "Aluguel:",
      aluguelId
    );

    console.log(
      "Valor:",
      total
    );

    console.log(
      "===================================="
    );


    /*
      IMPORTANTE:

      Aqui ainda NÃO estamos criando um PIX real.

      Para criar um PIX real será necessário
      conectar o aplicativo a um gateway de
      pagamento, por exemplo:

      - Mercado Pago
      - Asaas
      - Efí

      A chave secreta NÃO deve ficar dentro
      deste aplicativo React Native.

      O correto será:

      APP
       ↓
      BACKEND / CLOUD FUNCTION
       ↓
      GATEWAY PIX
       ↓
      QR CODE
       ↓
      CLIENTE
    */


    Alert.alert(
      "PIX",
      `Valor para pagamento: R$ ${formatarValor(total)}`
    );

  }


  // ==========================================================
  // TELA
  // ==========================================================

  return (

    <PaperProvider>

      <View style={styles.container}>

        <StatusBar style="dark" />


        {/* ==================================================
            HEADER
        ================================================== */}

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() =>
              navigation.goBack()
            }
          >

            <MaterialCommunityIcons
              name="arrow-left"
              size={25}
              color="#171717"
            />

          </TouchableOpacity>


          <Text style={styles.headerTitle}>
            Pagamento
          </Text>


          <View style={styles.headerSpace} />

        </View>


        {/* ==================================================
            CONTEÚDO
        ================================================== */}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
        >


          {/* ==================================================
              ÍCONE PIX
          ================================================== */}

          <View style={styles.pixIconContainer}>

            <MaterialCommunityIcons
              name="qrcode"
              size={42}
              color="#D39B00"
            />

          </View>


          <Text style={styles.title}>
            Pagamento via PIX
          </Text>


          <Text style={styles.subtitle}>
            Confira os valores antes de realizar
            o pagamento.
          </Text>


          {/* ==================================================
              CARD
          ================================================== */}

          <View style={styles.paymentCard}>


            {/* VALOR */}

            <View style={styles.row}>

              <View style={styles.rowLeft}>

                <View style={styles.smallIcon}>

                  <MaterialCommunityIcons
                    name="calendar-check-outline"
                    size={20}
                    color="#D39B00"
                  />

                </View>


                <Text style={styles.label}>
                  Valor do aluguel
                </Text>

              </View>


              <Text style={styles.value}>
                R$ {formatarValor(valorOriginal)}
              </Text>

            </View>


            <View style={styles.divider} />


            {/* VENCIMENTO */}

            <View style={styles.row}>

              <View style={styles.rowLeft}>

                <View style={styles.smallIcon}>

                  <MaterialCommunityIcons
                    name="calendar-clock-outline"
                    size={20}
                    color="#D39B00"
                  />

                </View>


                <Text style={styles.label}>
                  Vencimento
                </Text>

              </View>


              <Text style={styles.value}>
                {vencimento ||
                  "--/--/----"}
              </Text>

            </View>


            <View style={styles.divider} />


            {/* ATRASO */}

            <View style={styles.row}>

              <View style={styles.rowLeft}>

                <View style={styles.smallIcon}>

                  <MaterialCommunityIcons
                    name="clock-alert-outline"
                    size={20}
                    color={
                      diasAtraso > 0
                        ? "#E5A900"
                        : "#35A65A"
                    }
                  />

                </View>


                <Text style={styles.label}>
                  Dias de atraso
                </Text>

              </View>


              <Text
                style={[
                  styles.value,
                  diasAtraso > 0 &&
                    styles.warningValue,
                ]}
              >

                {diasAtraso}{" "}

                {diasAtraso === 1
                  ? "dia"
                  : "dias"}

              </Text>

            </View>


            <View style={styles.divider} />


            {/* JUROS */}

            <View style={styles.row}>

              <View style={styles.rowLeft}>

                <View style={styles.smallIcon}>

                  <MaterialCommunityIcons
                    name="cash-plus"
                    size={20}
                    color="#D39B00"
                  />

                </View>


                <View>

                  <Text style={styles.label}>
                    Juros por atraso
                  </Text>


                  <Text style={styles.subLabel}>
                    R${" "}
                    {formatarValor(
                      jurosPorDia
                    )}{" "}
                    por dia
                  </Text>

                </View>

              </View>


              <Text
                style={[
                  styles.value,
                  diasAtraso > 0 &&
                    styles.warningValue,
                ]}
              >

                R${" "}
                {formatarValor(
                  jurosAtual
                )}

              </Text>

            </View>


            <View style={styles.totalDivider} />


            {/* TOTAL */}

            <View style={styles.totalRow}>

              <Text style={styles.totalLabel}>
                Total a pagar
              </Text>


              <Text style={styles.totalValue}>
                R${" "}
                {formatarValor(total)}
              </Text>

            </View>

          </View>


          {/* ==================================================
              AVISO DE ATRASO
          ================================================== */}

          {diasAtraso > 0 && (

            <View style={styles.warningCard}>

              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={22}
                color="#D39B00"
              />


              <Text style={styles.warningText}>

                Este pagamento possui{" "}

                <Text style={styles.bold}>

                  {diasAtraso}{" "}

                  {diasAtraso === 1
                    ? "dia"
                    : "dias"}

                </Text>{" "}

                de atraso, acrescentando{" "}

                <Text style={styles.bold}>

                  R${" "}
                  {formatarValor(
                    jurosAtual
                  )}

                </Text>{" "}
                ao valor original.

              </Text>

            </View>

          )}


          {/* ==================================================
              BOTÃO PIX
          ================================================== */}

          <TouchableOpacity
            style={styles.pixButton}
            activeOpacity={0.8}
            onPress={gerarPix}
          >

            <MaterialCommunityIcons
              name="qrcode"
              size={23}
              color="#FFFFFF"
            />


            <Text style={styles.pixButtonText}>
              Gerar pagamento PIX
            </Text>

          </TouchableOpacity>


          {/* ==================================================
              SEGURANÇA
          ================================================== */}

          <View style={styles.secureContainer}>

            <MaterialCommunityIcons
              name="shield-check-outline"
              size={18}
              color="#35A65A"
            />


            <Text style={styles.secureText}>
              Pagamento seguro
            </Text>

          </View>


        </ScrollView>

      </View>

    </PaperProvider>

  );

}


// =============================================================
// ESTILOS
// =============================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#E7EAE4",
  },


  loadingContainer: {
    flex: 1,
    backgroundColor: "#E7EAE4",
    alignItems: "center",
    justifyContent: "center",
  },


  loadingText: {
    marginTop: 12,
    color: "#777",
    fontSize: 14,
  },


  errorContainer: {
    flex: 1,
    backgroundColor: "#E7EAE4",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },


  errorTitle: {
    marginTop: 15,
    color: "#222",
    fontSize: 19,
    fontWeight: "800",
  },


  errorText: {
    color: "#888",
    fontSize: 13,
    textAlign: "center",
    marginTop: 7,
  },


  backButtonError: {
    marginTop: 20,
    backgroundColor: "#FFCC00",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },


  backButtonErrorText: {
    color: "#171717",
    fontSize: 14,
    fontWeight: "800",
  },


  header: {
    width: "100%",
    height: 105,
    backgroundColor: "#FBFBFB",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 14,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 4,
  },


  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F0F1EE",
    alignItems: "center",
    justifyContent: "center",
  },


  headerTitle: {
    color: "#171717",
    fontSize: 19,
    fontWeight: "700",
  },


  headerSpace: {
    width: 42,
  },


  scrollView: {
    flex: 1,
  },


  scrollContent: {
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 50,
  },


  pixIconContainer: {
    width: 75,
    height: 75,
    borderRadius: 22,
    backgroundColor: "#FFF6D8",
    alignItems: "center",
    justifyContent: "center",
  },


  title: {
    marginTop: 14,
    color: "#171717",
    fontSize: 24,
    fontWeight: "800",
  },


  subtitle: {
    width: "85%",
    textAlign: "center",
    color: "#888",
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
  },


  paymentCard: {
    width: "92%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    marginTop: 22,

    elevation: 4,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,
    shadowRadius: 8,
  },


  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 45,
  },


  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },


  smallIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF6D8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },


  label: {
    color: "#555",
    fontSize: 13,
    fontWeight: "600",
  },


  subLabel: {
    color: "#999",
    fontSize: 10,
    marginTop: 2,
  },


  value: {
    color: "#222",
    fontSize: 14,
    fontWeight: "700",
  },


  warningValue: {
    color: "#D39B00",
  },


  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 7,
  },


  totalDivider: {
    height: 1,
    backgroundColor: "#DDDDDD",
    marginTop: 13,
    marginBottom: 15,
  },


  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },


  totalLabel: {
    color: "#222",
    fontSize: 16,
    fontWeight: "800",
  },


  totalValue: {
    color: "#D39B00",
    fontSize: 22,
    fontWeight: "900",
  },


  warningCard: {
    width: "92%",
    backgroundColor: "#FFF8E3",
    borderRadius: 13,
    padding: 13,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },


  warningText: {
    flex: 1,
    marginLeft: 9,
    color: "#806C3C",
    fontSize: 11,
    lineHeight: 17,
  },


  bold: {
    fontWeight: "800",
  },


  pixButton: {
    width: "92%",
    height: 52,
    backgroundColor: "#35A65A",
    borderRadius: 12,
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },


  pixButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },


  secureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 6,
  },


  secureText: {
    color: "#777",
    fontSize: 11,
  },

});

