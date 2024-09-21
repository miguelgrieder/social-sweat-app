import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Screen } from '@/components/Screen';
import * as ImagePicker from 'expo-image-picker';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';

const RoleSelectionScreen = () => {
  const router = useRouter();
  const { user } = useUser();

  const onCaptureImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
      base64: true,
    });

    if (!result.canceled) {
      const base64 = `data:image/png;base64,${result.assets[0].base64}`;
      user?.setProfileImage({
        file: base64,
      });
    }
  };

  return (
    <Screen preset="fixed" contentContainerStyle={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.header}>{translate('photo-upload.header')}</Text>
      {user && (
        <TouchableOpacity onPress={onCaptureImage}>
          <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
        </TouchableOpacity>
      )}
      <Text style={styles.description}>{translate('photo-upload.description')}</Text>
      <TouchableOpacity
        style={[defaultStyles.btn, { width: '100%' }]}
        onPress={() => router.push('/(modals)/user/birthdate-selection')}
      >
        <Text style={defaultStyles.btnText}>{translate('common.continue')}</Text>
      </TouchableOpacity>
    </Screen>
  );
};

export default RoleSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
    gap: spacing.xxl,
    paddingTop: 100,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'mon-b',
  },
  avatar: {
    width: 156,
    height: 156,
    borderRadius: 100,
    backgroundColor: Colors.grey,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6C6C6C',
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'mon-sb',
    paddingHorizontal: spacing.sm,
  },
});
