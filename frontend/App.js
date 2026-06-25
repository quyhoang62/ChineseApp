import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { VocabularyProvider } from "./src/context/VocabularyContext";
import { TabNavigator } from "./src/navigation/TabNavigator";

export default function App() {
  return (
    <VocabularyProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <TabNavigator />
      </NavigationContainer>
    </VocabularyProvider>
  );
}
