import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  TextInput,
  Switch,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { defaultStyles } from '@/constants/Styles';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateUser } from '@/api/updateUser';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const SocialSelectionScreen = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const { showBackButton } = useLocalSearchParams();
  const showBack = showBackButton === '1';

  const [profileDescription, setProfileDescription] = useState(null);
  const [userPhone, setUserPhone] = useState(null);
  const [usePhone, setUsePhone] = useState(null);
  const [useSMS, setUseSMS] = useState(null);
  const [useWhatsApp, setUseWhatsApp] = useState(null);
  const [userInstagram, setUserInstagram] = useState(null);
  const [userFacebook, setUserFacebook] = useState(null);
  const [userYouTube, setUserYouTube] = useState(null);
  const [userTikTok, setUserTikTok] = useState(null);
  const [userStrava, setUserStrava] = useState(null);
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const handleSocialSelection = async () => {
    if (userId) {
      setButtonDisabled(true);
      try {
        const updateData = {
          user_metadata: {
            profile_description: profileDescription || undefined,
            user_social_medias: {
              user_phone: userPhone || undefined,
              use_phone: usePhone || undefined,
              use_sms: useSMS || undefined,
              use_whatsapp: useWhatsApp || undefined,
              user_instagram: userInstagram || undefined,
              user_facebook: userFacebook || undefined,
              user_youtube: userYouTube || undefined,
              user_tiktok: userTikTok || undefined,
              user_strava: userStrava || undefined,
            },
          },
        };

        const success = await updateUser(userId, updateData);

        if (success) {
          console.log('User social medias saved successfully.');
          router.navigate('/(tabs)/');
        } else {
          console.error('Failed to update user.');
          ToastAndroid.show(translate('common.error_updating_user'), ToastAndroid.SHORT);
        }
      } catch (error) {
        console.error('Error updating user:', error);
        ToastAndroid.show(translate('common.error_updating_user'), ToastAndroid.SHORT);
      } finally {
        setButtonDisabled(false);
      }
    } else {
      router.navigate('/(modals)/user/login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerLeft: showBack
            ? () => (
                <TouchableOpacity style={styles.roundButton} onPress={() => router.back()}>
                  <Ionicons name="chevron-back" size={spacing.lg} color="#000" />
                </TouchableOpacity>
              )
            : null,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>{translate('social_selection_screen.header')}</Text>
        <Text style={styles.subtitle}>{translate('social_selection_screen.subtitle')}</Text>

        <View style={styles.formContainer}>
          {/* Profile Description Input */}
          <Text style={styles.label}>
            {translate('social_selection_screen.profile_description')}
          </Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder={translate('social_selection_screen.enter_profile_description')}
            value={profileDescription}
            onChangeText={setProfileDescription}
            multiline
          />

          {/* Phone Number Input */}
          <Text style={styles.label}>{translate('social_selection_screen.user_phone')}</Text>
          <TextInput
            style={styles.input}
            placeholder={translate('social_selection_screen.enter_phone')}
            keyboardType="phone-pad"
            value={userPhone}
            onChangeText={setUserPhone}
          />

          {/* Use Phone Switches */}
          {userPhone ? (
            <>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>
                  {translate('social_selection_screen.use_phone')}
                </Text>
                <Switch value={usePhone} onValueChange={setUsePhone} />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>
                  {translate('social_selection_screen.use_sms')}
                </Text>
                <Switch value={useSMS} onValueChange={setUseSMS} />
              </View>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>
                  {translate('social_selection_screen.use_whatsapp')}
                </Text>
                <Switch value={useWhatsApp} onValueChange={setUseWhatsApp} />
              </View>
            </>
          ) : null}

          {/* Social Media Inputs */}
          <Text style={styles.label}>{translate('social_selection_screen.user_instagram')}</Text>
          <TextInput
            style={styles.input}
            placeholder={translate('social_selection_screen.enter_instagram')}
            value={userInstagram}
            onChangeText={setUserInstagram}
          />

          <Text style={styles.label}>{translate('social_selection_screen.user_facebook')}</Text>
          <TextInput
            style={styles.input}
            placeholder={translate('social_selection_screen.enter_facebook')}
            value={userFacebook}
            onChangeText={setUserFacebook}
          />

          <Text style={styles.label}>{translate('social_selection_screen.user_youtube')}</Text>
          <TextInput
            style={styles.input}
            placeholder={translate('social_selection_screen.enter_youtube')}
            value={userYouTube}
            onChangeText={setUserYouTube}
          />

          <Text style={styles.label}>{translate('social_selection_screen.user_tiktok')}</Text>
          <TextInput
            style={styles.input}
            placeholder={translate('social_selection_screen.enter_tiktok')}
            value={userTikTok}
            onChangeText={setUserTikTok}
          />

          <Text style={styles.label}>{translate('social_selection_screen.user_strava')}</Text>
          <TextInput
            style={styles.input}
            placeholder={translate('social_selection_screen.enter_strava')}
            value={userStrava}
            onChangeText={setUserStrava}
          />

          <TouchableOpacity
            style={[defaultStyles.btn]}
            onPress={handleSocialSelection}
            disabled={isButtonDisabled}
          >
            <Text style={defaultStyles.btnText}>{translate('common.continue')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SocialSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: spacing.md,
    gap: spacing.lg,
    justifyContent: 'flex-start',
  },
  header: {
    paddingTop: spacing.lg,
    fontSize: spacing.lg,
    fontWeight: '700',
    fontFamily: 'mon-b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: spacing.md,
    fontWeight: '500',
    fontFamily: 'mon-sb',
    paddingLeft: spacing.xxs,
  },
  formContainer: {
    gap: spacing.sm,
  },
  aboutYou: {
    fontSize: spacing.lg,
    fontWeight: '700',
    fontFamily: 'mon-sb',
  },
  description: {
    fontSize: spacing.sm,
    fontWeight: '500',
    color: '#6C6C6C',
    fontFamily: 'mon-sb',
  },
  label: {
    fontSize: spacing.md,
    fontWeight: '600',
    fontFamily: 'mon-sb',
    marginTop: spacing.xxs,
    marginBottom: spacing.xxs,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: spacing.sm,
    padding: spacing.sm,
    fontSize: spacing.md,
  },
  descriptionInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: spacing.sm,
    padding: spacing.sm,
    fontSize: spacing.md,
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.xxxs,
  },
  switchLabel: {
    fontSize: spacing.md,
    fontWeight: '500',
    fontFamily: 'mon-sb',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: spacing.xxl,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },
});
