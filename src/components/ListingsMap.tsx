import { View, Text, StyleSheet } from "react-native"
import React, { memo } from "react"
import { defaultStyles } from "src/theme/constants/Styles"
import { Marker } from "react-native-maps"
import { ListingGeo } from "src/interfaces/listingGeo"
import { router } from "expo-router"
import MapView from "react-native-map-clustering"
import { MaterialCommunityIcons } from "@expo/vector-icons"

interface Props {
  listings: any
}

const INITIAL_REGION = {
  latitude: 52.52,
  longitude: 13.405,
  latitudeDelta: 9,
  longitudeDelta: 9,
}

const onMarkerSelected = (event: any) => {
  router.push(`/listing/${event.properties.id}`)
}

const ListingsMap = memo(({ listings }: Props) => {
  const renderCluster = (cluster: any) => {
    const { id, geometry, onPress, properties } = cluster

    const points = properties.point_count
    return (
      <Marker
        key={`cluster-${id}`}
        coordinate={{
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        }}
        onPress={onPress}
      >
        <View style={styles.marker}>
          <Text
            style={{
              color: "#000",
              textAlign: "center",
              fontFamily: "sans-serif-medium",
            }}
          >
            {points}
          </Text>
        </View>
      </Marker>
    )
  }

  return (
    <View style={defaultStyles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        showsUserLocation
        showsMyLocationButton
        initialRegion={INITIAL_REGION}
        animationEnabled={false}
        clusterColor="#fff"
        clusterTextColor="#000"
        clusterFontFamily="sans-serif-medium"
        renderCluster={renderCluster}
      >
        {listings.features.map((item: ListingGeo) => (
          <Marker
            coordinate={{
              latitude: +item.properties.latitude,
              longitude: +item.properties.longitude,
            }}
            key={item.properties.id}
            onPress={() => onMarkerSelected(item)}
          >
            <View style={styles.marker}>
              <MaterialCommunityIcons name={item.properties.sport_type} size={20} />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 5,
    justifyContent: "center",
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  markerText: {
    fontFamily: "sans-serif-medium",
    fontSize: 14,
  },
})
export default ListingsMap
