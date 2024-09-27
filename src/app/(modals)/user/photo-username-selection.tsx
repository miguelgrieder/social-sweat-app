import { translate } from '@/app/services/translate';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/spacing';
import { defaultStyles } from '@/constants/Styles';
import { useUser } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const isUsernameAvailable = (username) => {
  const takenUsernames = ['user', 'admin', 'testuser'];
  return !takenUsernames.includes(username);
};

const UsernameSetupScreen = () => {
  const router = useRouter();
  const { user } = useUser();

  const [username, setUsername] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isValidatingUsername, setIsValidatingUsername] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleImageCapture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/png;base64,${result.assets[0].base64}`;
      user?.setProfileImage({ file: base64Image });
    }
  };

  useEffect(() => {
    if (username.trim() === '') {
      setIsUsernameValid(null);
      setErrorMessage('');
      return;
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      setIsValidatingUsername(true);
      const isValid =
        isUsernameAvailable(username) &&
        username.length >= 4 &&
        username.length <= 20 &&
        !username.includes(' ');

      setIsUsernameValid(isValid);

      if (username.length < 4) {
        setErrorMessage(translate('photo-username-selection.too-short'));
      } else if (username.length > 20 || username.includes(' ')) {
        setErrorMessage(translate('photo-username-selection.invalid'));
      } else {
        setErrorMessage(isValid ? '' : translate('photo-username-selection.error-message'));
      }

      setTimeout(() => {
        setIsValidatingUsername(false);
      }, 1000);
    }, 1000);

    setTypingTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [username]);

  const handleContinue = async () => {
    if (isUsernameValid) {
      try {
        await user?.update({ username });
        router.push('/(modals)/user/birthdate-selection');
      } catch (error) {
        console.error('Error updating username:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.header}>{translate('photo-username-selection.header')}</Text>
      {user && (
        <TouchableOpacity onPress={handleImageCapture}>
          <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
        </TouchableOpacity>
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{translate('photo-username-selection.input-label')}</Text>
        <View style={[styles.inputWrapper, isUsernameValid === false && styles.invalidInput]}>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder={translate('photo-username-selection.placeholder')}
            autoCapitalize="none"
            textAlign="center"
            editable={true}
          />
          {isValidatingUsername && (
            <ActivityIndicator
              style={styles.loadingIndicator}
              size="small"
              color={Colors.primary}
            />
          )}
        </View>
        {isUsernameValid === false && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      </View>
      <Text style={styles.description}>{translate('photo-username-selection.description')}</Text>
      <TouchableOpacity
        style={[
          defaultStyles.btn,
          { width: '100%', opacity: isUsernameValid && !isValidatingUsername ? 1 : 0.5 },
        ]}
        onPress={isUsernameValid && !isValidatingUsername ? handleContinue : undefined}
        disabled={!isUsernameValid || isValidatingUsername}
      >
        <Text style={defaultStyles.btnText}>{translate('common.continue')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UsernameSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 26,
    paddingVertical: 20,
    gap: spacing.xl,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'mon-b',
    textAlign: 'center',
  },
  avatar: {
    width: 156,
    height: 156,
    borderRadius: 100,
    backgroundColor: Colors.grey,
  },
  inputContainer: {
    width: '80%',
    gap: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 40,
    textAlign: 'center',
  },
  invalidInput: {
    borderColor: 'red',
  },
  loadingIndicator: {
    right: 10,
    marginLeft: 10,
    position: 'absolute',
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
  errorMessage: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
  },
});
