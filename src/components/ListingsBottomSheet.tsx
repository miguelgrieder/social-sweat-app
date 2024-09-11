import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import React, { useMemo, useRef, useState } from "react"
import { Listing } from "src/interfaces/listing"
import BottomSheet from "@gorhom/bottom-sheet"
import Listings from "src/components/Listings"
import Colors from "src/theme/constants/Colors"
import { Ionicons } from "@expo/vector-icons"

interface Props {
  listings: Listing[]
  category: string
}

const ListingsBottomSheet = ({ listings, category }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [refresh, setRefresh] = useState<number>(0)

  const snapPoints = useMemo(() => ["10%", "100%"], [])

  const onShowMap = () => {
    bottomSheetRef.current?.collapse()
    setRefresh(refresh + 1)
  }

  return (
    <BottomSheet
      index={1}
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: Colors.grey }}
      style={styles.sheetContainer}
    >
      <View style={styles.contentContainer}>
        <Listings listings={listings} category={category} refresh={refresh} />
        <View style={styles.absoluteView}>
          <TouchableOpacity style={styles.btn} onPress={onShowMap}>
            <Text style={{ fontFamily: "sans-serif-medium", color: "#fff" }}>Map</Text>
            <Ionicons name="map" size={20} style={{ marginLeft: 10 }} color={"#fff"} />
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  )
}
const styles = StyleSheet.create({
  absoluteView: {
    alignItems: "center",
    bottom: 30,
    position: "absolute",
    width: "100%",
  },
  btn: {
    alignItems: "center",
    backgroundColor: Colors.dark,
    borderRadius: 30,
    flexDirection: "row",
    height: 50,
    marginHorizontal: "auto",
    padding: 16,
  },
  contentContainer: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: "#fff",
    borderRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
})

export default ListingsBottomSheet
