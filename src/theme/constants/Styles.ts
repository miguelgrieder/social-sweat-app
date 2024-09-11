import Colors from "src/theme/constants/Colors"
import { StyleSheet } from "react-native"

export const defaultStyles = StyleSheet.create({
  btn: {
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 50,
    justifyContent: "center",
  },
  btnIcon: {
    left: 16,
    position: "absolute",
  },
  btnText: {
    color: "#fff",
    fontFamily: "sans-serif-medium", // TODO: bold
    fontSize: 16,
  },
  container: {
    backgroundColor: "#FDFFFF",
    flex: 1,
  },
  footer: {
    backgroundColor: "#fff",
    borderTopColor: Colors.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
    bottom: 0,
    height: 100,
    left: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    position: "absolute",
    right: 0,
  },
  inputField: {
    backgroundColor: "#fff",
    borderColor: "#ABABAB",
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    padding: 10,
  },
})
