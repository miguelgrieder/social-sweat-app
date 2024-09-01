import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { defaultStyles } from '@/constants/Styles';
import { Marker } from 'react-native-maps';
import { ListingGeo } from '@/interfaces/listingGeo';
import { router } from 'expo-router';
interface Props {
  listings: any;
}

const INITIAL_REGION = {
  latitude: 52.52,
  longitude: 13.405,
  latitudeDelta: 9,
  longitudeDelta: 9,
};

const onMarkerSelected = (event: any) => {
  router.push(`/listing/${event.properties.id}`);
};

const ListingsMap = ({ listings }: Props) => {
  return (
    <View style={defaultStyles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        showsUserLocation
        showsMyLocationButton
        initialRegion={INITIAL_REGION}
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
              <Text style={styles.markerText}>€ {item.properties.price}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  markerText: {
    fontSize: 14,
    fontFamily: 'mon-sb',
  },
});
export default ListingsMap;
