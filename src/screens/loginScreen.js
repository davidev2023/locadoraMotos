import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PaperProvider, TextInput, Button } from "react-native-paper";
import { useState } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../services/firebaseConfig";





const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const [invertido, setInvertido] = useState(false);
  
  const [validaemail, setValidaemail] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");



async function verificarEemail() {
  const emailtratado = email.trim().toLowerCase();

  // Primeira etapa: verificar se o e-mail foi digitado
  if (!validaemail) {
    if (!emailtratado) {
      Alert.alert("Atenção", "Digite seu e-mail.");
      return;
    }

    // Apenas mostra o campo de senha
    setValidaemail(true);
    return;
  }

  // Segunda etapa: fazer login no Firebase
  if (!senha) {
    Alert.alert("Atenção", "Digite sua senha.");
    return;
  }

  try {
    await signInWithEmailAndPassword(
      auth,
      emailtratado,
      senha
    );

    Alert.alert(
      "Sucesso",
      "Usuário logado com sucesso!",
      [
        {
          text: "OK",
          onPress: () => navigation.replace("MainTabs"),
        },
      ]
    );

  } catch (error) {
    console.log("Erro no login:", error);

    if (error.code === "auth/invalid-credential") {
      Alert.alert(
        "Erro",
        "E-mail ou senha incorretos."
      );
    } else if (error.code === "auth/user-not-found") {
      Alert.alert(
        "Erro",
        "Usuário não encontrado."
      );
    } else if (error.code === "auth/wrong-password") {
      Alert.alert(
        "Erro",
        "Senha incorreta."
      );
    } else if (error.code === "auth/invalid-email") {
      Alert.alert(
        "Erro",
        "E-mail inválido."
      );
    } else {
      Alert.alert(
        "Erro",
        "Não foi possível fazer login."
      );
    }
  }
}












  return (
    <PaperProvider>
      <LinearGradient
        colors={["#fdee1b", "#978f18", "#57520e"]}
        style={{ height: SCREEN_HEIGHT, width: "100%" }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              width: "100%",
              marginTop: 40,
            }}
          >
            <Image
              resizeMode="contain"
              source={require("../../assets/logoLocadora.png")}
              style={{
                width: 220,
                height: 200,
                marginTop: 0,
                marginLeft: 20,
                borderRadius: 90,
              }}
            />
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              paddingHorizontal: 12,
              gap: 10,
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 30,
              }}
            >
              Bem-vindo!
            </Text>

            <Text style={{ color: "#ffffffbe", fontSize: 25 }}>
              Faça login para continuar
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              marginTop: 40,
              paddingHorizontal: 30,
              gap: 10,
            }}
          >
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={{
                overflow: "hidden",
                borderTopLeftRadius: 6,
                borderTopRightRadius: 40,
                borderBottomLeftRadius: 40,
                borderBottomRightRadius: 40,
                backgroundColor: "#fff",
                height: 60,
              }}
              mode="flat"
              label="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              activeUnderlineColor="#000000"
              textColor="#000000"
              placeholderTextColor="#dbe916"
              left={<TextInput.Icon icon="email-outline" color="#000000" />}
              theme={{
                colors: {
                  onSurfaceVariant: "#676767",
                },
              }}
            />

            {validaemail && (
              <TextInput
                value={senha}
                onChangeText={setSenha}
                style={{
                  overflow: "hidden",
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 40,
                  borderBottomLeftRadius: 40,
                  borderBottomRightRadius: 40,
                  backgroundColor: "#fff",
                  height: 60,
                  marginBottom: 0,
                }}
                secureTextEntry={true}
                mode="flat"
                label="Password"
                autoCapitalize="none"
                activeUnderlineColor="#000000"
                textColor="#070606"
                left={<TextInput.Icon icon="lock-outline" color="#000000" />}
                theme={{
                  colors: {
                    onSurfaceVariant: "#676767",
                  },
                }}
              />
            )}

            <Button
              mode="contained"
              style={{
                justifyContent: "center",
                backgroundColor: "#c9bd21",
                borderRadius: 20,
                width: "50%",
                alignSelf: "center",
              }}
              contentStyle={{ height: 70, width: "100%" }}
              onPress={() => verificarEemail()}
              labelStyle={{
                fontSize: 25,
                fontWeight: "bold",
                textShadowColor: "#000000",
                textShadowRadius: 3,
                textShadowOffset: { width: 2, height: 2 },
              }}
            >
              Entrar
            </Button>
          </View>

          {/* Divisor com linha e texto OU */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "90%",
              alignSelf: "center",
              marginVertical: 25,
            }}
          >
            {/* Linha esquerda */}
            <LinearGradient
              colors={["transparent", "rgba(255, 254, 254, 0.69)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flex: 1,
                height: 2,
                borderRadius: 10,
              }}
            />

            {/* OU */}
            <View
              style={{
                marginHorizontal: 15,
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 20,
                backgroundColor: "rgba(255, 255, 255, 0.03)",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "#f7f6f6",
                }}
              >
                OU
              </Text>
            </View>

            {/* Linha direita */}
            <LinearGradient
              colors={["rgba(255, 254, 254, 0.69)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flex: 1,
                height: 2,
                borderRadius: 10,
              }}
            />
          </View>

          <Button
            style={{ marginTop: 0, width: 100 }}
            icon={() => (
              <Image
                source={require("../../assets/down.png")}
                style={{
                  width: 18,
                  height: 18,
                  tintColor: "#ffffff",
                  transform: [{ scaleY: invertido ? -1 : 1 }],
                }}
                resizeMode="contain"
              />
            )}
            contentStyle={{ flexDirection: "row-reverse" }}
            labelStyle={{ color: "#fff" }}
            onPress={() => setInvertido(!invertido)}
          >
            Ajuda
          </Button>
          {invertido && (
            <View style={{ gap: 10, alignItems: "center" }}>
              <TouchableOpacity>
                <Text
                  style={{ textDecorationLine: "underline", color: "#fff" }}
                >
                  Esqueceu o e-mail ou número de celular?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text
                  style={{ textDecorationLine: "underline", color: "#fff" }}
                >
                  Saiba mais sobre como entrar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </LinearGradient>

      <StatusBar style="auto" />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({});
