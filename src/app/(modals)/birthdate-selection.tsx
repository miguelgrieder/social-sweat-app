import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

import { Screen } from '@/components/Screen';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import { defaultStyles } from '@/constants/Styles';
import DateInputField from '@/components/DateInputField';

const BirthdateSelectionScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const [selectedBirthDate, setSelectedBirthDate] = useState<string | null>(null);

  const handleBirthdateSubmit = async () => {
    if (selectedBirthDate && user) {
      try {
        await user.update({
          unsafeMetadata: { ...user.unsafeMetadata, birth_date: selectedBirthDate },
        });
        console.log('Birthdate saved successfully:', selectedBirthDate);
        router.navigate('/(tabs)/');
      } catch (error) {
        console.error('Error updating birthdate in unsafe metadata:', error);
        ToastAndroid.show('Error updating birthdate. Please try again.', ToastAndroid.SHORT);
      }
    }
  };

  return (
    <Screen preset="fixed" contentContainerStyle={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
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
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
    paddingTop: 100,
    gap: spacing.xxl,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },

  header: {
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
});

export default BirthdateSelectionScreen;
