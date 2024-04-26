import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import TeamDetailsScreen from "./TeamDetails";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="teamDetails" component={TeamDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
