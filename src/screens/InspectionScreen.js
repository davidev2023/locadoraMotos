
import React, { useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import * as ImagePicker from "expo-image-picker";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  doc,
  addDoc,
  collection,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../services/firebaseConfig";

// ============================================================
// CLOUDINARY
// ============================================================

const CLOUDINARY_CLOUD_NAME = "pyc9deyg";
const CLOUDINARY_UPLOAD_PRESET = "locadora";

// ============================================================
// ETAPAS DA VISTORIA
// ============================================================

const ETAPAS = [
  {
    id: "lateralEsquerda",
    titulo: "Lateral esquerda",
    descricao: "Mostre toda a lateral esquerda da moto.",
    icon: "motorbike",
  },
  {
    id: "lateralDireita",
    titulo: "Lateral direita",
    descricao: "Mostre toda a lateral direita da moto.",
    icon: "motorbike",
  },
  {
    id: "frente",
    titulo: "Frente da moto",
    descricao:
      "Fotografe a moto de frente mostrando toda a parte frontal.",
    icon: "arrow-up-bold",
  },
  {
    id: "traseira",
    titulo: "Traseira da moto",
    descricao: "Fotografe a traseira completa da moto.",
    icon: "arrow-down-bold",
  },
  {
    id: "pneuDianteiro",
    titulo: "Pneu dianteiro",
    descricao:
      "Mostre claramente o pneu dianteiro e seu estado.",
    icon: "tire",
  },
  {
    id: "pneuTraseiro",
    titulo: "Pneu traseiro",
    descricao:
      "Mostre claramente o pneu traseiro e seu estado.",
    icon: "tire",
  },
  {
    id: "painelKm",
    titulo: "Painel e KM total",
    descricao:
      "Ligue o painel e mostre claramente a quilometragem total.",
    icon: "speedometer",
  },
  {
    id: "tripOleo",
    titulo: "Trip / indicador de óleo",
    descricao:
      "Mostre o Trip e o indicador de óleo no painel.",
    icon: "oil",
  },
];

// ============================================================
// DATA DA VISTORIA
// ============================================================

function obterDataVistoria() {
  const agora = new Date();

  const dia = String(agora.getDate()).padStart(2, "0");
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const ano = agora.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

// ============================================================
// TELA
// ============================================================

export default function InspectionScreen({
  navigation,
  route,
}) {
  // ==========================================================
  // ID DO ALUGUEL
  // ==========================================================

  const aluguelId =
    route?.params?.aluguelId || "aluguel-teste";

  // ==========================================================
  // ESTADOS
  // ==========================================================

  const [etapaAtual, setEtapaAtual] = useState(0);

  const [fotos, setFotos] = useState({});

  const [abrindoCamera, setAbrindoCamera] =
    useState(false);

  const [enviando, setEnviando] =
    useState(false);

  // ==========================================================
  // ETAPA ATUAL
  // ==========================================================

  const etapa = ETAPAS[etapaAtual];

  const fotoAtual = fotos[etapa.id];

  const progresso =
    ((etapaAtual + 1) / ETAPAS.length) * 100;

  // ==========================================================
  // TIRAR FOTO
  // ==========================================================

  async function tirarFoto() {
    if (abrindoCamera || enviando) {
      return;
    }

    try {
      setAbrindoCamera(true);

      console.log(
        "================================="
      );

      console.log("ABRINDO CÂMERA");
      console.log("ALUGUEL:", aluguelId);
      console.log("ETAPA:", etapa.titulo);

      // ------------------------------------------------------
      // PERMISSÃO
      // ------------------------------------------------------

      const permissao =
        await ImagePicker.requestCameraPermissionsAsync();

      console.log(
        "Permissão câmera:",
        permissao.granted
      );

      if (!permissao.granted) {
        Alert.alert(
          "Permissão necessária",
          "Permita o acesso à câmera para realizar a vistoria."
        );

        return;
      }

      // ------------------------------------------------------
      // ABRIR CÂMERA
      // ------------------------------------------------------

      const resultado =
        await ImagePicker.launchCameraAsync({
          mediaTypes:
            ImagePicker.MediaTypeOptions.Images,

          allowsEditing: false,

          quality: 0.8,

          exif: false,
        });

      console.log(
        "Resultado câmera:",
        resultado
      );

      // ------------------------------------------------------
      // CANCELADO
      // ------------------------------------------------------

      if (resultado.canceled) {
        console.log(
          "Usuário cancelou a câmera."
        );

        return;
      }

      // ------------------------------------------------------
      // IMAGEM
      // ------------------------------------------------------

      const imagem =
        resultado.assets?.[0];

      if (!imagem?.uri) {
        Alert.alert(
          "Erro",
          "A câmera não retornou uma imagem válida."
        );

        return;
      }

      console.log(
        "Imagem capturada:",
        imagem.uri
      );

      // ------------------------------------------------------
      // SALVAR LOCALMENTE
      // ------------------------------------------------------

      setFotos((prev) => ({
        ...prev,
        [etapa.id]: imagem.uri,
      }));

      console.log(
        `Foto "${etapa.id}" salva localmente.`
      );

    } catch (error) {
      console.log(
        "ERRO AO TIRAR FOTO:",
        error
      );

      Alert.alert(
        "Erro",
        error?.message ||
          "Não foi possível abrir a câmera."
      );

    } finally {
      setAbrindoCamera(false);
    }
  }

  // ==========================================================
  // REFAZER FOTO
  // ==========================================================

  function refazerFoto() {
    if (enviando || abrindoCamera) {
      return;
    }

    Alert.alert(
      "Refazer foto",
      `Deseja tirar novamente a foto de "${etapa.titulo}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },

        {
          text: "Refazer",
          onPress: async () => {
            setFotos((prev) => {
              const novasFotos = {
                ...prev,
              };

              delete novasFotos[etapa.id];

              return novasFotos;
            });

            setTimeout(() => {
              tirarFoto();
            }, 300);
          },
        },
      ]
    );
  }

  // ==========================================================
  // PRÓXIMA ETAPA
  // ==========================================================

  function proximaEtapa() {
    if (enviando) {
      return;
    }

    if (!fotoAtual) {
      Alert.alert(
        "Foto obrigatória",
        `Tire a foto de "${etapa.titulo}" antes de continuar.`
      );

      return;
    }

    // --------------------------------------------------------
    // PRÓXIMA FOTO
    // --------------------------------------------------------

    if (etapaAtual < ETAPAS.length - 1) {
      setEtapaAtual(
        (prev) => prev + 1
      );

      return;
    }

    // --------------------------------------------------------
    // ÚLTIMA FOTO
    // --------------------------------------------------------

    enviarVistoria();
  }

  // ==========================================================
  // ETAPA ANTERIOR
  // ==========================================================

  function etapaAnterior() {
    if (enviando || abrindoCamera) {
      return;
    }

    if (etapaAtual > 0) {
      setEtapaAtual(
        (prev) => prev - 1
      );

      return;
    }

    navigation.goBack();
  }

  // ==========================================================
  // UPLOAD CLOUDINARY
  // ==========================================================

  async function enviarParaCloudinary(
    uri,
    numero
  ) {
    console.log(
      "================================="
    );

    console.log(
      `UPLOAD CLOUDINARY ${numero}/${ETAPAS.length}`
    );

    console.log(
      "URI LOCAL:",
      uri
    );

    const nomeArquivo =
      `vistoria_${aluguelId}_${numero}_${Date.now()}.jpg`;

    const formData =
      new FormData();

    formData.append(
      "file",
      {
        uri,
        type: "image/jpeg",
        name: nomeArquivo,
      }
    );

    formData.append(
      "upload_preset",
      CLOUDINARY_UPLOAD_PRESET
    );

    const resposta =
      await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

    const dados =
      await resposta.json();

    console.log(
      "RESPOSTA CLOUDINARY:",
      dados
    );

    if (!resposta.ok) {
      throw new Error(
        dados?.error?.message ||
          "Erro ao enviar imagem para o Cloudinary."
      );
    }

    if (!dados?.secure_url) {
      throw new Error(
        "Cloudinary não retornou a URL da imagem."
      );
    }

    console.log(
      "UPLOAD CONCLUÍDO:",
      dados.secure_url
    );

    return dados.secure_url;
  }

  // ==========================================================
  // ENVIAR VISTORIA
  // ==========================================================

  async function enviarVistoria() {
    if (enviando) {
      return;
    }

    // --------------------------------------------------------
    // VERIFICAR AS 8 FOTOS
    // --------------------------------------------------------

    const faltando =
      ETAPAS.filter(
        (item) => !fotos[item.id]
      );

    if (faltando.length > 0) {
      Alert.alert(
        "Vistoria incompleta",
        "Você precisa tirar as 8 fotos antes de enviar."
      );

      return;
    }

    try {
      setEnviando(true);

      console.log(
        "================================="
      );

      console.log(
        "INICIANDO ENVIO DA VISTORIA"
      );

      console.log(
        "ALUGUEL:",
        aluguelId
      );

      // ------------------------------------------------------
      // DATA
      // ------------------------------------------------------

      const dataVistoria =
        obterDataVistoria();

      // ------------------------------------------------------
      // OBJETO DE URLS
      // ------------------------------------------------------

      const urls = {};

      // ------------------------------------------------------
      // UPLOAD DAS 8 FOTOS
      // ------------------------------------------------------

      for (
        let i = 0;
        i < ETAPAS.length;
        i++
      ) {
        const item =
          ETAPAS[i];

        const uri =
          fotos[item.id];

        if (!uri) {
          throw new Error(
            `A foto "${item.titulo}" não foi encontrada.`
          );
        }

        console.log(
          `Enviando ${i + 1}/${ETAPAS.length}: ${item.titulo}`
        );

        const url =
          await enviarParaCloudinary(
            uri,
            i + 1
          );

        urls[item.id] = url;
      }

      console.log(
        "TODAS AS FOTOS FORAM ENVIADAS."
      );

      // ------------------------------------------------------
      // CRIAR VISTORIA
      // ------------------------------------------------------

      const vistoriaRef =
        await addDoc(
          collection(
            db,
            "vistorias"
          ),
          {
            aluguelId,

            dataVistoria,

            status: "enviada",

            motivoRejeicao: "",

            fotos: {
              lateralEsquerda:
                urls.lateralEsquerda,

              lateralDireita:
                urls.lateralDireita,

              frente:
                urls.frente,

              traseira:
                urls.traseira,

              pneuDianteiro:
                urls.pneuDianteiro,

              pneuTraseiro:
                urls.pneuTraseiro,

              painelKm:
                urls.painelKm,

              tripOleo:
                urls.tripOleo,
            },

            enviadaEm:
              serverTimestamp(),

            analisadaEm: null,

            adminId: "",
          }
        );

      console.log(
        "VISTORIA CRIADA:",
        vistoriaRef.id
      );

      // ------------------------------------------------------
      // ATUALIZAR ALUGUEL
      // ------------------------------------------------------

      const aluguelRef =
        doc(
          db,
          "alugueis",
          aluguelId
        );

      await updateDoc(
        aluguelRef,
        {
          "vistoria.status":
            "enviada",

          "vistoria.vistoriaId":
            vistoriaRef.id,

          "vistoria.dataVistoria":
            dataVistoria,

          "vistoria.motivoRejeicao":
            "",

          "vistoria.fotos":
            urls,

          "vistoria.enviadaEm":
            serverTimestamp(),
        }
      );

      console.log(
        "ALUGUEL ATUALIZADO COM A VISTORIA."
      );

      console.log(
        "================================="
      );

      // ------------------------------------------------------
      // SUCESSO
      // ------------------------------------------------------

      Alert.alert(
        "Vistoria enviada! ✓",
        "As 8 fotos foram enviadas com sucesso. Agora a vistoria está aguardando análise.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );

    } catch (error) {
      console.log(
        "================================="
      );

      console.log(
        "ERRO AO ENVIAR VISTORIA:"
      );

      console.log(
        error
      );

      console.log(
        "================================="
      );

      Alert.alert(
        "Erro ao enviar",
        error?.message ||
          "Não foi possível enviar a vistoria. Tente novamente."
      );

    } finally {
      setEnviando(false);
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <View style={styles.container}>

      <StatusBar style="dark" />

      {/* ====================================================
          HEADER
      ==================================================== */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={etapaAnterior}
          disabled={
            enviando ||
            abrindoCamera
          }
          activeOpacity={0.7}
        >

          <MaterialCommunityIcons
            name="arrow-left"
            size={25}
            color="#171717"
          />

        </TouchableOpacity>

        <View style={styles.headerCenter}>

          <Text style={styles.headerTitle}>
            Vistoria semanal
          </Text>

          <Text style={styles.headerStep}>
            {etapaAtual + 1} de {ETAPAS.length}
          </Text>

        </View>

        <View style={styles.headerSpace} />

      </View>

      {/* ====================================================
          PROGRESSO
      ==================================================== */}

      <View style={styles.progressBackground}>

        <View
          style={[
            styles.progressBar,
            {
              width: `${progresso}%`,
            },
          ]}
        />

      </View>

      {/* ====================================================
          CONTEÚDO
      ==================================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >

        {/* ÍCONE */}

        <View style={styles.mainIcon}>

          <MaterialCommunityIcons
            name={etapa.icon}
            size={38}
            color="#D39B00"
          />

        </View>

        {/* ETAPA */}

        <Text style={styles.stepLabel}>
          FOTO {etapaAtual + 1} DE {ETAPAS.length}
        </Text>

        <Text style={styles.title}>
          {etapa.titulo}
        </Text>

        <Text style={styles.subtitle}>
          {etapa.descricao}
        </Text>

        {/* ==================================================
            INFORMAÇÃO
        ================================================== */}

        <View style={styles.infoBox}>

          <MaterialCommunityIcons
            name="camera-outline"
            size={21}
            color="#D39B00"
          />

          <Text style={styles.infoText}>
            Tire a foto pela câmera. Ela ficará
            guardada nesta vistoria e será enviada
            somente quando as 8 fotos estiverem prontas.
          </Text>

        </View>

        {/* ==================================================
            ÁREA DA FOTO
        ================================================== */}

        <View style={styles.photoBox}>

          {fotoAtual ? (
            <>
              <MaterialCommunityIcons
                name="check-circle"
                size={65}
                color="#35A65A"
              />

              <Text
                style={
                  styles.photoDoneTitle
                }
              >
                Foto capturada!
              </Text>

              <Text
                style={
                  styles.photoDoneText
                }
              >
                A foto desta etapa foi salva.
              </Text>

              <View
                style={
                  styles.fileInfo
                }
              >

                <MaterialCommunityIcons
                  name="image-check-outline"
                  size={18}
                  color="#35A65A"
                />

                <Text
                  style={
                    styles.fileInfoText
                  }
                >
                  Foto pronta para envio
                </Text>

              </View>
            </>
          ) : (
            <>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={60}
                color="#C4C6C1"
              />

              <Text
                style={
                  styles.emptyPhotoTitle
                }
              >
                Foto ainda não tirada
              </Text>

              <Text
                style={
                  styles.emptyPhotoText
                }
              >
                Toque no botão abaixo para abrir
                a câmera.
              </Text>
            </>
          )}

        </View>

        {/* ==================================================
            TIRAR FOTO
        ================================================== */}

        {!fotoAtual && (

          <TouchableOpacity
            style={[
              styles.cameraButton,
              abrindoCamera &&
                styles.disabledButton,
            ]}
            activeOpacity={0.8}
            onPress={tirarFoto}
            disabled={
              abrindoCamera ||
              enviando
            }
          >

            {abrindoCamera ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Abrindo câmera...
                </Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons
                  name="camera"
                  size={24}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Tirar foto
                </Text>
              </>
            )}

          </TouchableOpacity>

        )}

        {/* ==================================================
            REFAZER
        ================================================== */}

        {fotoAtual && (

          <TouchableOpacity
            style={
              styles.retakeButton
            }
            activeOpacity={0.8}
            onPress={refazerFoto}
            disabled={
              enviando ||
              abrindoCamera
            }
          >

            <MaterialCommunityIcons
              name="camera-retake-outline"
              size={22}
              color="#FFFFFF"
            />

            <Text
              style={
                styles.buttonText
              }
            >
              Tirar outra foto
            </Text>

          </TouchableOpacity>

        )}

        {/* ==================================================
            PRÓXIMA / ENVIAR
        ================================================== */}

        {fotoAtual && (

          <TouchableOpacity
            style={[
              styles.nextButton,
              enviando &&
                styles.disabledButton,
            ]}
            activeOpacity={0.8}
            onPress={proximaEtapa}
            disabled={enviando}
          >

            {enviando ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Enviando 8 fotos...
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  {etapaAtual ===
                  ETAPAS.length - 1
                    ? "Enviar vistoria"
                    : "Próxima foto"}
                </Text>

                <MaterialCommunityIcons
                  name={
                    etapaAtual ===
                    ETAPAS.length - 1
                      ? "cloud-upload-outline"
                      : "arrow-right"
                  }
                  size={22}
                  color="#FFFFFF"
                />
              </>
            )}

          </TouchableOpacity>

        )}

        {/* ==================================================
            INDICADORES
        ================================================== */}

        <View
          style={
            styles.stepsContainer
          }
        >

          {ETAPAS.map(
            (item, index) => {

              const concluida =
                !!fotos[item.id];

              const atual =
                index === etapaAtual;

              return (
                <View
                  key={item.id}
                  style={
                    styles.stepItem
                  }
                >

                  <View
                    style={[
                      styles.stepCircle,

                      concluida &&
                        styles.stepCircleDone,

                      atual &&
                        styles.stepCircleCurrent,
                    ]}
                  >

                    {concluida ? (
                      <MaterialCommunityIcons
                        name="check"
                        size={14}
                        color="#FFFFFF"
                      />
                    ) : (
                      <Text
                        style={[
                          styles.stepNumber,
                          atual &&
                            styles.stepNumberCurrent,
                        ]}
                      >
                        {index + 1}
                      </Text>
                    )}

                  </View>

                </View>
              );
            }
          )}

        </View>

        {/* ==================================================
            SEGURANÇA
        ================================================== */}

        <View
          style={
            styles.secureContainer
          }
        >

          <MaterialCommunityIcons
            name="shield-check-outline"
            size={18}
            color="#35A65A"
          />

          <Text
            style={
              styles.secureText
            }
          >
            As fotos serão enviadas somente ao finalizar
          </Text>

        </View>

      </ScrollView>

    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#E7EAE4",
  },

  header: {
    height: 95,
    paddingTop: 35,
    paddingHorizontal: 18,

    backgroundColor: "#FBFBFB",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    elevation: 4,

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

  headerCenter: {
    alignItems: "center",
  },

  headerTitle: {
    color: "#171717",
    fontSize: 19,
    fontWeight: "700",
  },

  headerStep: {
    color: "#888",
    fontSize: 11,
    marginTop: 2,
  },

  headerSpace: {
    width: 42,
  },

  progressBackground: {
    width: "100%",
    height: 4,
    backgroundColor: "#DCDDDA",
  },

  progressBar: {
    height: 4,
    backgroundColor: "#FFCC00",
  },

  content: {
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 70,
  },

  mainIcon: {
    width: 76,
    height: 76,
    borderRadius: 23,

    backgroundColor: "#FFF6D8",

    alignItems: "center",
    justifyContent: "center",
  },

  stepLabel: {
    color: "#D39B00",
    fontSize: 10,
    fontWeight: "800",

    marginTop: 16,

    letterSpacing: 1,
  },

  title: {
    marginTop: 5,

    color: "#171717",

    fontSize: 24,

    fontWeight: "800",

    textAlign: "center",
  },

  subtitle: {
    width: "86%",

    textAlign: "center",

    color: "#888",

    fontSize: 13,

    lineHeight: 19,

    marginTop: 7,
  },

  infoBox: {
    width: "92%",

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#FFF8E3",

    borderRadius: 12,

    paddingHorizontal: 14,

    paddingVertical: 12,

    marginTop: 17,
  },

  infoText: {
    flex: 1,

    color: "#806F4D",

    fontSize: 11,

    lineHeight: 17,

    fontWeight: "600",

    marginLeft: 9,
  },

  photoBox: {
    width: "92%",

    height: 270,

    backgroundColor: "#F5F6F3",

    borderRadius: 16,

    borderWidth: 1,

    borderColor: "#DCDDDA",

    borderStyle: "dashed",

    marginTop: 18,

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 25,
  },

  emptyPhotoTitle: {
    color: "#777",

    fontSize: 14,

    fontWeight: "700",

    marginTop: 10,
  },

  emptyPhotoText: {
    color: "#999",

    fontSize: 11,

    textAlign: "center",

    marginTop: 5,
  },

  photoDoneTitle: {
    color: "#35A65A",

    fontSize: 18,

    fontWeight: "800",

    marginTop: 10,
  },

  photoDoneText: {
    color: "#777",

    fontSize: 12,

    marginTop: 5,
  },

  fileInfo: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#EAF7EE",

    paddingHorizontal: 13,

    paddingVertical: 8,

    borderRadius: 20,

    marginTop: 14,
  },

  fileInfoText: {
    color: "#35A65A",

    fontSize: 11,

    fontWeight: "700",

    marginLeft: 6,
  },

  cameraButton: {
    width: "92%",

    height: 53,

    backgroundColor: "#35A65A",

    borderRadius: 12,

    marginTop: 16,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,
  },

  retakeButton: {
    width: "92%",

    height: 50,

    backgroundColor: "#555",

    borderRadius: 12,

    marginTop: 16,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,
  },

  nextButton: {
    width: "92%",

    height: 53,

    backgroundColor: "#35A65A",

    borderRadius: 12,

    marginTop: 10,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",

    fontSize: 15,

    fontWeight: "800",
  },

  stepsContainer: {
    width: "92%",

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginTop: 25,
  },

  stepItem: {
    alignItems: "center",

    justifyContent: "center",
  },

  stepCircle: {
    width: 27,

    height: 27,

    borderRadius: 14,

    backgroundColor: "#DCDDDA",

    alignItems: "center",

    justifyContent: "center",
  },

  stepCircleCurrent: {
    backgroundColor: "#FFF0B3",

    borderWidth: 2,

    borderColor: "#D39B00",
  },

  stepCircleDone: {
    backgroundColor: "#35A65A",
  },

  stepNumber: {
    color: "#888",

    fontSize: 10,

    fontWeight: "700",
  },

  stepNumberCurrent: {
    color: "#D39B00",
  },

  secureContainer: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 20,

    gap: 6,
  },

  secureText: {
    color: "#777",

    fontSize: 11,
  },

});
