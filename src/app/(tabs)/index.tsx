import { Text, ViewStyle } from 'react-native';
import React from 'react';
import { Screen } from 'src/components/Screen';

const Home = () => {
  return (
    <Screen preset="fixed" contentContainerStyle={$container} safeAreaEdges={['top']}>
      <Text>Home (Index)</Text>
    </Screen>
  );
};

export default Home;

const $container: ViewStyle = {
  flex: 1,
};
