import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Corrected Picker import
import { useAuth } from '@clerk/clerk-expo';
import { translate } from '@/app/services/translate';
import * as ImagePicker from 'expo-image-picker';
import { create } from 'apisauce';
import { Screen } from 'src/components/Screen';
import { spacing } from '@/constants/spacing';
import Colors from '@/constants/Colors';

// Apisauce setup
const api = create({
  baseURL: 'API_URL',
  headers: { Accept: 'application/json' },
});

const CreateActivity = () => {
  const { signOut, isSignedIn } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityType, setActivityType] = useState('event'); // Dropdown default
  const [price, setPrice] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [sport, setSport] = useState('soccer'); // Dropdown default
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
        title,
        description,
        activityType,
        price: parseFloat(price.replace('R$', '').trim()),
        dateTime,
        location,
        sport,
        image, // Send image as base64
      };

      const response = await api.post('/activities', data); // Replace `/activities` with your actual endpoint

      if (response.ok) {
        // Handle success (e.g., show a success message, navigate back)
        console.log('Activity created successfully:', response.data);
      } else {
        // Handle error (e.g., show an error message)
        console.error('Failed to create activity:', response.problem);
      }
    } catch (error) {
      console.error('Error while creating activity:', error);
    }
  };

  return (
    <Screen preset="scroll" contentContainerStyle={styles.container} safeAreaEdges={['top']}>
      <Text style={styles.header}>{translate('create_activity_screen.title')}</Text>

      <TouchableOpacity style={styles.imageUpload} onPress={onCaptureImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.uploadedImage} />
        ) : (
          <Text>{translate('create_activity_screen.upload_photo')}</Text>
        )}
      </TouchableOpacity>

      {/* Title */}
      <Text>{translate('create_activity_screen.label_title')}</Text>
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_title')}
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      {/* Description */}
      <Text>{translate('create_activity_screen.label_description')}</Text>
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_description')}
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      {/* Activity Type Combobox */}
      <Text>{translate('create_activity_screen.label_activity_type')}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={activityType}
          onValueChange={(itemValue) => setActivityType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Spot" value="spot" />
          <Picker.Item label="Session" value="session" />
          <Picker.Item label="Event" value="event" />
        </Picker>
      </View>

      {/* Price with R$ */}
      <Text>{translate('create_activity_screen.label_price')}</Text>
      <TextInput
        placeholder="R$ 0,00"
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={(text) => setPrice(`R$ ${text.replace(/\D/g, '')}`)} // Allow only numbers
      />

      {/* Date & Time */}
      <Text>{translate('create_activity_screen.label_date_time')}</Text>
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_date_time')}
        style={styles.input}
        value={dateTime}
        onChangeText={setDateTime}
      />

      {/* Location */}
      <Text>{translate('create_activity_screen.label_location')}</Text>
      <TextInput
        placeholder={translate('create_activity_screen.placeholder_location')}
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      {/* Sport Combobox */}
      <Text>{translate('create_activity_screen.label_sport')}</Text>
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

      <Button
        title={translate('create_activity_screen.create')}
        onPress={onSubmit}
        color={Colors.dark}
      />

      {isSignedIn && (
        <Button title={translate('common.logout')} onPress={() => signOut()} color={Colors.dark} />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
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
