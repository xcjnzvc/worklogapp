import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeIcon from "@/assets/icon/home.svg";
import ClockIcon from "@/assets/icon/clock.svg";
import VacationIcon from "@/assets/icon/vacation.svg";
import CalendarIcon from "@/assets/icon/calendar.svg";
import DashboardIcon from "@/assets/icon/dashboard.svg";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0029C0",
        tabBarInactiveTintColor: "#717171",
        tabBarStyle: {
          height: 80 + insets.bottom,
          paddingTop: 10,
          paddingBottom: insets.bottom,
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Tabs.Screen
        name="vacation"
        options={{
          title: "휴가",
          tabBarIcon: ({ color, focused }) => (
            <VacationIcon
              width={24}
              height={24}
              stroke={color}
              fill={focused ? color : "none"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "일정",
          tabBarIcon: ({ color, focused }) => (
            <CalendarIcon
              width={24}
              height={24}
              stroke={color}
              fill={focused ? color : "none"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="main"
        options={{
          title: "홈",
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon
              width={24}
              height={24}
              stroke={color}
              fill={focused ? color : "none"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: "근태",
          tabBarIcon: ({ color, focused }) => (
            <ClockIcon
              width={24}
              height={24}
              stroke={color}
              fill={focused ? color : "none"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "더보기",
          tabBarIcon: ({ color, focused }) => (
            <DashboardIcon
              width={24}
              height={24}
              stroke={color}
              fill={focused ? color : "none"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
