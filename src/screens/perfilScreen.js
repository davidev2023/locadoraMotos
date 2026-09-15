import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

export default function PerfilScreen() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  // ==================================================
  // SAIR DA CONTA
  // ==================================================
  const handleLogout = () => {
    setMenuVisible(false);

    Alert.alert("Sair da conta", "Tem certeza que deseja sair da sua conta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);

            const parentNavigation = navigation.getParent();

            if (parentNavigation) {
              parentNavigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            }
          } catch (error) {
            console.log("Erro ao sair:", error);

            Alert.alert("Erro", "Não foi possível sair da conta.");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* ==================================================
          TOPO
      ================================================== */}
      <View style={styles.navbar}>
        <View style={styles.navbarText}>
          <Text style={styles.title}>Meu perfil</Text>
          <Text style={styles.subtitle}>Gerencie sua conta e seus dados</Text>
        </View>

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
            PERFIL PRINCIPAL
        ================================================== */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                João Silva
              </Text>
              <MaterialCommunityIcons
                name="check-decagram"
                size={18}
                color="#35A65A"
              />
            </View>

            <Text style={styles.email} numberOfLines={1}>
              joao@email.com
            </Text>

            <View style={styles.verifiedRow}>
              <View style={styles.verifiedDot} />
              <Text style={styles.verifiedText}>Conta verificada</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            activeOpacity={0.7}
            onPress={() => {
              Alert.alert("Editar perfil", "Área de edição do perfil.");
            }}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={19}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        {/* ==================================================
            DADOS PESSOAIS
        ================================================== */}
        <Text style={styles.sectionTitle}>Dados pessoais</Text>

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="account-outline"
                size={22}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Nome completo</Text>
              <Text style={styles.itemValue}>João Silva</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={21}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Telefone</Text>
              <Text style={styles.itemValue}>(61) 99999-9999</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="email-outline"
                size={21}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>E-mail</Text>
              <Text style={styles.itemValue}>joao@email.com</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>

          <View style={[styles.menuItem, styles.lastItem]}>
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="card-account-details-outline"
                size={21}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>CPF</Text>
              <Text style={styles.itemValue}>***.***.***-**</Text>
            </View>
            <View style={styles.lockBadge}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={14}
                color="#888"
              />
              <Text style={styles.lockText}>Protegido</Text>
            </View>
          </View>
        </View>

        {/* ==================================================
            MINHA LOCAÇÃO
        ================================================== */}
        <Text style={styles.sectionTitle}>Minha locação</Text>

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="motorbike"
                size={22}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Minha moto</Text>
              <Text style={styles.itemValue} numberOfLines={1}>
                Honda CG 160 • ABC-1234
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={22}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Contrato de aluguel</Text>
              <Text style={styles.itemValue}>Ver detalhes do contrato</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.lastItem]}
            activeOpacity={0.7}
          >
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={22}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Formas de pagamento</Text>
              <Text style={styles.itemValue}>PIX • Cartão</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>
        </View>

        {/* ==================================================
            CONTA E SEGURANÇA
        ================================================== */}
        <Text style={styles.sectionTitle}>Conta e segurança</Text>

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="file-check-outline"
                size={22}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Documentos</Text>
              <Text style={styles.itemValue}>CNH e documentos da conta</Text>
            </View>
            <View style={styles.documentStatus}>
              <View style={styles.documentDot} />
              <Text style={styles.documentStatusText}>OK</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={22}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Senha</Text>
              <Text style={styles.itemValue}>Alterar senha da conta</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="bell-outline"
                size={22}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Notificações</Text>
              <Text style={styles.itemValue}>
                Alertas de aluguel e pagamentos
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.lastItem]}
            activeOpacity={0.7}
          >
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={22}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Endereço</Text>
              <Text style={styles.itemValue}>Gerenciar endereço</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>
        </View>

        {/* ==================================================
            PREFERÊNCIAS
        ================================================== */}
        <Text style={styles.sectionTitle}>Preferências</Text>

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="translate"
                size={21}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Idioma</Text>
              <Text style={styles.itemValue}>Português (Brasil)</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.lastItem]}
            activeOpacity={0.7}
          >
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={21}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Aparência</Text>
              <Text style={styles.itemValue}>Padrão do sistema</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>
        </View>

        {/* ==================================================
            AJUDA
        ================================================== */}
        <Text style={styles.sectionTitle}>Ajuda</Text>

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={22}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Central de ajuda</Text>
              <Text style={styles.itemValue}>Tire suas dúvidas</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="headset"
                size={22}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Falar com suporte</Text>
              <Text style={styles.itemValue}>Estamos aqui para ajudar</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.lastItem]}
            activeOpacity={0.7}
          >
            <View style={styles.itemIcon}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={22}
                color="#D39B00"
              />
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Termos e privacidade</Text>
              <Text style={styles.itemValue}>Consulte nossas políticas</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#AAA"
            />
          </TouchableOpacity>
        </View>

        {/* ==================================================
            BOTÃO SAIR
        ================================================== */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={20} color="#D64545" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versão 1.0.0</Text>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* ==================================================
          MODAL DOS 3 PONTOS
      ================================================== */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          {/* Alterado para View para impedir toques fantasmas no fundo */}
          <View style={styles.quickMenu}>
            {/* CABEÇALHO */}
            <View style={styles.quickHeader}>
              <View>
                <Text style={styles.quickTitle}>Opções</Text>
                <Text style={styles.quickSubtitle}>Gerencie sua conta</Text>
              </View>

              <IconButton
                icon="close"
                size={21}
                iconColor="#555"
                onPress={() => setMenuVisible(false)}
              />
            </View>

            {/* EDITAR */}
            <TouchableOpacity
              style={styles.quickOption}
              activeOpacity={0.7}
              onPress={() => setMenuVisible(false)}
            >
              <View style={styles.quickIcon}>
                <MaterialCommunityIcons
                  name="account-edit-outline"
                  size={22}
                  color="#D39B00"
                />
              </View>

              <View style={styles.quickText}>
                <Text style={styles.quickOptionTitle}>Editar perfil</Text>
                <Text style={styles.quickOptionDescription}>
                  Atualize seus dados pessoais
                </Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#999"
              />
            </TouchableOpacity>

            {/* SEGURANÇA */}
            <TouchableOpacity
              style={styles.quickOption}
              activeOpacity={0.7}
              onPress={() => setMenuVisible(false)}
            >
              <View style={styles.quickIcon}>
                <MaterialCommunityIcons
                  name="shield-lock-outline"
                  size={22}
                  color="#D39B00"
                />
              </View>

              <View style={styles.quickText}>
                <Text style={styles.quickOptionTitle}>Segurança</Text>
                <Text style={styles.quickOptionDescription}>
                  Proteja sua conta
                </Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#999"
              />
            </TouchableOpacity>

            {/* SUPORTE */}
            <TouchableOpacity
              style={styles.quickOption}
              activeOpacity={0.7}
              onPress={() => setMenuVisible(false)}
            >
              <View style={styles.quickIcon}>
                <MaterialCommunityIcons
                  name="headset"
                  size={22}
                  color="#D39B00"
                />
              </View>

              <View style={styles.quickText}>
                <Text style={styles.quickOptionTitle}>Suporte</Text>
                <Text style={styles.quickOptionDescription}>
                  Precisa de ajuda?
                </Text>
              </View>

              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="#999"
              />
            </TouchableOpacity>

            {/* SAIR */}
            <TouchableOpacity
              style={styles.quickLogout}
              activeOpacity={0.7}
              onPress={handleLogout}
            >
              <View style={styles.deleteIcon}>
                <MaterialCommunityIcons
                  name="logout"
                  size={22}
                  color="#D64545"
                />
              </View>

              <View style={styles.quickText}>
                <Text style={styles.deleteTitle}>Sair da conta</Text>
                <Text style={styles.quickOptionDescription}>
                  Encerrar sua sessão
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <StatusBar style="dark" />
    </View>
  );
}

// Estilos permanecem idênticos aos originais...
/* ==================================================
    ESTILOS
================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7EAE4",
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

  navbarText: {
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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 30,
  },

  profileCard: {
    width: "92%",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",

    elevation: 3,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#FFCC00",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 27,
    fontWeight: "800",
    color: "#171717",
  },

  profileInfo: {
    flex: 1,
    marginLeft: 13,
    minWidth: 0,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
    flexShrink: 1,
  },

  email: {
    fontSize: 11,
    color: "#888",
    marginTop: 3,
  },

  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  verifiedDot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: "#35A65A",
    marginRight: 5,
  },

  verifiedText: {
    fontSize: 10,
    color: "#35A65A",
    fontWeight: "700",
  },

  editProfileButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F0F1EE",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  sectionTitle: {
    width: "92%",
    fontSize: 17,
    fontWeight: "800",
    color: "#1A1A1A",
    marginTop: 23,
    marginBottom: 9,
  },

  menuCard: {
    width: "92%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    overflow: "hidden",

    elevation: 2,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 1,
    },

    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  menuItem: {
    minHeight: 67,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  lastItem: {
    borderBottomWidth: 0,
  },

  itemIcon: {
    width: 39,
    height: 39,
    borderRadius: 11,
    backgroundColor: "#FFF6D8",
    alignItems: "center",
    justifyContent: "center",
  },

  itemContent: {
    flex: 1,
    marginLeft: 11,
    minWidth: 0,
  },

  itemLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 3,
  },

  itemValue: {
    fontSize: 13,
    color: "#222",
    fontWeight: "700",
    flexShrink: 1,
  },

  lockBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 7,
    gap: 3,
  },

  lockText: {
    fontSize: 8,
    color: "#888",
    fontWeight: "700",
  },

  documentStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAF7ED",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
    gap: 4,
  },

  documentDot: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: "#35A65A",
  },

  documentStatusText: {
    color: "#35A65A",
    fontSize: 9,
    fontWeight: "800",
  },

  logoutButton: {
    width: "92%",
    height: 48,
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FFD7D7",
    borderRadius: 11,
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  logoutText: {
    color: "#D64545",
    fontSize: 13,
    fontWeight: "800",
  },

  version: {
    fontSize: 10,
    color: "#AAA",
    marginTop: 15,
  },

  bottomSpace: {
    height: 110,
  },

  /* ==================================================
      MODAL
  ================================================== */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  quickMenu: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 17,
    paddingBottom: 30,
  },

  quickHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  quickTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#171717",
  },

  quickSubtitle: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },

  quickOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#FFF6D8",
    alignItems: "center",
    justifyContent: "center",
  },

  quickText: {
    flex: 1,
    marginLeft: 11,
  },

  quickOptionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222",
  },

  quickOptionDescription: {
    fontSize: 10,
    color: "#999",
    marginTop: 3,
  },

  quickLogout: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    marginTop: 2,
  },

  deleteIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#FFE5E5",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#D64545",
  },
});
