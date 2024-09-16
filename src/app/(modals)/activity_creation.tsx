import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@clerk/clerk-expo';
import { translate } from '@/app/services/translate';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from 'src/components/Screen';
import { spacing } from '@/constants/spacing';
import Colors from '@/constants/Colors';
import { createActivity } from '@/api/create_activity';

const CreateActivity = () => {
  const { signOut, isSignedIn } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityType, setActivityType] = useState('Public Spot');
  const [priceValue, setPriceValue] = useState('');
  const [priceUnit, setPriceUnit] = useState('$');
  const [datetimeStart, setDatetimeStart] = useState('');
  const [datetimeFinish, setDatetimeFinish] = useState('');
  const [locationCountry, setLocationCountry] = useState('Brazil');
  const [locationArea, setLocationArea] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationSmartLocation, setLocationSmartLocation] = useState('');
  const [coordinatesLatitude, setCoordinatesLatitude] = useState('0.0');
  const [coordinatesLongitude, setCoordinatesLongitude] = useState('0.0');
  const [sport, setSport] = useState('soccer');
  const [image, setImage] = useState(null);

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
          area: locationArea,
          city: locationCity,
          smart_location: locationSmartLocation,
          geometry: {
            type: 'Point',
            coordinates: {
              latitude: coordinatesLatitude,
              longitude: coordinatesLongitude,
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

  const renderTitle = (labelKey) => (
    <Text style={{ paddingLeft: spacing.xs }}>
      {translate(`create_activity_screen.${labelKey}`)}
    </Text>
  );

  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} safeAreaEdges={['top']}>
      <Button
        title={translate('create_activity_screen.create')}
        onPress={onSubmit}
        color={Colors.dark}
      />

      <Text style={styles.header}>{translate('create_activity_screen.title')}</Text>

      <TouchableOpacity style={styles.imageUpload} onPress={onCaptureImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.uploadedImage} />
        ) : (
          <Text>{translate('create_activity_screen.upload_photo')}</Text>
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
        <Picker
          selectedValue={activityType}
          onValueChange={(itemValue) => setActivityType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Public Spot" value="Public Spot" />
          <Picker.Item label="Session" value="Session" />
          <Picker.Item label="Event" value="Event" />
        </Picker>
      </View>

      {/* Price */}
      {renderTitle('label_price')}
      <View style={styles.pickerContainer}>
        <TextInput
          placeholder="0"
          style={styles.input}
          keyboardType="numeric"
          value={priceValue}
          onChangeText={(text) => setPriceValue(text.replace(/[^0-9.]/g, ''))}
        />
        <Picker
          selectedValue={priceUnit}
          onValueChange={(itemValue) => setPriceUnit(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="$" value="$" />
          <Picker.Item label="€" value="€" />
          <Picker.Item label="R$" value="R$" />
        </Picker>
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
      {renderTitle('label_location')}
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_country')}
        style={styles.input}
        value={locationCountry}
        onChangeText={setLocationCountry}
      />
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_area')}
        style={styles.input}
        value={locationArea}
        onChangeText={setLocationArea}
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
      {renderTitle('label_coordinates')}
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_latitude')}
        style={styles.input}
        keyboardType="numeric"
        value={coordinatesLatitude}
        onChangeText={(text) => {
          const formattedText = text.replace(/[^0-9.]/g, '');
          setCoordinatesLatitude(formattedText);
        }}
      />
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_longitude')}
        style={styles.input}
        keyboardType="numeric"
        value={coordinatesLongitude}
        onChangeText={(text) => {
          const formattedText = text.replace(/[^0-9.]/g, '');
          setCoordinatesLongitude(formattedText);
        }}
      />

      {/* Sport */}
      {renderTitle('label_sport')}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sport}
          onValueChange={(itemValue) => setSport(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Soccer" value="soccer" />
          <Picker.Item label="Basketball" value="basketball" />
          <Picker.Item label="Tennis" value="tennis" />
          <Picker.Item label="Swimming" value="swimming" />
        </Picker>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontFamily: 'mon-b',
    marginBottom: spacing.lg,
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
    backgroundColor: Colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: spacing.sm,
    width: '100%',
    marginBottom: spacing.md,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default CreateActivity;
