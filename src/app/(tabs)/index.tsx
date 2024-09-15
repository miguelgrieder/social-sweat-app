import { Button, ViewStyle } from 'react-native';
import React from 'react';
import { Screen } from 'src/components/Screen';
import { translate } from '@/app/services/translate';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';

const Home = () => {
  return (
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={['top']}>
      <Link href={'/(modals)/activity_creation'} asChild>
        <Button title={'activity_creation.tsx'} color={Colors.dark} />
      </Link>
    </Screen>
  );
};

export default Home;

const $container: ViewStyle = {
  flex: 1,
};
