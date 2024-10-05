import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import { defaultStyles } from '@/constants/Styles';
import DateInputField from '@/components/DateInputField';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateUser } from '@/api/updateUser';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const BirthdateSelectionScreen = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const [selectedBirthDate, setSelectedBirthDate] = useState<string | null>(null);

  const handleBirthdateSubmit = async () => {
    if (selectedBirthDate && userId) {
      try {
        const updateData = {
          user_metadata: {
            birth_date: selectedBirthDate,
          },
        };

        const success = await updateUser(userId, updateData);

        if (success) {
          console.log('Birthdate saved successfully:', selectedBirthDate);
          router.navigate('/(tabs)/');
        } else {
          console.error('Failed to update birthdate.');
          ToastAndroid.show('Error updating birthdate. Please try again.', ToastAndroid.SHORT);
        }
      } catch (error) {
        console.error('Error updating birthdate:', error);
        ToastAndroid.show('Error updating birthdate. Please try again.', ToastAndroid.SHORT);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity style={styles.roundButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={'#000'} />
            </TouchableOpacity> // Header back button
          ),
        }}
      />
      <Text style={styles.header}>{translate('birthdate-selection.header')}</Text>
      <DateInputField
        onDateSelected={(date) => {
          setSelectedBirthDate(date);
        }}
      />
      <Text style={styles.description}>{translate('birthdate-selection.description')}</Text>
      <TouchableOpacity
        style={[
          defaultStyles.btn,
          styles.continueBtn,
          !selectedBirthDate && styles.disabledContinueBtn,
        ]}
        onPress={handleBirthdateSubmit}
        disabled={!selectedBirthDate}
      >
        <Text style={defaultStyles.btnText}>{translate('common.continue')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.xxl,
    paddingVertical: 20,
    alignItems: 'center',
    paddingHorizontal: 26,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  header: {
    paddingTop: spacing.xl,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'mon-b',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6C6C6C',
    fontWeight: '500',
    fontFamily: 'mon-sb',
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  continueBtn: {
    width: '100%',
  },
  disabledContinueBtn: {
    backgroundColor: '#ccc',
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
});

export default BirthdateSelectionScreen;
