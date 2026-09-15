
import React from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import { MaterialCommunityIcons } from "@expo/vector-icons";


const { width: SCREEN_WIDTH } = Dimensions.get("window");


export default function ContractScreen({ navigation, route }) {

  // =========================================================
  // RECEBER FOTOS ENVIADAS PELA TELA DE ALUGUEL
  // =========================================================

  const fotos = route?.params?.fotos || [];


  return (

    <View style={styles.container}>

      <StatusBar style="dark" />


      {/* =====================================================
          HEADER
      ===================================================== */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >

          <MaterialCommunityIcons
            name="arrow-left"
            size={25}
            color="#171717"
          />

        </TouchableOpacity>


        <Text style={styles.headerTitle}>
          Meu contrato
        </Text>


        <View style={styles.headerSpace} />

      </View>


      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >


        {/* ===================================================
            TÍTULO
        =================================================== */}

        <View style={styles.titleContainer}>

          <View style={styles.iconContainer}>

            <MaterialCommunityIcons
              name="file-document-outline"
              size={30}
              color="#D39B00"
            />

          </View>


          <Text style={styles.title}>
            Contrato de aluguel
          </Text>


          <Text style={styles.subtitle}>
            Confira as fotos do contrato do seu aluguel.
          </Text>

        </View>


        {/* ===================================================
            SE NÃO EXISTIR FOTO
        =================================================== */}

        {fotos.length === 0 ? (

          <View style={styles.emptyCard}>

            <MaterialCommunityIcons
              name="file-alert-outline"
              size={45}
              color="#AAAAAA"
            />

            <Text style={styles.emptyTitle}>
              Contrato não disponível
            </Text>

            <Text style={styles.emptyText}>
              Nenhuma imagem do contrato foi encontrada.
            </Text>

          </View>

        ) : (

          /* ==================================================
             FOTOS
          ================================================== */

          <View style={styles.photosContainer}>

            {fotos.map((url, index) => (

              <View
                style={styles.photoCard}
                key={`${url}-${index}`}
              >

                <View style={styles.photoHeader}>

                  <View style={styles.photoNumber}>

                    <Text style={styles.photoNumberText}>
                      {index + 1}
                    </Text>

                  </View>


                  <Text style={styles.photoTitle}>
                    Página {index + 1}
                  </Text>

                </View>


                <Image
                  source={{ uri: url }}
                  style={styles.contractImage}
                  resizeMode="contain"
                />

              </View>

            ))}

          </View>

        )}


        {/* ===================================================
            AVISO
        =================================================== */}

        {fotos.length > 0 && (

          <View style={styles.infoCard}>

            <MaterialCommunityIcons
              name="shield-check-outline"
              size={21}
              color="#35A65A"
            />


            <Text style={styles.infoText}>
              Este contrato foi disponibilizado pela empresa
              responsável pelo seu aluguel.
            </Text>

          </View>

        )}


      </ScrollView>

    </View>

  );

}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#E7EAE4",
  },


  /* =======================================================
     HEADER
  ======================================================= */

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


  /* =======================================================
     SCROLL
  ======================================================= */

  scrollView: {
    flex: 1,
  },


  content: {
    padding: 16,
    paddingBottom: 50,
  },


  /* =======================================================
     TÍTULO
  ======================================================= */

  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },


  iconContainer: {
    width: 70,
    height: 70,

    borderRadius: 20,

    backgroundColor: "#FFF6D8",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },


  title: {
    color: "#171717",
    fontSize: 22,
    fontWeight: "800",
  },


  subtitle: {
    color: "#888",
    fontSize: 12,

    textAlign: "center",

    marginTop: 5,

    lineHeight: 18,
  },


  /* =======================================================
     FOTOS
  ======================================================= */

  photosContainer: {
    width: "100%",
  },


  photoCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 12,

    marginBottom: 15,

    elevation: 3,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 5,

    overflow: "hidden",
  },


  photoHeader: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 10,
  },


  photoNumber: {
    width: 30,
    height: 30,

    borderRadius: 8,

    backgroundColor: "#FFF6D8",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 8,
  },


  photoNumberText: {
    color: "#D39B00",
    fontSize: 13,
    fontWeight: "800",
  },


  photoTitle: {
    color: "#333",
    fontSize: 14,
    fontWeight: "700",
  },


  contractImage: {
    width: "100%",

    height: SCREEN_WIDTH * 1.25,

    backgroundColor: "#F5F5F5",

    borderRadius: 10,
  },


  /* =======================================================
     SEM CONTRATO
  ======================================================= */

  emptyCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 35,

    alignItems: "center",

    elevation: 3,
  },


  emptyTitle: {
    color: "#333",
    fontSize: 16,
    fontWeight: "700",

    marginTop: 12,
  },


  emptyText: {
    color: "#999",
    fontSize: 12,

    textAlign: "center",

    marginTop: 5,
  },


  /* =======================================================
     AVISO
  ======================================================= */

  infoCard: {
    backgroundColor: "#EAF7ED",

    borderRadius: 12,

    padding: 13,

    flexDirection: "row",
    alignItems: "center",

    marginTop: 2,
  },


  infoText: {
    flex: 1,

    marginLeft: 8,

    color: "#52745A",

    fontSize: 11,

    lineHeight: 16,
  },

});

