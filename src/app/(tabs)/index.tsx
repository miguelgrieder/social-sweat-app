import React, { useState } from 'react';
import { Text, TouchableOpacity, View, ViewStyle, StyleSheet } from 'react-native';
import { Screen } from 'src/components/Screen';
import { translate } from '@/app/services/translate';
import { Link } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';
import { spacing } from '@/constants/spacing';
import { Picker } from '@react-native-picker/picker';
import i18next from 'i18next';

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
        <Picker
          selectedValue={selectedLanguage}
          style={styles.picker}
          onValueChange={(itemValue) => changeLanguage(itemValue)}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Português" value="pt" />
        </Picker>
      </View>

      {/* Activity Creation Button */}
      <Link href={'/(modals)/activity_creation'} asChild>
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
  picker: {
    height: 50,
    width: 150,
  },
});
