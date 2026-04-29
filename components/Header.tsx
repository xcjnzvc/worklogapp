import { View, Text, Image } from "react-native";
import MenuIcon from "@/assets/icon/menu.svg";
import AlarmIcon from "@/assets/icon/alarm-bell.svg";
import SettingIcon from "@/assets/icon/setting.svg";

export default function Header() {
  return (
    <View className="w-full pt-[50px] pb-[20px]  flex-row items-center justify-between px-4 rounded-bl-[12px] rounded-br-[12px]">
      <Text className=" font-extrabold text-[18px]">WorkLog</Text>
      <View className="flex-row gap-[14px]">
        <AlarmIcon width={22} height={22} />
        <SettingIcon width={22} height={22} />
      </View>
    </View>
  );
}
