import { View, Text, Button, SafeAreaView, StyleSheet } from 'react-native';
import React from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';

const Page = () => {
  const { signOut, isSignedIn } = useAuth();

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Profile</Text>
        <Ionicons name="notifications-outline" size={26} />
      </View>

      {isSignedIn && <Button title="Log Out" onPress={() => signOut()} color={Colors.dark} />}
      {!isSignedIn && (
        <Link href={'/(modals)/login'} asChild>
          <Button title="Log In" color={Colors.dark} />
        </Link>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    fontFamily: 'mon-b',
    fontSize: 24,
  },
});

export default Page;
