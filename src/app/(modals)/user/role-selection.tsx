import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Screen } from '@/components/Screen';
import { defaultStyles } from '@/constants/Styles';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import RNPickerSelect from 'react-native-picker-select';

const RoleSelectionScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelection = async () => {
    if (selectedRole && user) {
      try {
        await user.update({
          unsafeMetadata: { ...user.unsafeMetadata, role: selectedRole },
        });

        console.log('Role saved successfully:', selectedRole);
        router.push('/(modals)/user/photo-upload');
        return;
      } catch (error) {
        console.error('Error updating role in public metadata:', error);
        return;
      }
    }
    router.navigate('/(modals)/user/login');
  };

  return (
    <Screen preset="fixed" contentContainerStyle={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.heading}>
        <Text style={styles.header}>{translate('role_selection.header')}</Text>
        <Text style={styles.subtitle}>{translate('role_selection.subtitle')}</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.aboutYou}>{translate('role_selection.about_you')}</Text>
        <Text style={styles.description}>{translate('role_selection.description')}</Text>

        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(itemValue) => setSelectedRole(itemValue)}
            items={[
              { label: 'User', value: 'user' },
              { label: 'Coach', value: 'coach' },
              { label: 'Company', value: 'company' },
            ]}
            value={selectedRole}
            style={pickerSelectStyles}
            placeholder={{ label: 'Select your role', value: null, color: '#9EA0A4' }}
            useNativeAndroidPickerStyle={false} // To apply custom styles on Android
            Icon={() => {
              return <View style={styles.iconContainer} />;
            }}
          />
        </View>

        <TouchableOpacity
          style={[defaultStyles.btn, !selectedRole && styles.disabledBtn]}
          onPress={handleRoleSelection}
          disabled={!selectedRole}
        >
          <Text style={defaultStyles.btnText}>{translate('common.continue')}</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default RoleSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
    paddingTop: 100,
    gap: spacing.xxl,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  heading: {
    alignItems: 'flex-start',
  },
  header: {
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E3E7EC',
    borderRadius: 5,
    justifyContent: 'center',
  },
  iconContainer: {
    top: 20,
    right: 10,
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
    paddingRight: 30, // to ensure the text is not cut off
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: spacing.xs,
    color: '#6C6C6C',
    paddingRight: 30, // to ensure the text is not cut off
  },
});
