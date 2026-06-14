import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import { ChevronDown } from "lucide-react-native";

interface DropdownProps {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  /**
   * 실제로 보이는 버튼(TouchableOpacity)에 적용되는 className.
   * 넘기지 않으면 기본 스타일(흰 배경 + 그림자)이 적용됩니다.
   * 넘기면 기본 스타일은 빠지고 전달한 className만 적용됩니다.
   */
  className?: string;
}

export default function Dropdown({
  value,
  options,
  onSelect,
  className,
}: DropdownProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<View>(null);

  // Android에서 measureInWindow가 상태바 높이를 포함한 좌표를 반환하는 반면
  // Modal은 상태바 아래부터 좌표가 시작되는 경우가 있어 오차가 생길 수 있음
  const statusBarOffset =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

  const openDropdown = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({
        top: y + height + 4 - statusBarOffset,
        left: x,
        width,
      });
      setVisible(true);
    });
  };

  const buttonClassName = `h-14 rounded-2xl px-4 flex-row justify-between items-center ${
    className || "bg-white shadow-sm shadow-gray-200"
  }`;

  return (
    <>
      <View ref={buttonRef} className="flex-1">
        <TouchableOpacity
          onPress={openDropdown}
          activeOpacity={0.8}
          className={buttonClassName}
        >
          <Text className="text-[#333] font-medium">{value}</Text>
          <ChevronDown size={16} color="#BDBDBD" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setVisible(false)}>
          <View
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              width: position.width,
            }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                className="px-4 py-3 border-b border-gray-50"
                onPress={() => {
                  onSelect(option);
                  setVisible(false);
                }}
              >
                <Text className="text-[#333]">{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
