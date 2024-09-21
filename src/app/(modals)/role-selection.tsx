import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Screen } from 'src/components/Screen';
import { defaultStyles } from '@/constants/Styles';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import { Picker } from '@react-native-picker/picker';

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
        router.push('/(modals)/photo-upload');
        return;
      } catch (error) {
        console.error('Error updating role in public metadata:', error);
        return;
      }
    }
    router.navigate('/login');
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

        <View style={styles.picker}>
          <Picker
            style={{ flex: 1, color: '#6C6C6C' }}
            selectedValue={selectedRole}
            onValueChange={(itemValue) => setSelectedRole(itemValue)}
          >
            <Picker.Item label="Select your role" value={null} />
            <Picker.Item label="User" value="user" />
            <Picker.Item label="Coach" value="coach" />
            <Picker.Item label="Company" value="company" />
          </Picker>
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
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#E3E7EC',
    justifyContent: 'center',
  },
  disabledBtn: {
    backgroundColor: '#ccc',
  },
});
