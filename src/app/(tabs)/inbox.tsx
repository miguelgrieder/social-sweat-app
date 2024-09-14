import { Text, ViewStyle } from 'react-native';
import React from 'react';
import { Screen } from 'src/components/Screen';
import { translate } from '@/app/services/translate';

const Inbox = () => {
  return (
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={['top']}>
      <Text>{translate('inbox_screen.body')}</Text>
    </Screen>
  );
};

export default Inbox;

const $container: ViewStyle = {
  flex: 1,
};
