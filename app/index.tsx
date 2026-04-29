import "expo-router/entry";
import "../global.css";
import { Redirect } from "expo-router";
import { useUserStore } from "@/store/useUserStore";

export default function Index() {
  const { isLoggedIn, isRestoring } = useUserStore();

  if (isRestoring) return null;

  return <Redirect href={isLoggedIn ? "/(protected)/main" : "/(auth)"} />;
}
