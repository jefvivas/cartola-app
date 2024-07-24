import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import PartialResultScreen from "./PartialResultScreen";
import TeamDetailsScreen from "./TeamDetails";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home " component={HomeScreen} />
    <Stack.Screen name="Detalhes" component={TeamDetailsScreen} />
  </Stack.Navigator>
);

const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Resultados" component={StackNavigator} />
    <Drawer.Screen name="Parciais" component={PartialResultScreen} />
  </Drawer.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
