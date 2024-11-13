import React from 'react';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/spacing';
import { Ionicons } from '@expo/vector-icons';
import { translate } from '@/app/services/translate';

export default function Page() {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <SignedIn>
        <View style={styles.signedInContainer}>
          <Ionicons name="person-circle-outline" size={64} color={Colors.primary} />
          <Text style={styles.greetingText}>
            {translate('login_modal.greeting')}, {user?.emailAddresses[0].emailAddress}
          </Text>
        </View>
      </SignedIn>
      <SignedOut>
        <View style={styles.signedOutContainer}>
          <TouchableOpacity style={styles.btnOutline}>
            <Ionicons name="log-in-outline" size={24} style={defaultStyles.btnIcon} />
            <Link href="/(auth)/sign-in" style={styles.link}>
              <Text style={styles.btnOutlineText}>{translate('login_modal.sign_in')}</Text>
            </Link>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline}>
            <Ionicons name="person-add-outline" size={24} style={defaultStyles.btnIcon} />
            <Link href="/(auth)/sign-up" style={styles.link}>
              <Text style={styles.btnOutlineText}>{translate('login_modal.sign_up')}</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </SignedOut>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signedInContainer: {
    alignItems: 'center',
  },
  greetingText: {
    marginTop: spacing.md,
    fontSize: 20,
    fontFamily: 'mon-sb',
    color: Colors.primary,
  },
  signedOutContainer: {
    width: '100%',
    gap: spacing.sm,
    alignItems: 'center',
  },
  btnOutline: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    width: '80%',
  },
  btnOutlineText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  link: {
    flex: 1,
    textAlign: 'center',
  },
});
