import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo'; // Import Clerk's useUser hook
import { Screen } from 'src/components/Screen';
import { defaultStyles } from '@/constants/Styles';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import { Picker } from '@react-native-picker/picker';

const RoleSelectionScreen = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser(); // Access the current user object

  const handleRoleSelection = async () => {
    if (selectedRole && user) {
      try {
        // Update the user's public metadata with the selected role
        await user.update({
          publicMetadata: { role: selectedRole }, // Store the role in publicMetadata
        });

        console.log('Role saved successfully:', selectedRole);
        // Navigate to the next screen, or home screen
        router.replace('/home'); // Adjust the path as per your app's flow
      } catch (error) {
        console.error('Error updating role in public metadata:', error);
      }
    }
  };

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{translate('role_selection.title')}</Text>

      <Picker
        selectedValue={selectedRole}
        onValueChange={(itemValue) => setSelectedRole(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select your role" value={null} />
        <Picker.Item label="User" value="user" />
        <Picker.Item label="Coach" value="coach" />
        <Picker.Item label="Company" value="company" />
      </Picker>

      <TouchableOpacity
        style={[defaultStyles.btn, !selectedRole && styles.disabledBtn]}
        onPress={handleRoleSelection}
        disabled={!selectedRole}
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
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontFamily: 'mon-sb',
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: spacing.lg,
  },
  disabledBtn: {
    backgroundColor: '#ccc',
  },
});
