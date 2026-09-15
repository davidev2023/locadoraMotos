import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import {
  db,
  auth,
} from "../services/firebaseConfig";

export default function RentalDetails({ navigation }) {

  // =========================================================
  // ESTADOS
  // =========================================================

  const [aluguel, setAluguel] = useState(null);

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState(false);


  // =========================================================
  // CARREGAR ALUGUEL DO USUÁRIO LOGADO
  // =========================================================

  useEffect(() => {

    let cancelado = false;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (usuario) => {

        if (cancelado) {
          return;
        }

        try {

          setCarregando(true);
          setErro(false);

          // ==================================================
          // VERIFICAR USUÁRIO
          // ==================================================

          if (!usuario) {

            console.log(
              "RentalDetails: nenhum usuário logado."
            );

            setErro(true);
            setCarregando(false);

            return;
          }

          const uid = usuario.uid;

          console.log(
            "================================="
          );

          console.log(
            "RentalDetails"
          );

          console.log(
            "Usuário logado:",
            uid
          );

          console.log(
            "================================="
          );


          // ==================================================
          // CAMINHO CORRETO
          //
          // usuarios/{UID}/alugueis/aluguel_01
          // ==================================================

          const aluguelRef = doc(
            db,
            "usuarios",
            uid,
            "alugueis",
            "aluguel_01"
          );


          console.log(
            "Buscando aluguel em:"
          );

          console.log(
            `usuarios/${uid}/alugueis/aluguel_01`
          );


          const aluguelSnap =
            await getDoc(aluguelRef);


          // ==================================================
          // VERIFICAR DOCUMENTO
          // ==================================================

          if (aluguelSnap.exists()) {

            const dados =
              aluguelSnap.data();

            console.log(
              "✓ ALUGUEL ENCONTRADO:"
            );

            console.log(
              dados
            );

            if (!cancelado) {
              setAluguel(dados);
            }

          } else {

            console.log(
              "✗ Aluguel aluguel_01 não encontrado."
            );

            console.log(
              "Caminho procurado:",
              `usuarios/${uid}/alugueis/aluguel_01`
            );

            if (!cancelado) {
              setErro(true);
            }

          }

        } catch (error) {

          console.log(
            "================================="
          );

          console.log(
            "ERRO AO CARREGAR ALUGUEL:"
          );

          console.log(
            error
          );

          console.log(
            "================================="
          );

          if (!cancelado) {
            setErro(true);
          }

        } finally {

          if (!cancelado) {
            setCarregando(false);
          }

        }

      }
    );


    return () => {

      cancelado = true;

      unsubscribe();

    };

  }, []);


  // =========================================================
  // LOADING
  // =========================================================

  if (carregando) {

    return (

      <View style={styles.loadingContainer}>

        <StatusBar style="dark" />

        <ActivityIndicator
          size="large"
          color="#D39B00"
        />

        <Text style={styles.loadingText}>
          Carregando aluguel...
        </Text>

      </View>

    );

  }


  // =========================================================
  // ERRO
  // =========================================================

  if (erro || !aluguel) {

    return (

      <View style={styles.errorContainer}>

        <StatusBar style="dark" />

        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={50}
          color="#D39B00"
        />

        <Text style={styles.errorTitle}>
          Aluguel não encontrado
        </Text>

        <Text style={styles.errorText}>
          Não foi possível carregar os dados do seu aluguel.
        </Text>

        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => navigation.goBack()}
        >

          <Text style={styles.errorButtonText}>
            Voltar
          </Text>

        </TouchableOpacity>

      </View>

    );

  }


  // =========================================================
  // DADOS DO ALUGUEL
  // =========================================================

  const modeloMoto =
    aluguel?.moto?.modelo ||
    "Moto não informada";


  const placaMoto =
    aluguel?.moto?.placa ||
    "Sem placa";


  const statusAluguel =
    aluguel?.status ||
    "alugado";


  const duracaoContrato =
    Number(
      aluguel?.contrato?.duracaoMeses
    ) || 0;


  const dataInicio =
    aluguel?.contrato?.inicio ||
    "--/--/----";


  const dataDevolucao =
    aluguel?.contrato?.fim ||
    "--/--/----";


  const valorAluguel =
    Number(
      aluguel?.pagamento?.valor
    ) || 0;


  const periodoPagamento =
    aluguel?.pagamento?.periodo ||
    "semanal";


  const proximoVencimento =
    aluguel?.pagamento?.proximoVencimento ||
    "";


  const jurosPorDia =
    Number(
      aluguel?.pagamento?.jurosPorDia
    ) || 0;


  // =========================================================
  // FOTOS DO CONTRATO
  // =========================================================

  const fotosContrato =
    Array.isArray(
      aluguel?.contrato?.fotos
    )
      ? aluguel.contrato.fotos
      : [];


  // =========================================================
  // HISTÓRICO
  // =========================================================

  const historicoPagamentos =
    Array.isArray(
      aluguel?.pagamento?.historico
    )
      ? aluguel.pagamento.historico
      : [];


  // =========================================================
  // CALCULAR ATRASO
  // =========================================================

  function calcularDiasAtraso(
    dataString
  ) {

    if (!dataString) {
      return 0;
    }

    try {

      const partes =
        dataString.split("/");


      if (partes.length !== 3) {
        return 0;
      }


      const dia =
        Number(partes[0]);


      const mes =
        Number(partes[1]) - 1;


      const ano =
        Number(partes[2]);


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


  const diasAtraso =
    calcularDiasAtraso(
      proximoVencimento
    );


  // =========================================================
  // JUROS
  // =========================================================

  const jurosAtual =
    diasAtraso *
    jurosPorDia;


  // =========================================================
  // VALOR ATUAL
  // =========================================================

  const valorPagamentoAtual =
    valorAluguel +
    jurosAtual;


  // =========================================================
  // FORMATAR DINHEIRO
  // =========================================================

  function formatarValor(valor) {

    return Number(
      valor || 0
    )
      .toFixed(2)
      .replace(".", ",");

  }


  // =========================================================
  // PERÍODO
  // =========================================================

  function formatarPeriodo(periodo) {

    if (periodo === "semanal") {
      return "Semanal";
    }

    if (periodo === "mensal") {
      return "Mensal";
    }

    if (periodo === "diario") {
      return "Diário";
    }

    return periodo ||
      "Não informado";

  }


  // =========================================================
  // STATUS
  // =========================================================

  const statusTexto =
    statusAluguel === "alugado"
      ? "Alugada"
      : statusAluguel;


  // =========================================================
  // TELA
  // =========================================================

  return (

    <View style={styles.container}>

      <StatusBar style="dark" />


      {/* ==================================================
          HEADER
      ================================================== */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
          activeOpacity={0.7}
        >

          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#171717"
          />

        </TouchableOpacity>


        <Text style={styles.headerTitle}>
          Meu aluguel
        </Text>


        <View style={styles.headerSpace} />

      </View>


      {/* ==================================================
          CONTEÚDO
      ================================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >


        {/* ==================================================
            MOTO
        ================================================== */}

        <View style={styles.card}>

          <View style={styles.cardHeader}>

            <View style={styles.iconBox}>

              <MaterialCommunityIcons
                name="motorbike"
                size={24}
                color="#D39B00"
              />

            </View>


            <View style={styles.motorInfo}>

              <Text style={styles.cardTitle}>
                {modeloMoto}
              </Text>

              <Text style={styles.plate}>
                {placaMoto}
              </Text>

            </View>

          </View>


          <View style={styles.status}>

            <View style={styles.statusDot} />

            <Text style={styles.statusText}>
              {statusTexto}
            </Text>

          </View>

        </View>


        {/* ==================================================
            CONTRATO
        ================================================== */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Contrato
          </Text>


          <View style={styles.infoRow}>

            <View style={styles.infoItem}>

              <Text style={styles.label}>
                Duração
              </Text>

              <Text style={styles.value}>

                {duracaoContrato}{" "}

                {duracaoContrato === 1
                  ? "mês"
                  : "meses"}

              </Text>

            </View>


            <View style={styles.infoItem}>

              <Text style={styles.label}>
                Início
              </Text>

              <Text style={styles.value}>
                {dataInicio}
              </Text>

            </View>

          </View>


          <View style={styles.infoRow}>

            <View style={styles.infoItem}>

              <Text style={styles.label}>
                Devolução
              </Text>

              <Text style={styles.value}>
                {dataDevolucao}
              </Text>

            </View>


            <View style={styles.infoItem}>

              <Text style={styles.label}>
                Valor{" "}
                {formatarPeriodo(
                  periodoPagamento
                ).toLowerCase()}
              </Text>

              <Text style={styles.price}>
                R${" "}
                {formatarValor(
                  valorAluguel
                )}
              </Text>

            </View>

          </View>

        </View>


        {/* ==================================================
            PAGAMENTO
        ================================================== */}

        <View style={styles.card}>

          <View style={styles.sectionHeader}>

            <View style={styles.iconBox}>

              <MaterialCommunityIcons
                name="credit-card-outline"
                size={23}
                color="#D39B00"
              />

            </View>

            <Text style={styles.sectionTitle}>
              Pagamento
            </Text>

          </View>


          <View style={styles.paymentHighlight}>

            <Text style={styles.paymentLabel}>
              Próximo pagamento
            </Text>


            <Text style={styles.paymentValue}>
              R${" "}
              {formatarValor(
                valorPagamentoAtual
              )}
            </Text>


            <Text style={styles.paymentDate}>
              Vencimento:{" "}
              {proximoVencimento ||
                "--/--/----"}
            </Text>


            {diasAtraso > 0 && (

              <Text style={styles.lateText}>

                Atrasado há{" "}
                {diasAtraso}{" "}

                {diasAtraso === 1
                  ? "dia"
                  : "dias"}

                {" • "}Juros: R${" "}

                {formatarValor(
                  jurosAtual
                )}

              </Text>

            )}

          </View>


          <TouchableOpacity
            style={styles.payButton}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate(
                "PixScreen",
                {
                  aluguelId: "aluguel_01",
                }
              )
            }
          >

            <MaterialCommunityIcons
              name="qrcode"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.payButtonText}>
              Pagar agora
            </Text>

          </TouchableOpacity>

        </View>


        {/* ==================================================
            HISTÓRICO
        ================================================== */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Histórico de pagamentos
          </Text>


          {historicoPagamentos.length === 0 ? (

            <View style={styles.emptyHistory}>

              <MaterialCommunityIcons
                name="history"
                size={30}
                color="#B5B5B5"
              />

              <Text
                style={
                  styles.emptyHistoryText
                }
              >
                Nenhum pagamento registrado.
              </Text>

            </View>

          ) : (

            historicoPagamentos.map(
              (pagamento, index) => {

                const status =
                  pagamento?.status ||
                  "pendente";


                const pago =
                  status === "pago";


                return (

                  <React.Fragment
                    key={
                      pagamento?.id ||
                      `${index}-${pagamento?.data || ""}`
                    }
                  >

                    <View
                      style={
                        styles.historyItem
                      }
                    >

                      <View
                        style={
                          pago
                            ? styles.historyIconPaid
                            : styles.historyIconPending
                        }
                      >

                        <MaterialCommunityIcons
                          name={
                            pago
                              ? "check"
                              : "clock-outline"
                          }
                          size={18}
                          color={
                            pago
                              ? "#35A65A"
                              : "#D39B00"
                          }
                        />

                      </View>


                      <View
                        style={
                          styles.historyContent
                        }
                      >

                        <Text
                          style={
                            styles.historyTitle
                          }
                        >
                          {pagamento?.descricao ||
                            `Pagamento ${index + 1}`}
                        </Text>


                        <Text
                          style={
                            styles.historyDate
                          }
                        >
                          {pagamento?.data ||
                            "--/--/----"}
                        </Text>

                      </View>


                      <View
                        style={
                          styles.historyRight
                        }
                      >

                        <Text
                          style={
                            styles.historyValue
                          }
                        >
                          R${" "}
                          {formatarValor(
                            pagamento?.valor ||
                            0
                          )}
                        </Text>


                        <Text
                          style={
                            pago
                              ? styles.paidText
                              : styles.pendingText
                          }
                        >
                          {pago
                            ? "Pago"
                            : "Pendente"}
                        </Text>

                      </View>

                    </View>


                    {index <
                      historicoPagamentos.length - 1 && (

                      <View
                        style={
                          styles.historyDivider
                        }
                      />

                    )}

                  </React.Fragment>

                );

              }
            )

          )}

        </View>


        {/* ==================================================
            CONTRATO
        ================================================== */}

        <TouchableOpacity
          style={styles.optionButton}
          activeOpacity={0.8}
          onPress={() => {

            navigation.navigate(
              "ContractScreen",
              {
                fotos: fotosContrato,
              }
            );

          }}
        >

          <MaterialCommunityIcons
            name="file-document-outline"
            size={22}
            color="#222"
          />


          <View
            style={styles.optionContent}
          >

            <Text
              style={styles.optionText}
            >
              Ver contrato
            </Text>


            <Text
              style={styles.optionSubText}
            >

              {fotosContrato.length > 0
                ? `${fotosContrato.length} ${
                    fotosContrato.length === 1
                      ? "página disponível"
                      : "páginas disponíveis"
                  }`
                : "Nenhuma imagem adicionada"}

            </Text>

          </View>


          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color="#888"
          />

        </TouchableOpacity>


        {/* ==================================================
            VISTORIAS
        ================================================== */}

        <TouchableOpacity
          style={styles.optionButton}
          activeOpacity={0.8}
          onPress={() => {

            navigation.navigate(
              "InspectionScreen",
              {
                aluguelId:
                  "aluguel_01",
              }
            );

          }}
        >

          <MaterialCommunityIcons
            name="clipboard-check-outline"
            size={22}
            color="#222"
          />


          <Text style={styles.optionText}>
            Ver vistorias
          </Text>


          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color="#888"
          />

        </TouchableOpacity>


        {/* ==================================================
            RENOVAR
        ================================================== */}

        <TouchableOpacity
          style={styles.renewButton}
          activeOpacity={0.8}
        >

          <MaterialCommunityIcons
            name="autorenew"
            size={21}
            color="#171717"
          />

          <Text style={styles.renewText}>
            Renovar contrato
          </Text>

        </TouchableOpacity>


      </ScrollView>

    </View>

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


  errorButton: {
    marginTop: 20,
    backgroundColor: "#FFCC00",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },


  errorButtonText: {
    color: "#171717",
    fontSize: 14,
    fontWeight: "800",
  },


  header: {
    height: 90,
    paddingTop: 35,
    paddingHorizontal: 18,
    backgroundColor: "#FBFBFB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
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
    fontSize: 20,
    fontWeight: "700",
    color: "#171717",
  },


  headerSpace: {
    width: 42,
  },


  content: {
    padding: 16,
    paddingBottom: 40,
  },


  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 5,
  },


  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },


  motorInfo: {
    flex: 1,
  },


  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: "#FFF6D8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },


  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },


  plate: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },


  status: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#EAF7ED",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
  },


  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: "#35A65A",
    marginRight: 5,
  },


  statusText: {
    color: "#35A65A",
    fontSize: 12,
    fontWeight: "700",
  },


  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 15,
  },


  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },


  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },


  infoItem: {
    width: "48%",
  },


  label: {
    color: "#999",
    fontSize: 12,
    marginBottom: 4,
  },


  value: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },


  price: {
    color: "#D39B00",
    fontSize: 16,
    fontWeight: "700",
  },


  paymentHighlight: {
    backgroundColor: "#FFF9E7",
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },


  paymentLabel: {
    color: "#888",
    fontSize: 12,
  },


  paymentValue: {
    color: "#222",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },


  paymentDate: {
    color: "#888",
    fontSize: 12,
    marginTop: 3,
  },


  lateText: {
    color: "#D63B32",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
  },


  payButton: {
    height: 46,
    backgroundColor: "#35A65A",
    borderRadius: 10,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },


  payButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },


  emptyHistory: {
    alignItems: "center",
    paddingVertical: 15,
  },


  emptyHistoryText: {
    color: "#999",
    fontSize: 12,
    marginTop: 7,
  },


  historyItem: {
    flexDirection: "row",
    alignItems: "center",
  },


  historyIconPaid: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EAF7ED",
    alignItems: "center",
    justifyContent: "center",
  },


  historyIconPending: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF6D8",
    alignItems: "center",
    justifyContent: "center",
  },


  historyContent: {
    flex: 1,
    marginLeft: 10,
  },


  historyTitle: {
    color: "#222",
    fontSize: 14,
    fontWeight: "700",
  },


  historyDate: {
    color: "#999",
    fontSize: 11,
    marginTop: 2,
  },


  historyRight: {
    alignItems: "flex-end",
  },


  historyValue: {
    color: "#333",
    fontSize: 13,
    fontWeight: "600",
  },


  paidText: {
    color: "#35A65A",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },


  pendingText: {
    color: "#D39B00",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },


  historyDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 12,
  },


  optionButton: {
    minHeight: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 13,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },


  optionContent: {
    flex: 1,
    marginLeft: 12,
  },


  optionText: {
    color: "#222",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
  },


  optionSubText: {
    color: "#999",
    fontSize: 10,
    marginTop: 3,
  },


  renewButton: {
    height: 50,
    backgroundColor: "#FFCC00",
    borderRadius: 11,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },


  renewText: {
    color: "#171717",
    fontSize: 14,
    fontWeight: "800",
  },

});