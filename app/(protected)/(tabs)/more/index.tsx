import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SectionList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const MENU_SECTIONS = [
  {
    title: "",
    data: [
      { label: "내 계좌", route: "my-account" },
      { label: "내 신용정보", route: "my-credit" },
    ],
  },
  {
    title: "이체/출금",
    data: [
      { label: "이체", route: "transfer" },
      { label: "다건이체", route: "transfer-multiple" },
      { label: "자동이체", route: "transfer-auto" },
      { label: "이체내역 조회", route: "transfer-history" },
      { label: "ATM 스마트출금", route: "atm-withdrawal" },
    ],
  },
];

export default function More() {
  const router = useRouter();

  return (
    <SectionList
      sections={MENU_SECTIONS}
      keyExtractor={(item) => item.route}
      renderSectionHeader={({ section: { title } }) =>
        title ? (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        ) : (
          <View style={styles.sectionSpacer} />
        )
      }
      renderItem={({ item, index, section }) => {
        const isLast = index === section.data.length - 1;
        return (
          <TouchableOpacity
            style={[styles.menuItem, isLast && styles.menuItemLast]}
            onPress={() => router.push(`/more/${item.route}`)}
            activeOpacity={0.6}
          >
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#C4C4C4" />
          </TouchableOpacity>
        );
      }}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    backgroundColor: "#F5F5F5",
  },
  sectionHeaderText: { fontSize: 13, color: "#888", fontWeight: "500" },
  sectionSpacer: { height: 8 },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E8E8E8",
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuLabel: { fontSize: 16, color: "#111" },
});
