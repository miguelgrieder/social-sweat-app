import { Text, ViewStyle } from 'react-native';
import React from 'react';
import { Screen } from 'src/components/Screen';
import { useTranslation } from 'react-i18next';

const Inbox = () => {
  const { t } = useTranslation();

  return (
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={['top']}>
      <Text>{t('inbox_screen.body')}</Text>
    </Screen>
  );
};

export default Inbox;

const $container: ViewStyle = {
  flex: 1,
};
