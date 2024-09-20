import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';
import { Screen } from 'src/components/Screen';
import { translate } from '@/app/services/translate';
import { Link } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';
import { spacing } from '@/constants/spacing';

const Home = () => {
  return (
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={['top']}>
      <Link href={'/(modals)/activity_creation'} asChild>
        <TouchableOpacity style={defaultStyles.btn}>
          <Text style={defaultStyles.btnText}>{translate('create_activity_screen.title')}</Text>
        </TouchableOpacity>
      </Link>
    </Screen>
  );
};

export default Home;

const $container: ViewStyle = {
  flex: 1,
  padding: spacing.md,
};
