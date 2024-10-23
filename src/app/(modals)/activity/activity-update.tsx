// src/app/(modals)/activity-update.tsx

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
import { updateActivity } from '@/api/activity/updateActivity';
import { fetchActivities } from '@/api/fetchActivities';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { translate } from '@/app/services/translate';
import { capitalize } from '@/utils/utils';
import { defaultStyles } from '@/constants/Styles';
import { useNavigation } from 'expo-router';
import { ActivityType, SportType } from '@/interfaces/activity';
import RNPickerSelect from 'react-native-picker-select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { countryNameToCountryType, CountryType } from '@/interfaces/country';
import { UpdateActivityInput, UpdateActivityData } from '@/interfaces/activity'; // Import interfaces

Geocoder.init(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);

const UpdateActivityPage = () => {
  const navigation = useNavigation();
  const activityId = '1727582865955'; // Ensure you pass activityId when navigating to this screen

  useEffect(() => {
    navigation.setOptions({ title: translate('create_activity_screen.title') });
  }, [navigation]);

  const { userId } = useAuth();
  const { isLoaded } = useUser();

  // Form state variables with correct types
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [description_private, setDescriptionPrivate] = useState<string | null>(null);
  const [activityType, setActivityType] = useState<ActivityType | null>(null);
  const [priceValue, setPriceValue] = useState<string | null>(null);
  const [priceUnit, setPriceUnit] = useState<'$' | 'R$' | '€' | null>(null);
  const [datetimeStart, setDatetimeStart] = useState<Date | null>(null);
  const [datetimeFinish, setDatetimeFinish] = useState<Date | null>(null);
  const [isDatePickerVisibleStart, setDatePickerVisibilityStart] = useState<boolean>(false);
  const [isDatePickerVisibleFinish, setDatePickerVisibilityFinish] = useState<boolean>(false);
  const [locationCountry, setLocationCountry] = useState<CountryType | null>(null);
  const [locationCity, setLocationCity] = useState<string | null>(null);
  const [locationSmartLocation, setLocationSmartLocation] = useState<string | null>(null);
  const [sport, setSport] = useState<SportType | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [maxParticipants, setMaxParticipants] = useState<string | null>(null);

  // Coordinates state
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: -27.598,
    longitude: -48.4892,
  });

  // Fetch existing activity data using fetchActivities API
  useEffect(() => {
    const fetchActivitiesData = async () => {
      if (!activityId) {
        Alert.alert(translate('alerts.error'), translate('alerts.activity_id_unavailable'));
        return;
      }

      try {
        const filterBody = {
          activity_id: activityId,
        };
        const activities = await fetchActivities(filterBody);

        if (activities && activities.length > 0) {
          const activityData = activities[0];
          // Populate state variables
          setTitle(activityData.name || null);
          setDescription(activityData.description || null);
          setDescriptionPrivate(activityData.description_private || null);
          setSport(activityData.sport_type || null);
          setPriceValue(activityData.price?.value?.toString() || null);
          setPriceUnit(activityData.price?.unit || null);
          setMaxParticipants(activityData.participants?.max?.toString() || null);
          setImage(activityData.pictures?.[0] || null);
          setCoordinates({
            latitude: activityData.location?.geometry?.coordinates?.latitude || -27.598,
            longitude: activityData.location?.geometry?.coordinates?.longitude || -48.4892,
          });
          setLocationCountry(activityData.location?.country || null);
          setLocationCity(activityData.location?.city || null);
          setLocationSmartLocation(activityData.location?.smart_location || null);
          if (activityData.datetimes?.datetime_start) {
            setDatetimeStart(new Date(activityData.datetimes.datetime_start));
          }
          if (activityData.datetimes?.datetime_finish) {
            setDatetimeFinish(new Date(activityData.datetimes.datetime_finish));
          }
        } else {
          console.warn('No activities found for the given ID.');
          // Optionally, set default values or navigate back
          Alert.alert(
            translate('alerts.error'),
            translate('create_activity_screen.activity_not_found')
          );
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching activity data:', error);
        Alert.alert(
          translate('alerts.error'),
          translate('create_activity_screen.error_fetching_activity')
        );
        navigation.goBack();
      }
    };
    fetchActivitiesData();
  }, [activityId, navigation]);

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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64 = `data:image/png;base64,${result.assets[0].base64}`;
      setImage(base64);
    }
  };

  // Create country items for the picker
  const countryItems = Object.values(CountryType).map((countryTypeValue) => ({
    label: capitalize(translate('country.' + countryTypeValue)),
    value: countryTypeValue,
  }));

  // Function to map geocoded country name to CountryType enum
  const mapCountryNameToCountryType = (countryName: string): CountryType | null => {
    const mapping: { [key: string]: CountryType } = countryNameToCountryType;

    const normalizedCountryName = countryName.toLowerCase();
    return mapping[normalizedCountryName] || null;
  };

  // Function to handle the map press and update the coordinates and location information
  const handleMapPress = async (e: any) => {
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
        const city =
          addressComponents.find((c: any) => c.types.includes('locality'))?.long_name || null;
        const country =
          addressComponents.find((c: any) => c.types.includes('country'))?.long_name || null;
        const smartLocation = response.results[0].formatted_address || null;

        // Update the state with the fetched values
        setLocationCity(city);
        const countryType = mapCountryNameToCountryType(country);
        if (countryType) {
          setLocationCountry(countryType);
        } else {
          console.warn('Country from geocoding not in predefined list:', country);
        }
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

  // Function to validate required fields
  const validateRequiredFields = (fields: { value: any; name: string; minLength?: number }[]) => {
    const missingFields: string[] = [];
    const tooShortFields: { name: string; minLength: number }[] = [];

    fields.forEach((field) => {
      if (!field.value) {
        missingFields.push(field.name);
      } else if (field.minLength && field.value.length < field.minLength) {
        tooShortFields.push({ name: field.name, minLength: field.minLength });
      }
    });

    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(', ');
      Alert.alert(
        translate('alerts.error'),
        translate('create_activity_screen.required_fields_missing') + ': ' + missingFieldsString
      );
      return false;
    }

    if (tooShortFields.length > 0) {
      const tooShortFieldsString = tooShortFields
        .map(
          (f) =>
            `${f.name} (${translate('common.min')} ${f.minLength} ${translate('common.characters')})`
        )
        .join(', ');
      Alert.alert(
        translate('alerts.error'),
        translate('create_activity_screen.fields_too_short') + ': ' + tooShortFieldsString
      );
      return false;
    }

    return true;
  };

  // Function to remove None values recursively
  const removeNoneValues = (data: Record<string, any>): Record<string, any> => {
    if (Array.isArray(data)) {
      return data
        .map((item) => removeNoneValues(item))
        .filter((item) => item !== null && item !== undefined);
    } else if (data && typeof data === 'object') {
      return Object.entries(data).reduce((acc: Record<string, any>, [key, value]) => {
        const cleanedValue = removeNoneValues(value);
        if (cleanedValue !== null && cleanedValue !== undefined) {
          acc[key] = cleanedValue;
        }
        return acc;
      }, {});
    }
    return data;
  };

  // Submit updated data
  const onSubmit = async () => {
    if (!userId) {
      Alert.alert(translate('alerts.error'), translate('alerts.user_id_unavailable'));
      return;
    }

    if (!isLoaded) {
      Alert.alert(translate('alerts.error'), translate('alerts.user_data_loading'));
      return;
    }

    const max = parseInt(maxParticipants || '0', 10);
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

    // Validate required fields
    const requiredFields = [
      { value: title, name: translate('create_activity_screen.label_title'), minLength: 5 },
      {
        value: description,
        name: translate('create_activity_screen.label_description'),
        minLength: 10,
      },
      { value: locationCity, name: translate('create_activity_screen.label_city') },
      {
        value: locationSmartLocation,
        name: translate('create_activity_screen.label_smart_location'),
      },
      { value: image, name: translate('create_activity_screen.label_image') },
    ];

    if (!validateRequiredFields(requiredFields)) {
      return;
    }

    try {
      // Construct update_activity_data object conditionally
      const updateData: UpdateActivityData = {};

      if (title) updateData.name = title;
      if (description) updateData.description = description;
      if (description_private) updateData.description_private = description_private;
      if (activityType) updateData.activity_type = activityType;
      if (sport) updateData.sport_type = sport;
      if (priceValue && priceUnit) {
        updateData.price = {
          value: parseFloat(priceValue),
          unit: priceUnit,
        };
      }
      if (image) {
        updateData.pictures = [image];
      }
      if (
        locationCountry ||
        locationCity ||
        locationSmartLocation ||
        coordinates.latitude !== -27.598 || // Assuming -27.598 is the default latitude
        coordinates.longitude !== -48.4892 // Assuming -48.4892 is the default longitude
      ) {
        updateData.location = {
          country: locationCountry,
          city: locationCity,
          smart_location: locationSmartLocation,
          geometry: {
            type: 'Point',
            coordinates: {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            },
          },
        };
      }
      if (activityType !== ActivityType.Spot) {
        updateData.datetimes = {};
        if (datetimeStart) updateData.datetimes.datetime_start = datetimeStart.toISOString();
        if (datetimeFinish) updateData.datetimes.datetime_finish = datetimeFinish.toISOString();
      }

      // Remove None values recursively
      const cleanedUpdateData = removeNoneValues(updateData);

      const payload: UpdateActivityInput = {
        id: activityId,
        update_activity_data: cleanedUpdateData,
        max_participants: max,
      };

      const result = await updateActivity(payload);
      if (result) {
        // Handle success (e.g., show a success message, navigate back)
        console.log('Activity updated successfully:', result);
        ToastAndroid.show(
          translate('create_activity_screen.activity_updated_success'),
          ToastAndroid.SHORT
        );
        navigation.goBack();
      } else {
        // Handle error (e.g., show an error message)
        console.error('Failed to update activity:', result);
        Alert.alert(
          translate('alerts.error'),
          translate('create_activity_screen.failed_to_update')
        );
      }
    } catch (error) {
      console.error('Error while updating activity:', error);
      Alert.alert(
        translate('alerts.error'),
        translate('create_activity_screen.error_updating_activity')
      );
    }
  };

  // Function to render titles for input sections
  const renderTitle = (labelKey: string) => (
    <Text style={{ paddingLeft: spacing.xs, paddingBottom: spacing.xs, fontSize: spacing.md }}>
      {translate(`create_activity_screen.${labelKey}`)}
    </Text>
  );

  const sportTypes = Object.values(SportType);

  const sportItems = sportTypes.map((sportTypeValue) => ({
    label: capitalize(translate('activity_sports.' + sportTypeValue)),
    value: sportTypeValue,
  }));

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
          {/* Sport Type */}
          {renderTitle('label_sport')}
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(itemValue) => setSport(itemValue)}
              items={sportItems}
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
          {/* Country Picker */}
          {renderTitle('label_country')}
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(itemValue) => setLocationCountry(itemValue)}
              items={countryItems}
              value={locationCountry}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              placeholder={{
                label: translate('create_activity_screen.placeholder_country'),
                value: null,
              }}
            />
          </View>
          {/* City Input */}
          {renderTitle('label_city')}
          <TextInput
            placeholder={translate('create_activity_screen.placeholder_city')}
            placeholderTextColor={Colors.grey}
            style={styles.input}
            value={locationCity}
            onChangeText={setLocationCity}
          />
          {/* Smart Location Input */}
          {renderTitle('label_smart_location')}
          <TextInput
            placeholder={translate('create_activity_screen.placeholder_smart_location')}
            placeholderTextColor={Colors.grey}
            style={styles.input}
            value={locationSmartLocation}
            onChangeText={setLocationSmartLocation}
          />
        </View>
      </ScrollView>
      {/* Update activity button */}
      <View
        style={[
          styles.buttonContainer,
          {
            marginBottom: useSafeAreaInsets().bottom,
          },
        ]}
      >
        <TouchableOpacity onPress={onSubmit} style={defaultStyles.btn}>
          <Text style={defaultStyles.btnText}>{translate('create_activity_screen.update')}</Text>
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
    justifyContent: 'center',
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
    paddingHorizontal: spacing.sm,
    paddingVertical: Platform.OS === 'ios' ? spacing.xs : 0,
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

export default UpdateActivityPage;
