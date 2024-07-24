import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import { View, Text } from "react-native";

import TeamDetailsScreen from "./TeamDetails";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

const FirstScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Home Screen</Text>
  </View>
);

const NotificationsScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Notifications Screen</Text>
  </View>
);
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Pontuação">
        <Stack.Screen name="Pontuação" component={HomeScreen} />
        <Stack.Screen name="Detalhes" component={TeamDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
