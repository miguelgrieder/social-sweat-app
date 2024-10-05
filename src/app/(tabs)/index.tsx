import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { translate } from '@/app/services/translate';
import { Link } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';
import { spacing } from '@/constants/spacing';
import i18next from 'i18next';
import RNPickerSelect from 'react-native-picker-select';

const Home = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(i18next.language); // Get the current language

  const changeLanguage = (lang) => {
    setSelectedLanguage(lang);
    i18next.changeLanguage(lang); // Change the language using i18next
  };

  return (
    <View style={styles.container}>
      {/* Language Switcher */}
      <Text style={styles.languageLabel}>{translate('common.language')}</Text>
      <View style={styles.languageSwitcher}>
        <RNPickerSelect
          onValueChange={(itemValue) => changeLanguage(itemValue)}
          items={[
            { label: 'English', value: 'en' },
            { label: 'Português', value: 'pt' },
          ]}
          value={selectedLanguage}
          style={pickerSelectStyles}
          placeholder={{ label: translate('common.language'), value: null }}
        />
      </View>

      {/* Activity Creation Button */}
      <Link href={'/(modals)/activity-creation'} asChild>
        <TouchableOpacity style={defaultStyles.btn}>
          <Text style={defaultStyles.btnText}>{translate('create_activity_screen.title')}</Text>
        </TouchableOpacity>
      </Link>

      {/* My Activities Button */}
      <Link href={'/(modals)/my-activities'} asChild>
        <TouchableOpacity style={defaultStyles.btn}>
          <Text style={defaultStyles.btnText}>{translate('home_screen.my_activities')}</Text>
        </TouchableOpacity>
      </Link>

      {/* Next Activities Button */}
      <Link href={'/(modals)/my-next-activities'} asChild>
        <TouchableOpacity style={defaultStyles.btn}>
          <Text style={defaultStyles.btnText}>
            {translate('activity_screen.my_next_activities')}
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  languageSwitcher: {
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#ABABAB',
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.xxs,
    paddingVertical: spacing.xxs,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  languageLabel: {
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    color: 'black',
    paddingRight: spacing.lg,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    color: 'black',
    paddingRight: spacing.lg,
  },
});
