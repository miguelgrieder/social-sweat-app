import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { translate } from '@/app/services/translate';
import { Link } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';
import { spacing } from '@/constants/spacing';
import i18next from 'i18next';
import CustomPickerSelect from '@/components/CustomPickerSelect';
import Colors from '@/constants/Colors';

const Home = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(i18next.language); // Get the current language

  const changeLanguage = (lang) => {
    setSelectedLanguage(lang);
    i18next.changeLanguage(lang); // Change the language using i18next
  };

  // Update selectedLanguage when the language changes
  useEffect(() => {
    const handleLanguageChange = (lng) => setSelectedLanguage(lng);
    i18next.on('languageChanged', handleLanguageChange);
    return () => {
      i18next.off('languageChanged', handleLanguageChange);
    };
  }, [i18next]);

  return (
    <View style={styles.container}>
      {/* Language Switcher */}
      <Text style={styles.languageLabel}>{translate('common.language')}</Text>
      <View style={defaultStyles.btnViewPickerSelectStyles}>
        <CustomPickerSelect
          onValueChange={(itemValue) => changeLanguage(itemValue)}
          items={[
            { label: 'English', value: 'en' },
            { label: 'Português', value: 'pt' },
          ]}
          value={selectedLanguage}
          style={defaultStyles.pickerSelectStyles}
          placeholder={{ label: translate('common.language'), value: null }}
        />
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        {/* Update Profile Button */}
        <Link href={'/(modals)/user/role-selection?showBackButton=1'} asChild>
          <TouchableOpacity style={defaultStyles.btn}>
            <Text style={defaultStyles.btnText}>{translate('home_screen.update_profile')}</Text>
          </TouchableOpacity>
        </Link>

        {/* Activity Creation Button */}
        <Link href={'/(modals)/activity-creation'} asChild>
          <TouchableOpacity style={defaultStyles.btn}>
            <Text style={defaultStyles.btnText}>{translate('create_activity_screen.title')}</Text>
          </TouchableOpacity>
        </Link>

        {/* My ActivitiesBottomSheetList Button */}
        <Link href={'/(modals)/hosted-activities'} asChild>
          <TouchableOpacity style={defaultStyles.btn}>
            <Text style={defaultStyles.btnText}>{translate('home_screen.hosted_activities')}</Text>
          </TouchableOpacity>
        </Link>

        {/* Next ActivitiesBottomSheetList Button */}
        <Link href={'/(modals)/my-next-activities'} asChild>
          <TouchableOpacity style={defaultStyles.btn}>
            <Text style={defaultStyles.btnText}>
              {translate('activity_screen.my_next_activities')}
            </Text>
          </TouchableOpacity>
        </Link>
        <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={{ color: Colors.grey, fontSize: spacing.xs }}>
            server: {process.env.EXPO_PUBLIC_API_MICROSERVICE}
          </Text>
          <Text style={{ color: Colors.grey, fontSize: spacing.xs }}>
            {process.env.EXPO_PUBLIC_VERSION}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  languageLabel: {
    fontSize: 16,
  },
  buttonsContainer: {
    gap: spacing.xs,
  },
});
