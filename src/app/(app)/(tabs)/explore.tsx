import React, { useMemo, useState } from "react"
import { Screen, Text } from "src/components"
import { View, ViewStyle } from "react-native"
import { Stack } from "expo-router"
import ExploreHeader from "src/components/ExploreHeader"
import listingsData from "assets/data/activity-listings.json"
import listingsDataGeo from "assets/data/activity-listings.geo.json"
import ListingsMap from "src/components/ListingsMap"
import ListingsBottomSheet from "src/components/ListingsBottomSheet"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function InboxScreen() {
  const [category, setCategory] = useState<string>("Trending")
  const geoItems = useMemo(() => listingsDataGeo, [])

  const items = useMemo(() => listingsData as any, [])

  const onDataChanged = (category: string) => {
    setCategory(category)
  }

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={$container}
      safeAreaEdges={["top"]}
      // options={{
      //   header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
      // }}
    >
      <ExploreHeader onCategoryChanged={onDataChanged} />

      <GestureHandlerRootView>
        <ListingsMap listings={geoItems} />
        <ListingsBottomSheet listings={items} category={category} />
      </GestureHandlerRootView>
    </Screen>
  )
}
const $container: ViewStyle = {
  flex: 1,
}
