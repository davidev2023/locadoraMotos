
import { StatusBar } from "expo-status-bar";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  PaperProvider,
  IconButton,
} from "react-native-paper";

import { useState } from "react";


export default function Payments() {

  const [menuVisible, setMenuVisible] = useState(false);


  return (
    <PaperProvider>

      <View style={styles.container}>

        {/* ==================================================
            TOP BAR
        ================================================== */}

        <View style={styles.navbar}>

          <View>
            <Text style={styles.title}>
              Pagamentos
            </Text>

            <Text style={styles.subtitle}>
              Acompanhe seus pagamentos e cobranças
            </Text>
          </View>


          {/* 3 PONTINHOS */}

          <IconButton
            icon="dots-vertical"
            iconColor="#222"
            size={27}
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          />

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
              PRÓXIMO PAGAMENTO
          ================================================== */}

          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>
              Próximo pagamento
            </Text>

            <Text style={styles.sectionSubtitle}>
              Fique em dia com seu aluguel
            </Text>

          </View>


          <View style={styles.nextPaymentCard}>

            <View style={styles.nextPaymentTop}>

              <View style={styles.paymentIcon}>

                <MaterialCommunityIcons
                  name="credit-card-outline"
                  size={25}
                  color="#D39B00"
                />

              </View>


              <View style={styles.statusPending}>

                <View style={styles.pendingDot} />

                <Text style={styles.pendingText}>
                  Pendente
                </Text>

              </View>

            </View>


            <Text style={styles.nextPaymentTitle}>
              Aluguel da Honda CG 160
            </Text>


            <View style={styles.paymentMainInfo}>

              <View>

                <Text style={styles.label}>
                  Valor
                </Text>

                <Text style={styles.paymentValue}>
                  R$ 350,00
                </Text>

              </View>


              <View style={styles.dateContainer}>

                <Text style={styles.label}>
                  Vencimento
                </Text>

                <Text style={styles.dateValue}>
                  29/08/2026
                </Text>

              </View>

            </View>


            <TouchableOpacity
              style={styles.payButton}
              activeOpacity={0.8}
            >

              <MaterialCommunityIcons
                name="credit-card-check-outline"
                size={19}
                color="#171717"
              />

              <Text style={styles.payButtonText}>
                Pagar agora
              </Text>

            </TouchableOpacity>

          </View>


          {/* ==================================================
              ATRASADOS
          ================================================== */}

          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>
              Pagamentos atrasados
            </Text>

          </View>


          <View style={styles.overdueCard}>

            <View style={styles.historyIconRed}>

              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={22}
                color="#D64545"
              />

            </View>


            <View style={styles.historyInfo}>

              <Text style={styles.historyTitle}>
                Aluguel - Honda CG 160
              </Text>

              <Text style={styles.historyDate}>
                Vencido em 25/08/2026
              </Text>

            </View>


            <View style={styles.historyRight}>

              <Text style={styles.overdueValue}>
                R$ 120,00
              </Text>

              <Text style={styles.overdueText}>
                Atrasado
              </Text>

            </View>

          </View>


          {/* ==================================================
              HISTÓRICO
          ================================================== */}

          <View style={styles.historyHeader}>

            <View>

              <Text style={styles.sectionTitle}>
                Histórico de pagamentos
              </Text>

              <Text style={styles.sectionSubtitle}>
                Seus pagamentos anteriores
              </Text>

            </View>


            <TouchableOpacity>
              <Text style={styles.seeAll}>
                Ver todos
              </Text>
            </TouchableOpacity>

          </View>


          {/* PAGAMENTO 1 */}

          <View style={styles.historyCard}>

            <View style={styles.historyIconGreen}>

              <MaterialCommunityIcons
                name="check"
                size={21}
                color="#35A65A"
              />

            </View>


            <View style={styles.historyInfo}>

              <Text style={styles.historyTitle}>
                Aluguel - Honda CG 160
              </Text>

              <Text style={styles.historyDate}>
                22/08/2026
              </Text>

            </View>


            <View style={styles.historyRight}>

              <Text style={styles.historyValue}>
                R$ 320,00
              </Text>

              <Text style={styles.paidText}>
                Pago
              </Text>

            </View>

          </View>


          {/* PAGAMENTO 2 */}

          <View style={styles.historyCard}>

            <View style={styles.historyIconGreen}>

              <MaterialCommunityIcons
                name="check"
                size={21}
                color="#35A65A"
              />

            </View>


            <View style={styles.historyInfo}>

              <Text style={styles.historyTitle}>
                Aluguel - Honda CG 160
              </Text>

              <Text style={styles.historyDate}>
                15/08/2026
              </Text>

            </View>


            <View style={styles.historyRight}>

              <Text style={styles.historyValue}>
                R$ 320,00
              </Text>

              <Text style={styles.paidText}>
                Pago
              </Text>

            </View>

          </View>


          {/* PAGAMENTO 3 */}

          <View style={styles.historyCard}>

            <View style={styles.historyIconGreen}>

              <MaterialCommunityIcons
                name="check"
                size={21}
                color="#35A65A"
              />

            </View>


            <View style={styles.historyInfo}>

              <Text style={styles.historyTitle}>
                Aluguel - Honda CG 160
              </Text>

              <Text style={styles.historyDate}>
                08/08/2026
              </Text>

            </View>


            <View style={styles.historyRight}>

              <Text style={styles.historyValue}>
                R$ 320,00
              </Text>

              <Text style={styles.paidText}>
                Pago
              </Text>

            </View>

          </View>


          {/* ESPAÇO PARA BOTTOM TAB */}

          <View style={{ height: 110 }} />

        </ScrollView>


        {/* ==================================================
            MENU DE SUPORTE
        ================================================== */}

        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >

          <Pressable
            style={styles.modalOverlay}
            onPress={() => setMenuVisible(false)}
          >

            <Pressable
              style={styles.supportMenu}
              onPress={(event) => event.stopPropagation()}
            >

              <View style={styles.menuHeader}>

                <View>

                  <Text style={styles.menuTitle}>
                    Suporte
                  </Text>

                  <Text style={styles.menuSubtitle}>
                    Precisa de ajuda com pagamentos?
                  </Text>

                </View>


                <IconButton
                  icon="close"
                  size={22}
                  iconColor="#555"
                  onPress={() => setMenuVisible(false)}
                />

              </View>


              {/* OPÇÃO 1 */}

              <TouchableOpacity
                style={styles.supportOption}
                activeOpacity={0.7}
              >

                <View style={styles.supportIcon}>

                  <MaterialCommunityIcons
                    name="credit-card-alert-outline"
                    size={22}
                    color="#D39B00"
                  />

                </View>

                <View style={styles.supportTextContainer}>

                  <Text style={styles.supportTitle}>
                    Problemas com pagamento
                  </Text>

                  <Text style={styles.supportDescription}>
                    Não conseguiu realizar um pagamento
                  </Text>

                </View>

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color="#999"
                />

              </TouchableOpacity>


              {/* OPÇÃO 2 */}

              <TouchableOpacity
                style={styles.supportOption}
                activeOpacity={0.7}
              >

                <View style={styles.supportIcon}>

                  <MaterialCommunityIcons
                    name="qrcode"
                    size={22}
                    color="#D39B00"
                  />

                </View>

                <View style={styles.supportTextContainer}>

                  <Text style={styles.supportTitle}>
                    PIX ou boleto
                  </Text>

                  <Text style={styles.supportDescription}>
                    Dúvidas sobre formas de pagamento
                  </Text>

                </View>

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color="#999"
                />

              </TouchableOpacity>


              {/* OPÇÃO 3 */}

              <TouchableOpacity
                style={styles.supportOption}
                activeOpacity={0.7}
              >

                <View style={styles.supportIcon}>

                  <MaterialCommunityIcons
                    name="help-circle-outline"
                    size={22}
                    color="#D39B00"
                  />

                </View>

                <View style={styles.supportTextContainer}>

                  <Text style={styles.supportTitle}>
                    Pagamento não identificado
                  </Text>

                  <Text style={styles.supportDescription}>
                    Já paguei, mas ainda aparece pendente
                  </Text>

                </View>

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color="#999"
                />

              </TouchableOpacity>


              {/* FALAR COM SUPORTE */}

              <TouchableOpacity
                style={styles.contactButton}
                activeOpacity={0.8}
              >

                <MaterialCommunityIcons
                  name="headset"
                  size={20}
                  color="#171717"
                />

                <Text style={styles.contactButtonText}>
                  Falar com suporte
                </Text>

              </TouchableOpacity>

            </Pressable>

          </Pressable>

        </Modal>


        <StatusBar style="dark" />

      </View>

    </PaperProvider>
  );
}


const styles = StyleSheet.create({

  /* ==================================================
      CONTAINER
  ================================================== */

  container: {
    flex: 1,
    backgroundColor: "#E7EAE4",
  },


  /* ==================================================
      NAVBAR
  ================================================== */

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


  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#171717",
  },


  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },


  menuButton: {
    margin: 0,
    backgroundColor: "#F0F1EE",
    borderRadius: 30,
  },


  /* ==================================================
      SCROLL
  ================================================== */

  scrollView: {
    flex: 1,
  },


  scrollContent: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 30,
  },


  /* ==================================================
      SECTION
  ================================================== */

  sectionHeader: {
    width: "92%",
    marginTop: 15,
    marginBottom: 10,
  },


  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1A1A1A",
  },


  sectionSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 3,
  },


  /* ==================================================
      PRÓXIMO PAGAMENTO
  ================================================== */

  nextPaymentCard: {
    width: "92%",

    backgroundColor: "#FFFFFF",

    borderRadius: 17,

    padding: 17,

    elevation: 4,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.09,

    shadowRadius: 7,
  },


  nextPaymentTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },


  paymentIcon: {
    width: 42,
    height: 42,

    borderRadius: 12,

    backgroundColor: "#FFF6D8",

    alignItems: "center",
    justifyContent: "center",
  },


  statusPending: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#FFF1C7",

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 20,
  },


  pendingDot: {
    width: 7,
    height: 7,

    borderRadius: 10,

    backgroundColor: "#E5A900",

    marginRight: 5,
  },


  pendingText: {
    color: "#D39B00",

    fontSize: 11,

    fontWeight: "700",
  },


  nextPaymentTitle: {
    fontSize: 16,

    fontWeight: "700",

    color: "#222",

    marginTop: 15,
  },


  paymentMainInfo: {
    flexDirection: "row",

    justifyContent: "space-between",

    marginTop: 14,
  },


  label: {
    fontSize: 11,
    color: "#999",
    marginBottom: 4,
  },


  paymentValue: {
    fontSize: 22,

    fontWeight: "800",

    color: "#222",
  },


  dateContainer: {
    alignItems: "flex-end",
  },


  dateValue: {
    fontSize: 14,

    fontWeight: "700",

    color: "#333",
  },


  payButton: {
    height: 45,

    marginTop: 17,

    borderRadius: 10,

    backgroundColor: "#FFCC00",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 7,
  },


  payButtonText: {
    fontSize: 14,

    fontWeight: "800",

    color: "#171717",
  },


  /* ==================================================
      ATRASADO
  ================================================== */

  overdueCard: {
    width: "92%",

    backgroundColor: "#FFF5F5",

    borderRadius: 14,

    padding: 14,

    flexDirection: "row",

    alignItems: "center",

    borderWidth: 1,

    borderColor: "#FFD7D7",
  },


  historyIconRed: {
    width: 40,
    height: 40,

    borderRadius: 11,

    backgroundColor: "#FFE5E5",

    alignItems: "center",
    justifyContent: "center",
  },


  overdueValue: {
    fontSize: 13,

    fontWeight: "800",

    color: "#D64545",
  },


  overdueText: {
    fontSize: 10,

    color: "#D64545",

    fontWeight: "700",

    marginTop: 2,
  },


  /* ==================================================
      HISTÓRICO HEADER
  ================================================== */

  historyHeader: {
    width: "92%",

    marginTop: 23,

    marginBottom: 10,

    flexDirection: "row",

    alignItems: "flex-end",

    justifyContent: "space-between",
  },


  seeAll: {
    fontSize: 12,

    color: "#B58300",

    fontWeight: "700",
  },


  /* ==================================================
      HISTÓRICO
  ================================================== */

  historyCard: {
    width: "92%",

    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    padding: 13,

    marginBottom: 9,

    flexDirection: "row",

    alignItems: "center",

    elevation: 2,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 1,
    },

    shadowOpacity: 0.06,

    shadowRadius: 4,
  },


  historyIconGreen: {
    width: 40,
    height: 40,

    borderRadius: 11,

    backgroundColor: "#EAF7ED",

    alignItems: "center",
    justifyContent: "center",
  },


  historyInfo: {
    flex: 1,

    marginLeft: 10,
  },


  historyTitle: {
    fontSize: 13,

    fontWeight: "700",

    color: "#222",
  },


  historyDate: {
    fontSize: 11,

    color: "#999",

    marginTop: 3,
  },


  historyRight: {
    alignItems: "flex-end",
  },


  historyValue: {
    fontSize: 13,

    fontWeight: "800",

    color: "#222",
  },


  paidText: {
    fontSize: 10,

    color: "#35A65A",

    fontWeight: "700",

    marginTop: 2,
  },


  /* ==================================================
      MODAL / SUPORTE
  ================================================== */

  modalOverlay: {
    flex: 1,

    backgroundColor: "rgba(0,0,0,0.35)",

    justifyContent: "flex-end",
  },


  supportMenu: {
    backgroundColor: "#FFFFFF",

    borderTopLeftRadius: 25,

    borderTopRightRadius: 25,

    paddingHorizontal: 20,

    paddingTop: 18,

    paddingBottom: 30,
  },


  menuHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 8,
  },


  menuTitle: {
    fontSize: 21,

    fontWeight: "800",

    color: "#171717",
  },


  menuSubtitle: {
    fontSize: 12,

    color: "#888",

    marginTop: 3,
  },


  supportOption: {
    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 13,

    borderBottomWidth: 1,

    borderBottomColor: "#EEEEEE",
  },


  supportIcon: {
    width: 40,

    height: 40,

    borderRadius: 11,

    backgroundColor: "#FFF6D8",

    alignItems: "center",

    justifyContent: "center",
  },


  supportTextContainer: {
    flex: 1,

    marginLeft: 11,
  },


  supportTitle: {
    fontSize: 13,

    fontWeight: "700",

    color: "#222",
  },


  supportDescription: {
    fontSize: 10,

    color: "#999",

    marginTop: 3,
  },


  contactButton: {
    height: 47,

    backgroundColor: "#FFCC00",

    borderRadius: 11,

    marginTop: 18,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 7,
  },


  contactButtonText: {
    color: "#171717",

    fontSize: 14,

    fontWeight: "800",
  },

});

