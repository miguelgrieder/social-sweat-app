import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { defaultStyles } from '@/constants/Styles';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import CustomPickerSelect from '@/components/CustomPickerSelect';
import SportsList from '@/components/SportsList';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateUser } from '@/api/updateUser';
import { Role } from '@/interfaces/user';
import { SportType } from '@/interfaces/activity';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const RoleSelectionScreen = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const { showBackButton } = useLocalSearchParams();
  const showBack = showBackButton === '1';

  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [selectedTags, setSelectedTags] = useState<SportType[]>([]);
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleRoleSelection = async () => {
    if (selectedRole && selectedTags.length > 0 && userId) {
      setButtonDisabled(true);
      try {
        const updateData = {
          user_metadata: {
            role: selectedRole,
            sports: selectedTags,
          },
        };

        const success = await updateUser(userId, updateData);

        if (success) {
          console.log(
            `User metadata saved successfully. role: ${selectedRole}, sports: ${selectedTags}`
          );
          router.navigate('/(modals)/user/photo-username-selection');
        } else {
          console.error('Failed to update user.');
          ToastAndroid.show('Error updating user. Please try again.', ToastAndroid.SHORT);
        }
      } catch (error) {
        console.error('Error updating user:', error);
        ToastAndroid.show('Error updating user. Please try again.', ToastAndroid.SHORT);
      } finally {
        setButtonDisabled(false);
      }
    } else {
      router.navigate('/(modals)/user/login');
    }
  };

  const getRoleBasedListTitle = () => {
    switch (selectedRole) {
      case Role.Coach:
        return translate('role_selection.role_coach_title');
      case Role.Company:
        return translate('role_selection.role_company_title');
      case Role.User:
        return translate('role_selection.role_user_title');
      default:
        return translate('role_selection.role_user_title');
    }
  };

  useEffect(() => {
    if (selectedRole) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [selectedRole, fadeAnim]);

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
                  <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
              )
            : null,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false} // Remove a barra de rolagem vertical
      >
        <View style={styles.heading}>
          <Text style={styles.header}>{translate('role_selection.header')}</Text>
          <Text style={styles.subtitle}>{translate('role_selection.subtitle')}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.aboutYou}>{translate('role_selection.about_you')}</Text>
          <Text style={styles.description}>{translate('role_selection.description')}</Text>

          <CustomPickerSelect
            onValueChange={(itemValue) => setSelectedRole(itemValue || '')}
            items={[
              { label: translate('role_selection.role_user'), value: Role.User },
              { label: translate('role_selection.role_coach'), value: Role.Coach },
              { label: translate('role_selection.role_company'), value: Role.Company },
            ]}
            placeholder={{
              label: translate('role_selection.select_your_role'),
              value: null,
              color: '#9EA0A4',
            }}
            style={pickerSelectStyles}
          />

          {selectedRole && (
            <Animated.View style={{ opacity: fadeAnim }}>
              <SportsList
                title={getRoleBasedListTitle()}
                onSelectedTagsChange={(tags: SportType[]) => {
                  setSelectedTags(tags);
                }}
              />
            </Animated.View>
          )}

          <TouchableOpacity
            style={[
              defaultStyles.btn,
              !(selectedRole && selectedTags.length > 0) && styles.disabledBtn,
            ]}
            onPress={handleRoleSelection}
            disabled={!selectedRole || selectedTags.length === 0 || isButtonDisabled}
          >
            <Text style={defaultStyles.btnText}>{translate('common.continue')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RoleSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 26,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    gap: spacing.xl,
    justifyContent: 'flex-start',
  },
  heading: {
    alignItems: 'flex-start',
  },
  header: {
    paddingTop: spacing.xl,
    fontFamily: 'mon-b',
    fontWeight: 'bold',
    fontSize: 48,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'mon-sb',
    paddingLeft: spacing.xxs,
  },
  formContainer: {
    gap: spacing.md,
  },
  aboutYou: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'mon-sb',
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C6C6C',
    fontFamily: 'mon-sb',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },
  disabledBtn: {
    backgroundColor: '#ccc',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: 10,
    color: '#6C6C6C',
    paddingRight: 30,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: spacing.xs,
    color: '#6C6C6C',
    paddingRight: 30,
    borderColor: '#c2c2c2',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
