import { useState } from "react"
import { View, TouchableOpacity, Text } from "react-native"
import Colors from "src/theme/constants/Colors"

const ModalHeaderText = () => {
  const [active, setActive] = useState(0)
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}>
      <TouchableOpacity onPress={() => setActive(0)}>
        <Text
          style={{
            fontFamily: "sans-serif-medium",
            fontSize: 18,
            color: active == 0 ? "#000" : Colors.grey,
            textDecorationLine: active == 0 ? "underline" : "none",
          }}
        >
          Activities
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setActive(1)}>
        <Text
          style={{
            fontFamily: "sans-serif-medium",
            fontSize: 18,
            color: active == 1 ? "#000" : Colors.grey,
            textDecorationLine: active == 1 ? "underline" : "none",
          }}
        >
          Coaches
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ModalHeaderText
