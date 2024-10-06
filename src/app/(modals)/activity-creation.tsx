import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import Geocoder from 'react-native-geocoding';
import { spacing } from '@/constants/spacing';
import Colors from '@/constants/Colors';
import { createActivity } from '@/api/createActivity';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { translate } from '@/app/services/translate';
import { capitalize } from '@/utils/utils';
import { defaultStyles } from '@/constants/Styles';
import { useNavigation } from 'expo-router';
import { ActivityType, SportType } from '@/interfaces/activity';
import RNPickerSelect from 'react-native-picker-select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { fetchUsers } from '@/api/fetchUsers';
import { Role, User } from '@/interfaces/user';

Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);

const CreateActivity = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: translate('create_activity_screen.title') });
  }, [navigation]);

  const { userId } = useAuth();
  const { user: clerkUser, isLoaded, isSignedIn } = useUser(); // Fetch user using Clerk's useUser
  const [user, setUser] = useState<User | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [description_private, setDescriptionPrivate] = useState('');
  const [activityType, setActivityType] = useState(ActivityType.Spot);
  const [priceValue, setPriceValue] = useState('');
  const [priceUnit, setPriceUnit] = useState('$');
  const [datetimeStart, setDatetimeStart] = useState<Date | null>(null);
  const [datetimeFinish, setDatetimeFinish] = useState<Date | null>(null);
  const [isDatePickerVisibleStart, setDatePickerVisibilityStart] = useState(false);
  const [isDatePickerVisibleFinish, setDatePickerVisibilityFinish] = useState(false);
  const [locationCountry, setLocationCountry] = useState('Brazil');
  const [locationCity, setLocationCity] = useState('');
  const [locationSmartLocation, setLocationSmartLocation] = useState('');
  const [sport, setSport] = useState(SportType.Soccer);
  const [image, setImage] = useState<string | null>(null);
  const [maxParticipants, setMaxParticipants] = useState('');

  // State to store the selected coordinates
  const [coordinates, setCoordinates] = useState({
    latitude: 37.78825,
    longitude: -122.4324, // Default coordinates (San Francisco)
  });

  // Define activity type permissions based on roles
  const roleActivityMap: { [key in Role]: ActivityType[] } = {
    [Role.Company]: [ActivityType.Spot, ActivityType.Session, ActivityType.Event],
    [Role.Coach]: [ActivityType.Session, ActivityType.Event],
    [Role.User]: [ActivityType.Event],
  };

  // Fetch and set user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoaded && isSignedIn && clerkUser) {
        try {
          const fetchedUsers = await fetchUsers({ id: userId });
          if (fetchedUsers && fetchedUsers.length > 0) {
            setUser(fetchedUsers[0]);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('CreateActivity - Error fetching user data:', error);
          setUser(null);
        }
      }
    };
    fetchUserData();
  }, [isLoaded, isSignedIn, clerkUser]);

  // Reset datetime when activity type changes to Spot
  useEffect(() => {
    if (activityType === ActivityType.Spot) {
      setDatetimeStart(null);
      setDatetimeFinish(null);
    }
  }, [activityType]);

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
        Alert.alert(
          translate('alerts.error'),
          translate('create_activity_screen.no_location_details')
        );
      }
    } catch (error) {
      console.error('Error while reverse geocoding:', error);
      Alert.alert(
        translate('alerts.error'),
        translate('create_activity_screen.unable_to_get_location')
      );
    }
  };

  // Function to check if the user can create the selected activity type
  const canCreateActivityType = (role: Role, activityType: ActivityType): boolean => {
    const allowedTypes = roleActivityMap[role];
    return allowedTypes.includes(activityType);
  };

  // Submit the form data, including the selected coordinates from the map
  const onSubmit = async () => {
    if (!userId) {
      Alert.alert(translate('alerts.error'), translate('alerts.user_id_unavailable'));
      return;
    }

    if (!isLoaded) {
      Alert.alert(translate('alerts.error'), translate('alerts.user_data_loading'));
      return;
    }

    if (!user) {
      Alert.alert(translate('alerts.error'), translate('alerts.user_unavailable'));
      return;
    }

    const userRole = user.user_metadata.role;

    if (!userRole) {
      Alert.alert(translate('alerts.error'), translate('alerts.role_unavailable'));
      return;
    }

    if (!canCreateActivityType(userRole, activityType)) {
      Alert.alert(
        translate('alerts.error'),
        translate('create_activity_screen.unauthorized_activity_type')
      );
      return;
    }

    const max = parseInt(maxParticipants, 10);
    if (isNaN(max) || max <= 0) {
      Alert.alert(
        translate('alerts.error'),
        translate('create_activity_screen.invalid_max_participants')
      );
      return;
    }

    // Validate datetime fields only if activity type is not Spot
    if (activityType !== ActivityType.Spot) {
      if (!datetimeStart || !datetimeFinish) {
        Alert.alert(
          translate('alerts.error'),
          translate('create_activity_screen.datetime_required')
        );
        return;
      }
      if (datetimeFinish <= datetimeStart) {
        Alert.alert(
          translate('alerts.error'),
          translate('create_activity_screen.datetime_finish_after_start')
        );
        return;
      }
    }

    try {
      // Construct datetimes object conditionally
      const datetimes: any = {
        datetime_created: new Date().toISOString(),
        datetime_deleted: null,
      };

      if (activityType !== ActivityType.Spot && datetimeStart && datetimeFinish) {
        datetimes.datetime_start = datetimeStart.toISOString();
        datetimes.datetime_finish = datetimeFinish.toISOString();
      }

      const data = {
        id: Date.now().toString(), // Generate a unique ID for testing; replace with appropriate logic
        enabled: true,
        name: title,
        description: description,
        description_private: description_private,
        activity_type: activityType,
        sport_type: sport,
        price: {
          value: parseFloat(priceValue.replace(/[^0-9.]/g, '')) || 0,
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
          participants_user_id: [userId],
          max: max,
        },
        reviews: {
          number_of_reviews: 0, // Default values for testing
          review_scores_rating: 0,
        },
        pictures: image ? [image] : [],
        host: {
          host_user_id: userId,
        },
        datetimes: datetimes,
      };

      const result = await createActivity({ activity: data });
      if (result) {
        // Handle success (e.g., show a success message, navigate back)
        console.log('Activity created successfully:', result);
        ToastAndroid.show(
          translate('create_activity_screen.activity_created_success'),
          ToastAndroid.SHORT
        );
        navigation.goBack();
      } else {
        // Handle error (e.g., show an error message)
        console.error('Failed to create activity:', result);
        Alert.alert(
          translate('alerts.error'),
          translate('create_activity_screen.failed_to_create')
        );
      }
    } catch (error) {
      console.error('Error while creating activity:', error);
      Alert.alert(
        translate('alerts.error'),
        translate('create_activity_screen.error_creating_activity')
      );
    }
  };

  // Function to render titles for input sections
  const renderTitle = (labelKey) => (
    <Text style={{ paddingLeft: spacing.xs, paddingBottom: spacing.xs, fontSize: spacing.md }}>
      {translate(`create_activity_screen.${labelKey}`)}
    </Text>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView>
        <View style={styles.container}>
          {/* Image selection */}
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
            placeholderTextColor={Colors.grey}
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
          {/* Description */}
          {renderTitle('label_description')}
          <TextInput
            placeholder={translate('create_activity_screen.placeholder_description')}
            placeholderTextColor={Colors.grey}
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
          {/* Description Private */}
          {renderTitle('label_description_private')}
          <TextInput
            placeholder={translate('create_activity_screen.placeholder_description_private')}
            placeholderTextColor={Colors.grey}
            style={styles.input}
            value={description_private}
            onChangeText={setDescriptionPrivate}
            multiline
            numberOfLines={4}
          />
          {/* Maximum Participants */}
          {renderTitle('label_max_participants')}
          <TextInput
            placeholder={translate('create_activity_screen.placeholder_max_participants')}
            placeholderTextColor={Colors.grey}
            style={styles.input}
            value={maxParticipants}
            onChangeText={(text) => setMaxParticipants(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
          />
          {/* Activity Type */}
          {renderTitle('label_activity_type')}
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(itemValue) => setActivityType(itemValue)}
              items={[
                { label: capitalize(translate('activity_types.spot')), value: ActivityType.Spot },
                {
                  label: capitalize(translate('activity_types.session')),
                  value: ActivityType.Session,
                },
                { label: capitalize(translate('activity_types.event')), value: ActivityType.Event },
              ]}
              value={activityType}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
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
                { label: translate('activity_sports.swim'), value: SportType.Swim },
              ]}
              value={sport}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              placeholder={{}}
            />
          </View>
          {/* Price */}
          {renderTitle('label_price')}
          <View style={[styles.pickerContainer, { borderTopWidth: 0 }]}>
            <TextInput
              placeholder="0"
              placeholderTextColor={Colors.grey}
              style={[styles.input, { borderWidth: StyleSheet.hairlineWidth, marginBottom: 0 }]}
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
              useNativeAndroidPickerStyle={false}
              placeholder={{}}
            />
          </View>
          {/* Date & Time - Only show if activity type is not Spot */}
          {activityType !== ActivityType.Spot && (
            <>
              {renderTitle('label_date_time')}
              {/* Start DateTime Picker */}
              <TouchableOpacity
                onPress={() => setDatePickerVisibilityStart(true)}
                style={styles.input}
              >
                <Text style={{ color: datetimeStart ? Colors.grey : Colors.grey }}>
                  {datetimeStart
                    ? datetimeStart.toLocaleString()
                    : translate('create_activity_screen.placeholder_datetime_start')}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisibleStart}
                mode="datetime"
                onConfirm={(date) => {
                  setDatetimeStart(date);
                  setDatePickerVisibilityStart(false);
                }}
                onCancel={() => setDatePickerVisibilityStart(false)}
              />
              {/* Finish DateTime Picker */}
              <TouchableOpacity
                onPress={() => setDatePickerVisibilityFinish(true)}
                style={styles.input}
              >
                <Text style={{ color: datetimeFinish ? Colors.grey : Colors.grey }}>
                  {datetimeFinish
                    ? datetimeFinish.toLocaleString()
                    : translate('create_activity_screen.placeholder_datetime_finish')}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDatePickerVisibleFinish}
                mode="datetime"
                onConfirm={(date) => {
                  setDatetimeFinish(date);
                  setDatePickerVisibilityFinish(false);
                }}
                onCancel={() => setDatePickerVisibilityFinish(false)}
              />
            </>
          )}
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
            placeholderTextColor={Colors.grey}
            style={styles.input}
            value={locationCountry}
            onChangeText={setLocationCountry}
          />
          <TextInput
            placeholder={translate('create_activity_screen.placeholder_city')}
            placeholderTextColor={Colors.grey}
            style={styles.input}
            value={locationCity}
            onChangeText={setLocationCity}
          />
          <TextInput
            placeholder={translate('create_activity_screen.placeholder_smart_location')}
            placeholderTextColor={Colors.grey}
            style={styles.input}
            value={locationSmartLocation}
            onChangeText={setLocationSmartLocation}
          />
        </View>
      </ScrollView>
      {/* Create activity button */}
      <View
        style={[
          styles.buttonContainer,
          {
            marginBottom: useSafeAreaInsets().bottom,
          },
        ]}
      >
        <TouchableOpacity onPress={onSubmit} style={defaultStyles.btn}>
          <Text style={defaultStyles.btnText}>{translate('create_activity_screen.create')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: 0,
    backgroundColor: Colors.background,
  },
  input: {
    color: Colors.grey,
    padding: spacing.sm,
    borderColor: Colors.grey,
    borderRadius: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center', //  new
  },
  imageUpload: {
    height: 240,
    width: '100%',
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
    width: '100%',
    borderColor: Colors.grey,
    marginBottom: spacing.md,
    borderRadius: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
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
  buttonContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
    justifyContent: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 54,
    borderRadius: 10,
    color: Colors.grey,
    paddingHorizontal: spacing.sm,
    paddingRight: spacing.lg,
    paddingVertical: spacing.xs,
  },
  inputAndroid: {
    height: 54,
    borderRadius: 10,
    color: Colors.grey,
    paddingHorizontal: spacing.sm,
    paddingRight: spacing.lg,
    paddingVertical: spacing.xs,
  },
});

export default CreateActivity;
