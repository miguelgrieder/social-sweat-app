import {
  View,
  Text,
  Button,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from 'src/components/Screen';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';

const Page = () => {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.emailAddresses[0].emailAddress);
  }, [user]);

  // Update Clerk user data
  const onSaveUser = async () => {
    try {
      if (!firstName || !lastName) return;

      await user?.update({
        firstName: firstName!,
        lastName: lastName!,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setEdit(false);
    }
  };

  // Capture image from camera roll
  // Upload to Clerk as avatar
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
    <Screen preset="fixed" contentContainerStyle={defaultStyles.container} safeAreaEdges={['top']}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{translate('profile_screen.header')}</Text>
        <Ionicons name="notifications-outline" size={26} />
      </View>

      {user && (
        <View style={styles.card}>
          <TouchableOpacity onPress={onCaptureImage}>
            <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
          </TouchableOpacity>

          {edit ? (
            <View style={styles.editRow}>
              <TextInput
                placeholder={translate('profile_screen.first_name')}
                value={firstName || ''}
                onChangeText={setFirstName}
                style={[defaultStyles.inputField, { width: 100 }]}
              />
              <TextInput
                placeholder={translate('profile_screen.last_name')}
                value={lastName || ''}
                onChangeText={setLastName}
                style={[defaultStyles.inputField, { width: 100 }]}
              />
              <TouchableOpacity onPress={() => onSaveUser}>
                <Ionicons name="checkmark-outline" size={24} color={Colors.dark} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.editRow}>
              <Text style={{ fontFamily: 'mon-b', fontSize: 22 }}>
                {firstName} {lastName}
              </Text>
              <TouchableOpacity onPress={() => setEdit(true)}>
                <Ionicons name="create-outline" size={24} color={Colors.dark} />
              </TouchableOpacity>
            </View>
          )}
          <Text>{email}</Text>
          <Text>
            {translate('profile_screen.since')} {user?.createdAt!.toLocaleDateString()}
          </Text>
        </View>
      )}

      {isSignedIn && (
        <Button title={translate('common.logout')} onPress={() => signOut()} color={Colors.dark} />
      )}
      {!isSignedIn && (
        <Link href={'/(modals)/login'} asChild>
          <Button title={translate('common.login')} color={Colors.dark} />
        </Link>
      )}
    </Screen>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  header: {
    fontFamily: 'mon-b',
    fontSize: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderRadius: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  editRow: {
    // flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
});

export default Page;
