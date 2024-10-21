import { View, Text, StyleSheet } from 'react-native';
import React, { memo } from 'react';
import { defaultStyles } from '@/constants/Styles';
import { Marker } from 'react-native-maps';
import { Activity } from '@/interfaces/activity';
import { router } from 'expo-router';
import MapView from 'react-native-map-clustering';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '@/constants/spacing';
import { sportTypeIconMappings } from '@/constants/sportTypeIconMappings';
import Colors from '@/constants/Colors';

interface Props {
  activities: Activity[] | null;
}

const INITIAL_REGION = {
  latitude: -27.598,
  longitude: -48.4892,
  latitudeDelta: 1,
  longitudeDelta: 1,
};

const onMarkerSelected = (activity: Activity) => {
  router.push(`/activity/${activity.id}`);
};

const ActivitiesMap = memo(({ activities }: Props) => {
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
              color: Colors.primary,
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

  if (!activities) {
    console.log('No activities for Map:', activities);
  } else if (activities.length === 0) {
    console.log('No activities available:', activities);
  } else {
    console.log('ActivitiesBottomSheetList loaded for the map:', activities.length);
  }

  return (
    <View style={defaultStyles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        showsUserLocation
        showsMyLocationButton
        initialRegion={INITIAL_REGION}
        animationEnabled={false}
        clusterColor={Colors.primary}
        clusterTextColor={Colors.primary_light}
        clusterFontFamily="mon-sb"
        renderCluster={renderCluster}
      >
        {activities?.map((item: Activity) => (
          <Marker
            coordinate={{
              latitude: +item.location.geometry.coordinates.latitude,
              longitude: +item.location.geometry.coordinates.longitude,
            }}
            key={item.id}
            onPress={() => onMarkerSelected(item)}
          >
            <View style={styles.marker}>
              <MaterialCommunityIcons
                name={sportTypeIconMappings[item.sport_type]}
                size={20}
                color={Colors.primary}
              />
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
    backgroundColor: Colors.primary_light,
    borderColor: Colors.primary,
    elevation: 5,
    borderRadius: 12,
    borderWidth: 1,
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
export default ActivitiesMap;
