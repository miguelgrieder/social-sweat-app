import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import moment from 'moment';

import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { spacing } from '@/constants/spacing';
import { translate } from '@/app/services/translate';
import { useState } from 'react';

// @ts-ignore
import DatePicker from 'react-native-modern-datepicker';

interface DateInputFieldProps {
  onDateSelected: (date: string) => void;
}

const DateInputField = ({ onDateSelected }: DateInputFieldProps) => {
  const currentDate = new Date().toISOString().substring(0, 10);
  const [visibility, setVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        <Text style={styles.textInputTitle}>{translate('birthdate-selection.inputTitle')}</Text>
        <TouchableOpacity
          style={[defaultStyles.inputField, styles.textInputWrapper]}
          onPress={() => setVisibility(true)}
        >
          <TextInput
            editable={false}
            value={
              selectedDate === '' ? '' : moment(selectedDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
            }
            style={styles.textInput}
            placeholder={translate('birthdate-selection.inputPlaceholder')}
            placeholderTextColor={Colors.grey}
          />
          <Ionicons name="calendar-outline" style={styles.textInputIcon} />
        </TouchableOpacity>
      </View>
      <Modal visible={visibility} transparent={true} animationType="fade">
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          style={styles.datePickerBlurView}
          intensity={30}
          tint="systemThickMaterialDark"
        >
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerTitle}>
              {translate('birthdate-selection.selectBirthdate')}
            </Text>
            <DatePicker
              style={styles.datePicker}
              options={{
                textFontSize: 14,
                defaultFont: 'mon',
                headerFont: 'mon-sb',
                mainColor: Colors.primary,
                borderColor: '#fff',
              }}
              mode={'calendar'}
              minimumDate="1900-01-01"
              maximumDate={currentDate}
              current={selectedDate === '' ? currentDate : selectedDate}
              selected={selectedDate === '' ? currentDate : selectedDate}
              onDateChange={(date: string) => {
                setSelectedDate(date);
              }}
            />
            <View style={styles.datePickerActionContainer}>
              <TouchableOpacity
                onPress={() => setVisibility(false)}
                style={styles.datePickerActionButton}
              >
                <Text style={(styles.datePickerActionButtonText, { color: '#ff4747' })}>
                  {translate('common.cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setVisibility(false);
                  onDateSelected(moment(selectedDate, 'YYYY-MM-DD').format('DD/MM/YYYY'));
                }}
                style={[defaultStyles.btn, styles.datePickerActionButton]}
              >
                <Text style={(styles.datePickerActionButtonText, { color: '#fff' })}>
                  {translate('common.apply')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  textInputContainer: {
    gap: spacing.xs,
  },

  textInputTitle: {
    fontSize: 14,
  },

  textInputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
    color: '#6C6C6C',
  },

  textInputIcon: {
    fontSize: 20,
    color: '#171725',
  },

  datePickerBlurView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  datePickerContainer: {
    width: 350,
    height: 500,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderRadius: spacing.lg,
  },

  datePicker: {
    backgroundColor: '#fff',
  },

  datePickerTitle: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 10,
    textAlign: 'left',
    fontWeight: '600',
    fontFamily: 'mon-sb',
  },

  datePickerActionContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
  },

  datePickerActionButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: spacing.md,
    justifyContent: 'center',
  },

  datePickerActionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'mon-sb',
  },
});

export default DateInputField;
