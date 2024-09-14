import { Text, ViewStyle } from 'react-native';
import React from 'react';
import { Screen } from 'src/components/Screen';
import { translate } from '@/app/services/translate';

const Home = () => {
  return (
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={['top']}>
      <Text>{translate('home_screen.body')}</Text>
    </Screen>
  );
};

export default Home;

const $container: ViewStyle = {
  flex: 1,
};
