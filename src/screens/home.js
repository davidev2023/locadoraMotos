import React, { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { PaperProvider, IconButton } from "react-native-paper";

import { doc, getDoc } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { db, auth } from "../services/firebaseConfig";

export default function Home({ navigation }) {
  // =========================================================
  // DADOS DO ALUGUEL
  // =========================================================

  const [aluguel, setAluguel] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // =========================================================
  // BUSCAR ALUGUEL DO USUÁRIO LOGADO
  // =========================================================

  useEffect(() => {
    let cancelado = false;

    const unsubscribe = onAuthStateChanged(auth, async (usuario) => {
      if (cancelado) {
        return;
      }

      try {
        setCarregando(true);

        // -----------------------------------------------------
        // VERIFICAR USUÁRIO LOGADO
        // -----------------------------------------------------

        if (!usuario) {
          console.log("Nenhum usuário autenticado.");

          setAluguel(null);
          setCarregando(false);

          return;
        }

        const uid = usuario.uid;

        console.log("Usuário logado:", uid);

        // -----------------------------------------------------
        // CAMINHO DO USUÁRIO
        //
        // usuarios/{uid}
        // -----------------------------------------------------

        const usuarioRef = doc(db, "usuarios", uid);

        const usuarioSnap = await getDoc(usuarioRef);

        if (usuarioSnap.exists()) {
          console.log("Dados do usuário:", usuarioSnap.data());
        } else {
          console.log("Documento do usuário não encontrado:", uid);
        }

        // -----------------------------------------------------
        // CAMINHO DO ALUGUEL
        //
        // usuarios/{uid}/alugueis/aluguel_01
        // -----------------------------------------------------

        const aluguelRef = doc(db, "usuarios", uid, "alugueis", "aluguel_01");

        const aluguelSnap = await getDoc(aluguelRef);

        if (aluguelSnap.exists()) {
          const dados = aluguelSnap.data();

          console.log("Aluguel carregado:", dados);

          if (!cancelado) {
            setAluguel(dados);
          }
        } else {
          console.log("Aluguel aluguel_01 não encontrado para o usuário:", uid);

          if (!cancelado) {
            setAluguel(null);
          }
        }
      } catch (error) {
        console.log("Erro ao carregar aluguel:", error);

        if (!cancelado) {
          setAluguel(null);
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    });

    return () => {
      cancelado = true;
      unsubscribe();
    };
  }, []);

  // =========================================================
  // DADOS DO FIRESTORE
  // =========================================================

  const nomeCliente = aluguel?.clienteNome || "";

  const modeloMoto = aluguel?.moto?.modelo || "";

  const placaMoto = aluguel?.moto?.placa || "";

  const dataInicio = aluguel?.contrato?.inicio || "";

  const dataDevolucao = aluguel?.contrato?.fim || "";

  const duracaoContrato = aluguel?.contrato?.duracaoMeses || "";

  const periodoPagamento = aluguel?.pagamento?.periodo || "";

  const valorSemanal = Number(aluguel?.pagamento?.valor) || 0;

  const proximoVencimento = aluguel?.pagamento?.proximoVencimento || "";

  // =========================================================
  // JUROS POR DIA DE ATRASO
  // =========================================================

  const jurosAtrasoDia = Number(aluguel?.pagamento?.jurosAtrasoDia) || 0;

  // =========================================================
  // CALCULAR DIAS DE ATRASO
  // =========================================================

  function calcularDiasAtraso(data) {
    if (!data) {
      return 0;
    }

    try {
      const partes = data.split("/");

      if (partes.length !== 3) {
        return 0;
      }

      const dia = Number(partes[0]);
      const mes = Number(partes[1]) - 1;
      const ano = Number(partes[2]);

      const vencimento = new Date(ano, mes, dia);

      vencimento.setHours(0, 0, 0, 0);

      const hoje = new Date();

      hoje.setHours(0, 0, 0, 0);

      const diferenca = hoje.getTime() - vencimento.getTime();

      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));

      return dias > 0 ? dias : 0;
    } catch (error) {
      console.log("Erro ao calcular atraso:", error);

      return 0;
    }
  }

  // =========================================================
  // DIAS DE ATRASO
  // =========================================================

  const diasAtraso = calcularDiasAtraso(proximoVencimento);

  // =========================================================
  // JUROS ACUMULADOS
  // =========================================================

  const jurosAcumulados = diasAtraso * jurosAtrasoDia;

  // =========================================================
  // VALOR ATUALIZADO
  // =========================================================

  const valorPagamentoAtual = valorSemanal + jurosAcumulados;

  // =========================================================
  // STATUS
  // =========================================================

  const statusAluguel = aluguel?.status || "";

  const statusVistoria = aluguel?.vistoria?.status || "";

  // =========================================================
  // FORMATAÇÕES
  // =========================================================

  const statusAluguelTexto =
    statusAluguel === "alugado" ? "Alugada" : statusAluguel;

  const periodoPagamentoTexto =
    periodoPagamento === "semanal" ? "Semanal" : periodoPagamento;

  const statusVistoriaTexto =
    statusVistoria === "pendente"
      ? "Pendente"
      : statusVistoria === "aprovada"
        ? "Aprovada"
        : statusVistoria === "rejeitada"
          ? "Rejeitada"
          : statusVistoria;

  // =========================================================
  // FORMATAR DINHEIRO
  // =========================================================

  const formatarDinheiro = (valor) => {
    return Number(valor).toFixed(2).replace(".", ",");
  };

  // =========================================================
  // TELA
  // =========================================================

  return (
    <PaperProvider>
      <View style={styles.homeContainer}>
        {/* ==================================================
            TOP BAR
        ================================================== */}

        <View style={styles.navbar}>
          <View>
            {carregando ? (
              <>
                <View style={styles.skeletonGreeting} />

                <View style={styles.skeletonWelcome} />
              </>
            ) : (
              <>
                <Text style={styles.greeting}>Olá, {nomeCliente} 👋</Text>

                <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
              </>
            )}
          </View>

          {/* NOTIFICAÇÕES */}

          <View style={styles.notificationContainer}>
            <IconButton
              icon="bell-outline"
              iconColor="#222"
              size={25}
              style={styles.notificationButton}
            />

            <View style={styles.notificationBadge} />
          </View>
        </View>

        {/* ==================================================
            CONTEÚDO
        ================================================== */}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ==================================================
              TÍTULO
          ================================================== */}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Minha moto</Text>

            <Text style={styles.sectionSubtitle}>
              Veículo alugado atualmente
            </Text>
          </View>

          {/* ==================================================
              CARD DA MOTO
          ================================================== */}

          <View style={styles.rentalCard}>
            {carregando ? (
              <View style={styles.skeletonMotoImage} />
            ) : (
              <Image
                source={require("../../assets/moto160.png")}
                style={styles.motoImage}
              />
            )}

            <View style={styles.rentalInfo}>
              <View style={styles.titleRow}>
                <View>
                  {carregando ? (
                    <>
                      <View style={styles.skeletonMotoName} />

                      <View style={styles.skeletonPlate} />
                    </>
                  ) : (
                    <>
                      <Text style={styles.motoName}>{modeloMoto}</Text>

                      <Text style={styles.plate}>{placaMoto}</Text>
                    </>
                  )}
                </View>

                {carregando ? (
                  <View style={styles.skeletonStatus} />
                ) : (
                  <View style={styles.status}>
                    <View style={styles.statusDot} />

                    <Text style={styles.statusText}>{statusAluguelTexto}</Text>
                  </View>
                )}
              </View>

              <View style={styles.divider} />

              {/* INFORMAÇÕES */}

              <View style={styles.infoRow}>
                <View>
                  <Text style={styles.label}>Início</Text>

                  {carregando ? (
                    <View style={styles.skeletonValue} />
                  ) : (
                    <Text style={styles.value}>{dataInicio}</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.label}>Devolução</Text>

                  {carregando ? (
                    <View style={styles.skeletonValue} />
                  ) : (
                    <Text style={styles.value}>{dataDevolucao}</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.label}>
                    {carregando ? "Semanal" : periodoPagamentoTexto}
                  </Text>

                  {carregando ? (
                    <View style={styles.skeletonPrice} />
                  ) : (
                    <Text style={styles.price}>
                      R$ {formatarDinheiro(valorSemanal)}
                    </Text>
                  )}
                </View>
              </View>

              {/* BOTÃO VER ALUGUEL */}

              {carregando ? (
                <View style={styles.skeletonButton} />
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.getParent("RootStack")?.navigate("RentalDetails")
                  }
                >
                  <Text style={styles.buttonText}>Ver aluguel</Text>

                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={19}
                    color="#171717"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ==================================================
              PRÓXIMO PAGAMENTO
          ================================================== */}

          <View style={styles.paymentCard}>
            <View style={styles.paymentContent}>
              <View style={styles.paymentTitleRow}>
                <View style={styles.paymentIcon}>
                  <MaterialCommunityIcons
                    name="credit-card-outline"
                    size={22}
                    color="#D39B00"
                  />
                </View>

                {carregando ? (
                  <View style={styles.skeletonPaymentTitle} />
                ) : (
                  <Text style={styles.cardSmallTitle}>Próximo pagamento</Text>
                )}
              </View>

              {carregando ? (
                <>
                  <View style={styles.skeletonPaymentValue} />

                  <View style={styles.skeletonPaymentDate} />
                </>
              ) : (
                <>
                  <Text style={styles.paymentValue}>
                    R$ {formatarDinheiro(valorPagamentoAtual)}
                  </Text>

                  <Text style={styles.paymentDate}>
                    Vencimento: {proximoVencimento}
                  </Text>

                  {diasAtraso > 0 && (
                    <Text style={styles.lateText}>
                      Atrasado há {diasAtraso}{" "}
                      {diasAtraso === 1 ? "dia" : "dias"} • Juros: R${" "}
                      {formatarDinheiro(jurosAcumulados)}
                    </Text>
                  )}
                </>
              )}
            </View>

            {carregando ? (
              <View style={styles.skeletonPayButton} />
            ) : (
              <TouchableOpacity
                style={styles.payButton}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.getParent("RootStack")?.navigate("PixScreen", {
                    valor: valorPagamentoAtual,
                    vencimento: proximoVencimento,
                  })
                }
              >
                <Text style={styles.payButtonText}>Pagar agora</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ==================================================
              VISTORIA
          ================================================== */}

          <View style={styles.inspectionCard}>
            <View style={styles.inspectionTop}>
              <View style={styles.inspectionTitleRow}>
                <View style={styles.inspectionIcon}>
                  <MaterialCommunityIcons
                    name="clipboard-check-outline"
                    size={22}
                    color="#D39B00"
                  />
                </View>

                {carregando ? (
                  <View style={styles.skeletonInspectionTitle} />
                ) : (
                  <Text style={styles.cardSmallTitle}>Vistoria semanal</Text>
                )}
              </View>

              {carregando ? (
                <View style={styles.skeletonPendingBadge} />
              ) : (
                <View style={styles.pendingBadge}>
                  <View style={styles.pendingDot} />

                  <Text style={styles.pendingText}>{statusVistoriaTexto}</Text>
                </View>
              )}
            </View>

            <View style={styles.inspectionBottom}>
              <View style={styles.inspectionMessage}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={17}
                  color="#E5B800"
                />

                {carregando ? (
                  <View style={styles.skeletonInspectionMessage} />
                ) : (
                  <Text style={styles.inspectionText}>
                    Faça sua vistoria desta semana
                  </Text>
                )}
              </View>

              {carregando ? (
                <View style={styles.skeletonInspectionButton} />
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    navigation
                      .getParent("RootStack")
                      ?.navigate("InspectionScreen", {
                        aluguelId: "aluguel_01",
                      })
                  }
                  style={styles.inspectionButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.inspectionButtonText}>
                    Fazer vistoria
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>

        <StatusBar style="dark" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    backgroundColor: "#E7EAE4",
    alignItems: "center",
  },

  navbar: {
    width: "100%",
    backgroundColor: "#FBFBFB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 18,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,
    shadowRadius: 6,

    elevation: 4,
  },

  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: "#171717",
  },

  welcomeText: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },

  /* SKELETON */

  skeletonGreeting: {
    width: 205,
    height: 27,
    borderRadius: 7,
    backgroundColor: "#E1E2DF",
  },

  skeletonWelcome: {
    width: 125,
    height: 13,
    borderRadius: 5,
    backgroundColor: "#E1E2DF",
    marginTop: 7,
  },

  skeletonMotoImage: {
    width: "100%",
    height: 170,
    backgroundColor: "#DCDDDA",
  },

  skeletonMotoName: {
    width: 145,
    height: 21,
    borderRadius: 6,
    backgroundColor: "#E1E2DF",
  },

  skeletonPlate: {
    width: 80,
    height: 13,
    borderRadius: 5,
    backgroundColor: "#E1E2DF",
    marginTop: 7,
  },

  skeletonStatus: {
    width: 75,
    height: 29,
    borderRadius: 20,
    backgroundColor: "#E1E2DF",
  },

  skeletonValue: {
    width: 75,
    height: 15,
    borderRadius: 5,
    backgroundColor: "#E1E2DF",
  },

  skeletonPrice: {
    width: 65,
    height: 18,
    borderRadius: 5,
    backgroundColor: "#E1E2DF",
  },

  skeletonButton: {
    height: 45,
    backgroundColor: "#E1E2DF",
    borderRadius: 10,
    marginTop: 18,
  },

  skeletonPaymentTitle: {
    width: 130,
    height: 16,
    borderRadius: 5,
    backgroundColor: "#E1E2DF",
  },

  skeletonPaymentValue: {
    width: 90,
    height: 20,
    borderRadius: 5,
    backgroundColor: "#E1E2DF",
    marginTop: 8,
  },

  skeletonPaymentDate: {
    width: 125,
    height: 11,
    borderRadius: 5,
    backgroundColor: "#E1E2DF",
    marginTop: 5,
  },

  skeletonPayButton: {
    width: 82,
    height: 35,
    borderRadius: 8,
    backgroundColor: "#E1E2DF",
    marginLeft: 10,
  },

  skeletonInspectionTitle: {
    width: 125,
    height: 16,
    borderRadius: 5,
    backgroundColor: "#E1E2DF",
  },

  skeletonPendingBadge: {
    width: 75,
    height: 27,
    borderRadius: 8,
    backgroundColor: "#E1E2DF",
  },

  skeletonInspectionMessage: {
    width: 145,
    height: 12,
    borderRadius: 5,
    backgroundColor: "#E1E2DF",
  },

  skeletonInspectionButton: {
    width: 95,
    height: 31,
    borderRadius: 8,
    backgroundColor: "#E1E2DF",
    marginLeft: 8,
  },

  /* NOTIFICAÇÃO */

  notificationContainer: {
    position: "relative",
  },

  notificationButton: {
    margin: 0,
    backgroundColor: "#F0F1EE",
    borderRadius: 30,
  },

  notificationBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 9,
    height: 9,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FBFBFB",
  },

  /* SCROLL */

  scrollView: {
    width: "100%",
    flex: 1,
  },

  scrollContent: {
    alignItems: "center",
    paddingBottom: 110,
  },

  /* SEÇÃO */

  sectionHeader: {
    width: "92%",
    marginTop: 25,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  sectionSubtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 3,
  },

  /* CARD MOTO */

  rentalCard: {
    width: "92%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 5,

    elevation: 4,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  motoImage: {
    width: "100%",
    height: 170,
    resizeMode: "cover",
  },

  rentalInfo: {
    padding: 16,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  motoName: {
    color: "#1A1A1A",
    fontSize: 20,
    fontWeight: "bold",
  },

  plate: {
    color: "#777",
    fontSize: 13,
    marginTop: 4,
  },

  /* STATUS */

  status: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF7ED",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
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
    fontWeight: "bold",
  },

  /* DIVISÓRIA */

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 16,
  },

  /* INFORMAÇÕES */

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontWeight: "bold",
  },

  /* BOTÃO */

  button: {
    height: 45,
    backgroundColor: "#FFCC00",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
    marginTop: 18,
  },

  buttonText: {
    color: "#171717",
    fontSize: 15,
    fontWeight: "bold",
  },

  /* PAGAMENTO */

  paymentCard: {
    width: "92%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    elevation: 3,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.07,
    shadowRadius: 5,
  },

  paymentContent: {
    flex: 1,
  },

  paymentTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  paymentIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFF6D8",
    alignItems: "center",
    justifyContent: "center",
  },

  cardSmallTitle: {
    color: "#222",
    fontSize: 15,
    fontWeight: "700",
  },

  paymentValue: {
    color: "#222",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 7,
  },

  paymentDate: {
    color: "#888",
    fontSize: 11,
    marginTop: 2,
  },

  lateText: {
    color: "#D63B32",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 5,
  },

  payButton: {
    backgroundColor: "#35A65A",
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },

  payButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  /* VISTORIA */

  inspectionCard: {
    width: "92%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginTop: 12,

    elevation: 3,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.07,
    shadowRadius: 5,
  },

  inspectionTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  inspectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  inspectionIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFF6D8",
    alignItems: "center",
    justifyContent: "center",
  },

  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1C7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: "#E5A900",
    marginRight: 5,
  },

  pendingText: {
    color: "#E5A900",
    fontSize: 11,
    fontWeight: "700",
  },

  inspectionBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  inspectionMessage: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 5,
  },

  inspectionText: {
    color: "#8A7650",
    fontSize: 11,
    flexShrink: 1,
  },

  inspectionButton: {
    backgroundColor: "#35A65A",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    marginLeft: 8,
  },

  inspectionButtonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
});
