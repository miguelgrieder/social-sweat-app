import React, { useState, useEffect, useCallback } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/spacing';
import { translate } from '@/app/services/translate';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks form submission
  const [error, setError] = useState(null); // Stores error messages

  // Clear error messages when input changes
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [emailAddress, password]);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    // Basic client-side validation
    if (!validateEmail(emailAddress)) {
      setError(translate('sign_in_screen.error.invalidEmail'));
      return;
    }

    if (!validatePassword(password)) {
      setError(translate('sign_in_screen.error.invalidPassword'));
      return;
    }

    setIsSubmitting(true); // Start submission
    setError(null); // Reset error

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        // Handle incomplete sign-in attempts
        setError(translate('sign_in_screen.error.signInIncomplete'));
        console.error('Sign-In Incomplete:', signInAttempt);
      }
    } catch (err) {
      // Handle specific Clerk errors
      if (err?.errors) {
        const clerkError =
          err.errors[0]?.longMessage || translate('sign_in_screen.error.unexpected');
        setError(clerkError);
      } else {
        setError(translate('sign_in_screen.error.unexpected'));
      }
      console.error('Sign-In Error:', err);
    } finally {
      setIsSubmitting(false); // End submission
    }
  }, [isLoaded, emailAddress, password, signIn, setActive, router]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{translate('sign_in_screen.title')}</Text>

      {/* Display Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder={translate('sign_in_screen.placeholder.email')}
        placeholderTextColor={Colors.grey}
        keyboardType="email-address"
        onChangeText={(email) => setEmailAddress(email)}
        editable={!isSubmitting}
        textContentType="emailAddress"
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder={translate('sign_in_screen.placeholder.password')}
        placeholderTextColor={Colors.grey}
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        editable={!isSubmitting}
        textContentType="password"
      />

      <TouchableOpacity
        style={[styles.btnPrimary, isSubmitting && styles.btnDisabled]}
        onPress={onSignInPress}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="log-in-outline" size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnPrimaryText}>{translate('sign_in_screen.button.signIn')}</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Optionally, add a "Forgot Password" link */}

      <Text style={styles.forgotPasswordText}>
        {translate('sign_in_screen.link.forgotPassword')}
      </Text>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>{translate('sign_in_screen.footerText')}</Text>
        <Link href="/(modals)/user/sign-up">
          <Text style={styles.footerLink}> {translate('sign_in_screen.footerLink.signUp')}</Text>
        </Link>
      </View>
    </SafeAreaView>
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
  title: {
    fontSize: 24,
    fontFamily: 'mon-sb',
    color: Colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    fontSize: 16,
    color: '#000',
  },
  btnPrimary: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    width: '100%',
    marginTop: spacing.md,
  },
  btnDisabled: {
    backgroundColor: Colors.grey,
    borderColor: Colors.grey,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'mon-sb',
    marginLeft: 8,
  },
  forgotPasswordText: {
    color: Colors.grey,
    fontSize: 14,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.grey,
  },
  footerLink: {
    fontSize: 14,
    fontFamily: 'mon-sb',
    color: Colors.primary,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});
