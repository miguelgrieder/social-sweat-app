import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import Geocoder from 'react-native-geocoding';
import { Screen } from 'src/components/Screen';
import { spacing } from '@/constants/spacing';
import Colors from '@/constants/Colors';
import { createActivity } from '@/api/createActivity';
import { useAuth } from '@clerk/clerk-expo';
import { translate } from '@/app/services/translate';
import { capitalize } from '@/utils/utils';
import { defaultStyles } from '@/constants/Styles';
import { useNavigation } from 'expo-router';
import { ActivityType, SportType } from '@/interfaces/activity';
import RNPickerSelect from 'react-native-picker-select';

Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);

const CreateActivity = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: translate('create_activity_screen.title') });
  }, [navigation]);

  const { signOut, isSignedIn } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityType, setActivityType] = useState('Public Spot');
  const [priceValue, setPriceValue] = useState('');
  const [priceUnit, setPriceUnit] = useState('$');
  const [datetimeStart, setDatetimeStart] = useState('');
  const [datetimeFinish, setDatetimeFinish] = useState('');
  const [locationCountry, setLocationCountry] = useState('Brazil');
  const [locationCity, setLocationCity] = useState('');
  const [locationSmartLocation, setLocationSmartLocation] = useState('');
  const [sport, setSport] = useState('soccer');
  const [image, setImage] = useState(null);

  // State to store the selected coordinates
  const [coordinates, setCoordinates] = useState({
    latitude: 37.78825,
    longitude: -122.4324, // Default coordinates (San Francisco)
  });

  // Function to handle selecting an image from the gallery
  const onCaptureImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
      base64: true,
    });

    if (!result.canceled) {
      const base64 = `data:image/png;base64,${result.assets[0].base64}`;
      setImage(base64);
    }
  };

  // Function to handle the map press and update the coordinates and location information
  const handleMapPress = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCoordinates({ latitude, longitude });

    try {
      // Reverse geocode to get the address (city, country, etc.)
      const response = await Geocoder.from(latitude, longitude);

      // Log the full response to check its structure
      console.log('Geocoder response:', response);

      // Check if the results exist and it's an array before accessing it
      if (response.results && response.results.length > 0) {
        const addressComponents = response.results[0].address_components;

        // Extract city, country, and place name (smart location)
        const city = addressComponents.find((c) => c.types.includes('locality'))?.long_name || '';
        const country = addressComponents.find((c) => c.types.includes('country'))?.long_name || '';
        const smartLocation = response.results[0].formatted_address || '';

        // Update the state with the fetched values
        setLocationCity(city);
        setLocationCountry(country);
        setLocationSmartLocation(smartLocation);
      } else {
        console.warn('No results found for reverse geocoding.');
        Alert.alert('Error', 'No location details found.');
      }
    } catch (error) {
      console.error('Error while reverse geocoding:', error);
      Alert.alert('Error', 'Unable to get location details.');
    }
  };

  // Submit the form data, including the selected coordinates from the map
  const onSubmit = async () => {
    try {
      const data = {
        id: Date.now().toString(), // Generate a unique ID for testing; replace with appropriate logic
        enabled: true,
        name: title,
        description: description,
        activity_type: activityType,
        sport_type: sport,
        price: {
          value: parseFloat(priceValue.replace(/[^0-9.]/g, '')),
          unit: priceUnit,
        },
        location: {
          country: locationCountry,
          area: '',
          city: locationCity,
          smart_location: locationSmartLocation,
          geometry: {
            type: 'Point',
            coordinates: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            },
          },
        },
        participants: {
          current: 0, // Default values for testing
          max: 0,
        },
        reviews: {
          number_of_reviews: 0, // Default values for testing
          review_scores_rating: 0,
        },
        pictures: [image],
        host: {
          host_picture_url: image,
          host_name: 'Test Host', // Default values for testing
          host_since: '2024-01-01',
        },
        datetimes: {
          datetime_created: datetimeStart,
          datetime_deleted: null,
          datetime_start: datetimeStart,
          datetime_finish: datetimeFinish,
        },
      };

      const result = await createActivity({ activity: data });
      if (result) {
        // Handle success (e.g., show a success message, navigate back)
        console.log('Activity created successfully:', result);
      } else {
        // Handle error (e.g., show an error message)
        console.error('Failed to create activity:', result);
      }
    } catch (error) {
      console.error('Error while creating activity:', error);
    }
  };

  // Function to render titles for input sections
  const renderTitle = (labelKey) => (
    <Text style={{ paddingLeft: spacing.xs, paddingBottom: spacing.xs, fontSize: spacing.md }}>
      {translate(`create_activity_screen.${labelKey}`)}
    </Text>
  );

  return (
    <Screen preset="scroll" contentContainerStyle={styles.container}>
      {/* Image selection*/}
      <TouchableOpacity style={styles.imageUpload} onPress={onCaptureImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.uploadedImage} />
        ) : (
          <Text style={styles.insertImageText}>
            {translate('create_activity_screen.upload_photo')}
          </Text>
        )}
      </TouchableOpacity>

      {/* Title */}
      {renderTitle('label_title')}
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_title')}
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      {/* Description */}
      {renderTitle('label_description')}
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_description')}
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      {/* Activity Type */}
      {renderTitle('label_activity_type')}
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(itemValue) => setActivityType(itemValue)}
          items={[
            { label: capitalize(translate('activity_types.spot')), value: ActivityType.Spot },
            { label: capitalize(translate('activity_types.session')), value: ActivityType.Session },
            { label: capitalize(translate('activity_types.event')), value: ActivityType.Event },
          ]}
          value={activityType}
          style={pickerSelectStyles}
          placeholder={{}}
        />
      </View>

      {/* Sport Type */}
      {renderTitle('label_sport')}
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(itemValue) => setSport(itemValue)}
          items={[
            { label: translate('activity_sports.soccer'), value: SportType.Soccer },
            { label: translate('activity_sports.baseball'), value: SportType.Baseball },
            { label: translate('activity_sports.basketball'), value: SportType.Basketball },
            { label: translate('activity_sports.motorsports'), value: SportType.Swim },
          ]}
          value={sport}
          style={pickerSelectStyles}
          placeholder={{}}
        />
      </View>

      {/* Price */}
      {renderTitle('label_price')}
      <View style={[styles.pickerContainer, { borderTopWidth: 0 }]}>
        <TextInput
          placeholder="0"
          style={[styles.input, { borderWidth: 1, marginBottom: 0 }]}
          keyboardType="numeric"
          value={priceValue}
          onChangeText={(text) => setPriceValue(text.replace(/[^0-9.]/g, ''))}
        />
        <RNPickerSelect
          onValueChange={(itemValue) => setPriceUnit(itemValue)}
          items={[
            { label: `$ - ${capitalize(translate('common.dollar'))}`, value: '$' },
            { label: `€ - ${capitalize(translate('common.euro'))}`, value: '€' },
            { label: `R$ - ${capitalize(translate('common.real'))}`, value: 'R$' },
          ]}
          value={priceUnit}
          style={pickerSelectStyles}
          placeholder={{}}
        />
      </View>

      {/* Date & Time */}
      {renderTitle('label_date_time')}
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_datetime_start')}
        style={styles.input}
        value={datetimeStart}
        onChangeText={setDatetimeStart}
      />
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_datetime_finish')}
        style={styles.input}
        value={datetimeFinish}
        onChangeText={setDatetimeFinish}
      />

      {/* Location */}
      {renderTitle('label_map')}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
        >
          <Marker coordinate={coordinates} />
        </MapView>
      </View>

      <Text style={styles.coordinatesText}>
        {translate('create_activity_screen.selected_coordinates')}: {coordinates.latitude},{' '}
        {coordinates.longitude}
      </Text>
      {renderTitle('label_location')}
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_country')}
        style={styles.input}
        value={locationCountry}
        onChangeText={setLocationCountry}
      />
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_city')}
        style={styles.input}
        value={locationCity}
        onChangeText={setLocationCity}
      />
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_smart_location')}
        style={styles.input}
        value={locationSmartLocation}
        onChangeText={setLocationSmartLocation}
      />

      {/* Create activity button */}
      <TouchableOpacity onPress={onSubmit} style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>{translate('create_activity_screen.create')}</Text>
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: spacing.md,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.grey,
    padding: spacing.sm,
    borderRadius: spacing.sm,
    width: '100%',
    marginBottom: spacing.md,
  },
  imageUpload: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.primary_light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderRadius: spacing.sm,
  },
  uploadedImage: {
    borderRadius: spacing.sm,
    width: '100%',
    height: '100%',
  },
  insertImageText: {
    color: Colors.grey,
    fontSize: 16,
    fontFamily: 'mon',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: spacing.sm,
    width: '100%',
    marginBottom: spacing.md,
  },
  mapContainer: {
    height: 300,
    overflow: 'hidden',
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: Colors.primary,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  coordinatesText: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: 0, // Adjusted to align with the input field
    color: 'black',
    paddingRight: spacing.lg,
    marginBottom: spacing.md,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 0,
    paddingVertical: spacing.sm,
    color: 'black',
    paddingRight: spacing.lg,
  },
});

export default CreateActivity;
