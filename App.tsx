import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import PartialResultScreen from "./PartialResultScreen";
import TeamDetailsScreen from "./TeamDetails";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { TeamScore } from "./Interfaces";

type RootStackParamList = {
  Home: undefined;
  Detalhes: { teamData: TeamScore };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
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
