
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


export default function Inspections() {

  const [menuVisible, setMenuVisible] = useState(false);


  return (
    <PaperProvider>

      <View style={styles.container}>

        {/* ==================================================
            TOP BAR
        ================================================== */}

        <View style={styles.navbar}>

          <View style={styles.headerContent}>

            <Text style={styles.title}>
              Vistorias
            </Text>

            <Text style={styles.subtitle}>
              Acompanhe suas vistorias semanais
            </Text>

          </View>


          {/* MENU 3 PONTOS */}

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
              VISTORIA DESTA SEMANA
          ================================================== */}

          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>
              Vistoria desta semana
            </Text>

            <Text style={styles.sectionSubtitle}>
              A vistoria deve ser realizada toda semana
            </Text>

          </View>


          {/* ==================================================
              CARD VISTORIA ATUAL
          ================================================== */}

          <View style={styles.currentCard}>

            {/* TOPO */}

            <View style={styles.currentTop}>

              <View style={styles.currentIcon}>

                <MaterialCommunityIcons
                  name="clipboard-check-outline"
                  size={25}
                  color="#D39B00"
                />

              </View>


              {/* STATUS */}

              <View style={styles.pendingBadge}>

                <View style={styles.pendingDot} />

                <Text style={styles.pendingText}>
                  Pendente
                </Text>

              </View>

            </View>


            {/* TÍTULO */}

            <Text style={styles.currentTitle}>
              Vistoria semanal
            </Text>


            <Text style={styles.currentDescription}>
              Faça a vistoria da sua Honda CG 160 nesta semana.
            </Text>


            {/* DATA */}

            <View style={styles.deadlineBox}>

              <MaterialCommunityIcons
                name="calendar-clock-outline"
                size={19}
                color="#D39B00"
              />

              <View>

                <Text style={styles.deadlineLabel}>
                  Prazo para realizar
                </Text>

                <Text style={styles.deadlineValue}>
                  05/09/2026
                </Text>

              </View>

            </View>


            {/* BOTÃO */}

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
            >

              <MaterialCommunityIcons
                name="camera-outline"
                size={20}
                color="#171717"
              />

              <Text style={styles.primaryButtonText}>
                Fazer vistoria
              </Text>

            </TouchableOpacity>

          </View>


          {/* ==================================================
              HISTÓRICO
          ================================================== */}

          <View style={styles.historyHeader}>

            <View>

              <Text style={styles.sectionTitle}>
                Histórico de vistorias
              </Text>

              <Text style={styles.sectionSubtitle}>
                Suas vistorias semanais anteriores
              </Text>

            </View>


            <TouchableOpacity>

              <Text style={styles.seeAll}>
                Ver todas
              </Text>

            </TouchableOpacity>

          </View>


          {/* ==================================================
              VISTORIA APROVADA
          ================================================== */}

          <View style={styles.historyCard}>

            <View style={styles.approvedIcon}>

              <MaterialCommunityIcons
                name="check"
                size={22}
                color="#35A65A"
              />

            </View>


            <View style={styles.historyInfo}>

              <Text style={styles.historyTitle}>
                Semana 22/08
              </Text>

              <Text style={styles.historyDate}>
                Realizada em 22/08/2026
              </Text>

            </View>


            <View style={styles.approvedBadgeSmall}>

              <Text style={styles.approvedBadgeText}>
                Aprovada
              </Text>

            </View>

          </View>


          {/* ==================================================
              VISTORIA APROVADA
          ================================================== */}

          <View style={styles.historyCard}>

            <View style={styles.approvedIcon}>

              <MaterialCommunityIcons
                name="check"
                size={22}
                color="#35A65A"
              />

            </View>


            <View style={styles.historyInfo}>

              <Text style={styles.historyTitle}>
                Semana 15/08
              </Text>

              <Text style={styles.historyDate}>
                Realizada em 15/08/2026
              </Text>

            </View>


            <View style={styles.approvedBadgeSmall}>

              <Text style={styles.approvedBadgeText}>
                Aprovada
              </Text>

            </View>

          </View>


          {/* ==================================================
              VISTORIA REPROVADA
          ================================================== */}

          <View style={styles.rejectedCard}>

            <View style={styles.rejectedTop}>

              <View style={styles.rejectedIcon}>

                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={23}
                  color="#D64545"
                />

              </View>


              <View style={styles.rejectedBadge}>

                <View style={styles.rejectedDot} />

                <Text style={styles.rejectedText}>
                  Reprovada
                </Text>

              </View>

            </View>


            <Text style={styles.rejectedTitle}>
              Semana 08/08
            </Text>


            <Text style={styles.rejectedDate}>
              Realizada em 08/08/2026
            </Text>


            {/* PROBLEMA */}

            <View style={styles.problemBox}>

              <MaterialCommunityIcons
                name="information-outline"
                size={18}
                color="#D64545"
              />

              <Text style={styles.problemText}>
                Foi identificado um problema no pneu traseiro.
              </Text>

            </View>


            {/* REFAZER */}

            <TouchableOpacity
              style={styles.retryButton}
              activeOpacity={0.8}
            >

              <MaterialCommunityIcons
                name="refresh"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.retryButtonText}>
                Refazer vistoria
              </Text>

            </TouchableOpacity>

          </View>


          {/* ==================================================
              MANUTENÇÃO
          ================================================== */}

          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>
              Manutenção
            </Text>

            <Text style={styles.sectionSubtitle}>
              Agende uma manutenção quando sua moto precisar
            </Text>

          </View>


          {/* ==================================================
              MANUTENÇÃO AGENDADA
          ================================================== */}

          <View style={styles.maintenanceCard}>

            <View style={styles.maintenanceTop}>

              <View style={styles.maintenanceIcon}>

                <MaterialCommunityIcons
                  name="wrench-outline"
                  size={24}
                  color="#D39B00"
                />

              </View>


              <View style={styles.scheduledBadge}>

                <View style={styles.scheduledDot} />

                <Text style={styles.scheduledText}>
                  Agendada
                </Text>

              </View>

            </View>


            <Text style={styles.maintenanceTitle}>
              Troca de óleo
            </Text>


            {/* DATA E HORÁRIO */}

            <View style={styles.maintenanceInfo}>

              <View style={styles.maintenanceRow}>

                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={18}
                  color="#888"
                />

                <Text style={styles.maintenanceText}>
                  02/09/2026
                </Text>

              </View>


              <View style={styles.maintenanceRow}>

                <MaterialCommunityIcons
                  name="clock-outline"
                  size={18}
                  color="#888"
                />

                <Text style={styles.maintenanceText}>
                  10:00
                </Text>

              </View>

            </View>


            {/* LOCAL */}

            <View style={styles.maintenancePlace}>

              <MaterialCommunityIcons
                name="map-marker-outline"
                size={18}
                color="#888"
              />

              <Text style={styles.maintenanceText}>
                Oficina parceira
              </Text>

            </View>


            {/* BOTÃO */}

            <TouchableOpacity
              style={styles.maintenanceButton}
              activeOpacity={0.8}
            >

              <Text style={styles.maintenanceButtonText}>
                Ver manutenção
              </Text>

              <MaterialCommunityIcons
                name="arrow-right"
                size={18}
                color="#171717"
              />

            </TouchableOpacity>

          </View>


          {/* ==================================================
              AGENDAR MANUTENÇÃO
          ================================================== */}

          <View style={styles.scheduleCard}>

            <View style={styles.scheduleIcon}>

              <MaterialCommunityIcons
                name="calendar-plus"
                size={23}
                color="#D39B00"
              />

            </View>


            <View style={styles.scheduleInfo}>

              <Text style={styles.scheduleTitle}>
                Precisa de manutenção?
              </Text>

              <Text style={styles.scheduleDescription}>
                Agende uma manutenção para sua moto.
              </Text>

            </View>


            <TouchableOpacity
              style={styles.scheduleButton}
              activeOpacity={0.8}
            >

              <Text style={styles.scheduleButtonText}>
                Agendar
              </Text>

            </TouchableOpacity>

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

              {/* ==================================================
                  CABEÇALHO DO MENU
              ================================================== */}

              <View style={styles.menuHeader}>

                <View>

                  <Text style={styles.menuTitle}>
                    Suporte
                  </Text>

                  <Text style={styles.menuSubtitle}>
                    Como podemos ajudar?
                  </Text>

                </View>


                <IconButton
                  icon="close"
                  size={22}
                  iconColor="#555"
                  onPress={() => setMenuVisible(false)}
                />

              </View>


              {/* ==================================================
                  DEFEITO NA MOTO
              ================================================== */}

              <TouchableOpacity
                style={styles.supportOption}
                activeOpacity={0.7}
              >

                <View style={styles.supportIconRed}>

                  <MaterialCommunityIcons
                    name="motorbike-alert"
                    size={22}
                    color="#D64545"
                  />

                </View>


                <View style={styles.supportTextContainer}>

                  <Text style={styles.supportTitle}>
                    Defeito na moto
                  </Text>

                  <Text style={styles.supportDescription}>
                    Informe um problema ou defeito
                  </Text>

                </View>


                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color="#999"
                />

              </TouchableOpacity>


              {/* ==================================================
                  GUINCHO
              ================================================== */}

              <TouchableOpacity
                style={styles.supportOption}
                activeOpacity={0.7}
              >

                <View style={styles.supportIconRed}>

                  <MaterialCommunityIcons
                    name="tow-truck"
                    size={22}
                    color="#D64545"
                  />

                </View>


                <View style={styles.supportTextContainer}>

                  <Text style={styles.supportTitle}>
                    Solicitar guincho
                  </Text>

                  <Text style={styles.supportDescription}>
                    Sua moto não pode continuar rodando?
                  </Text>

                </View>


                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color="#999"
                />

              </TouchableOpacity>


              {/* ==================================================
                  MANUTENÇÃO
              ================================================== */}

              <TouchableOpacity
                style={styles.supportOption}
                activeOpacity={0.7}
              >

                <View style={styles.supportIcon}>

                  <MaterialCommunityIcons
                    name="wrench-outline"
                    size={22}
                    color="#D39B00"
                  />

                </View>


                <View style={styles.supportTextContainer}>

                  <Text style={styles.supportTitle}>
                    Solicitar manutenção
                  </Text>

                  <Text style={styles.supportDescription}>
                    Precisa levar sua moto para oficina?
                  </Text>

                </View>


                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color="#999"
                />

              </TouchableOpacity>


              {/* ==================================================
                  FALAR COM SUPORTE
              ================================================== */}

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


  headerContent: {
    flex: 1,
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
      SEÇÕES
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
      VISTORIA ATUAL
  ================================================== */

  currentCard: {
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


  currentTop: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },


  currentIcon: {
    width: 43,

    height: 43,

    borderRadius: 12,

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


  currentTitle: {
    color: "#222",

    fontSize: 17,

    fontWeight: "800",

    marginTop: 14,
  },


  currentDescription: {
    color: "#888",

    fontSize: 12,

    lineHeight: 17,

    marginTop: 4,
  },


  deadlineBox: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#FFF9E8",

    borderRadius: 10,

    padding: 11,

    marginTop: 14,
  },


  deadlineLabel: {
    color: "#999",

    fontSize: 10,

    marginLeft: 9,
  },


  deadlineValue: {
    color: "#D39B00",

    fontSize: 13,

    fontWeight: "800",

    marginLeft: 9,

    marginTop: 2,
  },


  primaryButton: {
    height: 45,

    backgroundColor: "#FFCC00",

    borderRadius: 10,

    marginTop: 14,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 7,
  },


  primaryButtonText: {
    color: "#171717",

    fontSize: 14,

    fontWeight: "800",
  },


  /* ==================================================
      HISTÓRICO
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
    color: "#B58300",

    fontSize: 12,

    fontWeight: "700",
  },


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


  approvedIcon: {
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
    color: "#222",

    fontSize: 13,

    fontWeight: "700",
  },


  historyDate: {
    color: "#999",

    fontSize: 11,

    marginTop: 3,
  },


  approvedBadgeSmall: {
    backgroundColor: "#EAF7ED",

    paddingHorizontal: 8,

    paddingVertical: 5,

    borderRadius: 7,
  },


  approvedBadgeText: {
    color: "#35A65A",

    fontSize: 9,

    fontWeight: "800",
  },


  /* ==================================================
      REPROVADA
  ================================================== */

  rejectedCard: {
    width: "92%",

    backgroundColor: "#FFF5F5",

    borderRadius: 16,

    padding: 16,

    borderWidth: 1,

    borderColor: "#FFD7D7",

    marginTop: 2,
  },


  rejectedTop: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },


  rejectedIcon: {
    width: 42,

    height: 42,

    borderRadius: 12,

    backgroundColor: "#FFE5E5",

    alignItems: "center",

    justifyContent: "center",
  },


  rejectedBadge: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#FFE5E5",

    paddingHorizontal: 9,

    paddingVertical: 6,

    borderRadius: 20,
  },


  rejectedDot: {
    width: 7,

    height: 7,

    borderRadius: 10,

    backgroundColor: "#D64545",

    marginRight: 5,
  },


  rejectedText: {
    color: "#D64545",

    fontSize: 11,

    fontWeight: "800",
  },


  rejectedTitle: {
    color: "#222",

    fontSize: 16,

    fontWeight: "800",

    marginTop: 13,
  },


  rejectedDate: {
    color: "#999",

    fontSize: 11,

    marginTop: 3,
  },


  problemBox: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 10,

    padding: 10,

    marginTop: 13,
  },


  problemText: {
    flex: 1,

    color: "#7D5555",

    fontSize: 11,

    marginLeft: 7,

    lineHeight: 16,
  },


  retryButton: {
    height: 43,

    backgroundColor: "#D64545",

    borderRadius: 9,

    marginTop: 12,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 6,
  },


  retryButtonText: {
    color: "#FFFFFF",

    fontSize: 13,

    fontWeight: "800",
  },


  /* ==================================================
      MANUTENÇÃO
  ================================================== */

  maintenanceCard: {
    width: "92%",

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 16,

    elevation: 3,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,

      height: 2,
    },

    shadowOpacity: 0.07,

    shadowRadius: 5,
  },


  maintenanceTop: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },


  maintenanceIcon: {
    width: 42,

    height: 42,

    borderRadius: 12,

    backgroundColor: "#FFF6D8",

    alignItems: "center",

    justifyContent: "center",
  },


  scheduledBadge: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#EAF7ED",

    paddingHorizontal: 9,

    paddingVertical: 6,

    borderRadius: 20,
  },


  scheduledDot: {
    width: 7,

    height: 7,

    borderRadius: 10,

    backgroundColor: "#35A65A",

    marginRight: 5,
  },


  scheduledText: {
    color: "#35A65A",

    fontSize: 11,

    fontWeight: "700",
  },


  maintenanceTitle: {
    fontSize: 17,

    fontWeight: "800",

    color: "#222",

    marginTop: 13,
  },


  maintenanceInfo: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 13,

    gap: 20,
  },


  maintenanceRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 5,
  },


  maintenanceText: {
    fontSize: 12,

    color: "#777",
  },


  maintenancePlace: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 8,

    gap: 5,
  },


  maintenanceButton: {
    height: 43,

    backgroundColor: "#FFCC00",

    borderRadius: 9,

    marginTop: 14,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 6,
  },


  maintenanceButtonText: {
    color: "#171717",

    fontSize: 13,

    fontWeight: "800",
  },


  /* ==================================================
      AGENDAR MANUTENÇÃO
  ================================================== */

  scheduleCard: {
    width: "92%",

    backgroundColor: "#FFFFFF",

    borderRadius: 15,

    padding: 14,

    marginTop: 12,

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


  scheduleIcon: {
    width: 42,

    height: 42,

    borderRadius: 12,

    backgroundColor: "#FFF6D8",

    alignItems: "center",

    justifyContent: "center",
  },


  scheduleInfo: {
    flex: 1,

    marginLeft: 10,
  },


  scheduleTitle: {
    fontSize: 13,

    fontWeight: "800",

    color: "#222",
  },


  scheduleDescription: {
    fontSize: 10,

    color: "#999",

    marginTop: 3,
  },


  scheduleButton: {
    backgroundColor: "#35A65A",

    paddingHorizontal: 12,

    paddingVertical: 9,

    borderRadius: 8,

    marginLeft: 8,
  },


  scheduleButtonText: {
    color: "#FFFFFF",

    fontSize: 10,

    fontWeight: "800",
  },


  /* ==================================================
      MODAL DE SUPORTE
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


  supportIconRed: {
    width: 40,

    height: 40,

    borderRadius: 11,

    backgroundColor: "#FFE5E5",

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

