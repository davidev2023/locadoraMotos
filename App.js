import React, { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./src/services/firebaseConfig";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import LoginScreen from "./src/screens/loginScreen";
import Home from "./src/screens/home";
import PagamentosScreen from "./src/screens/pagamentosScreen";
import VistoriasScreen from "./src/screens/vistoriasScreen";
import PerfilScreen from "./src/screens/perfilScreen";
import RentalDetails from "./src/screens/RentalDetails";
import PixScreen from "./src/screens/PixScreen";
import ContractScreen from "./src/screens/ContractScreen";
import InspectionScreen from "./src/screens/InspectionScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* =========================================================
   BOTTOM TABS
========================================================= */

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: "#E5B800",
        tabBarInactiveTintColor: "#777",

        tabBarStyle: {
          position: "absolute",

          bottom: 15,
          left: 12,
          right: 12,

          height: 72,

          backgroundColor: "#FFFFFF",

          borderRadius: 20,
          borderTopWidth: 0,

          elevation: 6,

          shadowColor: "#000",

          shadowOffset: {
            width: 0,
            height: 4,
          },

          shadowOpacity: 0.1,
          shadowRadius: 10,

          paddingTop: 5,
          paddingBottom: 5,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },

        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Início") {
            iconName = focused ? "home" : "home-outline";
          }

          if (route.name === "Pagamentos") {
            iconName = focused ? "credit-card" : "credit-card-outline";
          }

          if (route.name === "Vistorias") {
            iconName = focused ? "clipboard-check" : "clipboard-check-outline";
          }

          if (route.name === "Perfil") {
            iconName = focused ? "account" : "account-outline";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={30} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Início" component={Home} />

      <Tab.Screen name="Pagamentos" component={PagamentosScreen} />

      <Tab.Screen name="Vistorias" component={VistoriasScreen} />

      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });

    return unsubscribe;
  }, []);

  if (carregando) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        id="RootStack"
        screenOptions={{
          headerShown: false,
        }}
      >
        {usuario ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="PixScreen" component={PixScreen} />
            <Stack.Screen name="ContractScreen" component={ContractScreen} />
            <Stack.Screen
              name="InspectionScreen"
              component={InspectionScreen}
            />

            <Stack.Screen name="RentalDetails" component={RentalDetails} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
