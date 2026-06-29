import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LearnScreen } from "../screens/LearnScreen";
import { AddWordScreen } from "../screens/AddWordScreen";
import { SearchScreen } from "../screens/SearchScreen";
import { COLORS } from "../constants/theme";

const Tab = createBottomTabNavigator();

function getTabIcon(routeName, focused) {
  if (routeName === "Học từ vựng") {
    return focused ? "school" : "school-outline";
  }

  if (routeName === "Thêm từ mới") {
    return focused ? "add-circle" : "add-circle-outline";
  }

  return focused ? "search" : "search-outline";
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          color: COLORS.textPrimary,
          fontWeight: "700",
        },
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.surface,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#9D8B7D",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={getTabIcon(route.name, focused)}
            color={color}
            size={size}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Học từ vựng"
        component={LearnScreen}
        options={{
          title: "Học từ vựng",
        }}
      />
      <Tab.Screen
        name="Thêm từ mới"
        component={AddWordScreen}
        options={{
          title: "Thêm từ mới",
        }}
      />
      <Tab.Screen
        name="Tìm kiếm"
        component={SearchScreen}
        options={{
          title: "Tìm kiếm từ vựng",
        }}
      />
    </Tab.Navigator>
  );
}
