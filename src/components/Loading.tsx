import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { defaultStyles } from '@/constants/Styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';

interface NotLoggedInMessageProps {
  addLink?: boolean;
}

const Loading: React.FC<NotLoggedInMessageProps> = ({ addLink = true }) => {
  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    </SafeAreaView>
  );
};

export default Loading;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
