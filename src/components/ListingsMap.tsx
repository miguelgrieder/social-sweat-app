import { View, Text, StyleSheet } from 'react-native';
import React, { memo } from 'react';
import { defaultStyles } from '@/constants/Styles';
import { Marker } from 'react-native-maps';
import { Listing } from '@/interfaces/listing';
import { router } from 'expo-router';
import MapView from 'react-native-map-clustering';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '@/constants/spacing';

interface Props {
  listings: Listing[] | null;
}

const INITIAL_REGION = {
  latitude: 52.52,
  longitude: 13.405,
  latitudeDelta: 9,
  longitudeDelta: 9,
};

const onMarkerSelected = (activity: Listing) => {
  router.push(`/listing/${activity.id}`);
};

const ListingsMap = memo(({ listings }: Props) => {
  const renderCluster = (cluster: any) => {
    const { id, geometry, onPress, properties } = cluster;

    const points = properties.point_count;
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
              color: '#000',
              textAlign: 'center',
              fontFamily: 'mon-sb',
            }}
          >
            {points}
          </Text>
        </View>
      </Marker>
    );
  };

  if (!listings) {
    console.log('No listings for Map:', listings);
  } else if (listings.length === 0) {
    console.log('No listings available:', listings);
  } else {
    console.log('Listings loaded for the map:', listings.length);
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
        clusterFontFamily="mon-sb"
        renderCluster={renderCluster}
      >
        {listings?.map((item: Listing) => (
          <Marker
            coordinate={{
              latitude: +item.location.geometry.coordinates.longitude,
              longitude: +item.location.geometry.coordinates.latitude,
            }}
            key={item.id}
            onPress={() => onMarkerSelected(item)}
          >
            <View style={styles.marker}>
              <MaterialCommunityIcons name={item.sport_type} size={20} />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marker: {
    padding: spacing.xs,
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
