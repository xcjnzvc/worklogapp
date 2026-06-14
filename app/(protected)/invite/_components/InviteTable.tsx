import React from "react";
import { View } from "react-native";
import { InviteMobileCard } from "./InviteMobileCard";

const InviteTable = ({ data, onResend }: any) => {
  const getStatusStyle = (status: string) => {
    if (status === "ACCEPTED") return "bg-green-50 text-green-600";
    if (status === "PENDING") return "bg-orange-50 text-orange-600";
    return "bg-red-50 text-red-600";
  };

  return (
    <View>
      <InviteMobileCard
        data={data}
        getStatusStyle={getStatusStyle}
        onResend={onResend}
      />
    </View>
  );
};

export default InviteTable;
