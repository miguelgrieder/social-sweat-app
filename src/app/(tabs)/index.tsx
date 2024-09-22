import React, { useState } from 'react';
import { Text, TouchableOpacity, View, ViewStyle, StyleSheet } from 'react-native';
import { Screen } from 'src/components/Screen';
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
    <Screen preset="fixed" contentContainerStyle={styles.container} safeAreaEdges={['top']}>
      {/* Language Switcher */}
      <View style={styles.languageSwitcher}>
        <Text style={styles.languageLabel}>{translate('common.language')}</Text>
        <RNPickerSelect
          onValueChange={(itemValue) => changeLanguage(itemValue)}
          items={[
            { label: 'English', value: 'en' },
            { label: 'Português', value: 'pt' },
          ]}
          value={selectedLanguage}
          style={pickerSelectStyles}
          placeholder={{}}
        />
      </View>

      {/* Activity Creation Button */}
      <Link href={'/(modals)/activity-creation'} asChild>
        <TouchableOpacity style={defaultStyles.btn}>
          <Text style={defaultStyles.btnText}>{translate('create_activity_screen.title')}</Text>
        </TouchableOpacity>
      </Link>
    </Screen>
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
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
    color: 'black',
    paddingRight: spacing.lg,
    width: 150,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 0,
    paddingVertical: spacing.sm,
    color: 'black',
    paddingRight: spacing.lg,
    width: 150,
  },
});
