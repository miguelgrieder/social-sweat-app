import React, { useState, useEffect } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSignUp, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/spacing';
import { fetchUsers } from '@/api/fetchUsers';
import { translate } from '@/app/services/translate';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user, isLoaded: userLoaded } = useUser(); // Access user data
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission
  const [isLoggingIn, setIsLoggingIn] = useState(false); // State to track role checking
  const [error, setError] = useState(null); // Stores error messages

  const userId = user?.id; // Extract user ID

  // Clear error messages when input changes
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [username, emailAddress, password, code]);

  // Effect to check user role after verification
  useEffect(() => {
    const checkUserRole = async () => {
      if (isLoggingIn && userLoaded && userId) {
        try {
          const fetchedUsers = await fetchUsers({ id: userId });
          if (fetchedUsers && fetchedUsers.length > 0) {
            const fetchedUser = fetchedUsers[0];
            if (fetchedUser.user_metadata?.role) {
              // User has a role, navigate to main page
              router.navigate('/(tabs)/');
            } else {
              // User doesn't have a role, navigate to role selection
              router.push('/(modals)/user/role-selection');
            }
          } else {
            // User not found, navigate to role selection
            router.push('/(modals)/user/role-selection');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          router.push('/(modals)/user/role-selection');
        } finally {
          setIsLoggingIn(false);
        }
      }
    };

    checkUserRole();
  }, [isLoggingIn, userLoaded, userId, router]);

  // Client-side validation functions
  const validateUsername = (username) => {
    const re = /^[a-zA-Z0-9_]{4,25}$/;
    return re.test(username);
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    // Basic client-side validation
    if (!validateUsername(username)) {
      setError(translate('sign_up_screen.error.invalidUsername'));
      return;
    }

    if (!validateEmail(emailAddress)) {
      setError(translate('sign_up_screen.error.invalidEmail'));
      return;
    }

    if (!validatePassword(password)) {
      setError(translate('sign_up_screen.error.invalidPassword'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress,
        password,
        username,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err) {
      // Handle specific Clerk errors
      if (err?.errors) {
        const clerkError =
          err.errors[0]?.longMessage || translate('sign_up_screen.error.unexpected');
        setError(clerkError);
      } else {
        setError(translate('sign_up_screen.error.unexpected'));
      }
      console.error('Sign Up Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    if (code.trim() === '') {
      setError(translate('sign_up_screen.error.emptyCode'));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        setIsLoggingIn(true);
      } else {
        setError(translate('sign_up_screen.error.verificationIncomplete'));
        console.error('Verification Incomplete:', completeSignUp);
      }
    } catch (err) {
      // Handle specific Clerk errors
      if (err?.errors) {
        const clerkError =
          err.errors[0]?.longMessage || translate('sign_up_screen.error.unexpected');
        setError(clerkError);
      } else {
        setError(translate('sign_up_screen.error.unexpected'));
      }
      console.error('Verification Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {!pendingVerification ? (
        <>
          <Text style={styles.title}>{translate('sign_up_screen.title')}</Text>

          {/* Display Error Message */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={username}
            placeholder={translate('sign_up_screen.placeholder.username')}
            placeholderTextColor={Colors.grey}
            onChangeText={(text) => setUsername(text)}
            editable={!isSubmitting}
            textContentType="username"
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder={translate('sign_up_screen.placeholder.email')}
            placeholderTextColor={Colors.grey}
            keyboardType="email-address"
            onChangeText={(email) => setEmailAddress(email)}
            editable={!isSubmitting}
            textContentType="emailAddress"
          />
          <TextInput
            style={styles.input}
            value={password}
            placeholder={translate('sign_up_screen.placeholder.password')}
            placeholderTextColor={Colors.grey}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            editable={!isSubmitting}
            textContentType="password"
          />

          <TouchableOpacity
            style={[styles.btnPrimary, isSubmitting && styles.btnDisabled]}
            onPress={onSignUpPress}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="person-add-outline" size={24} style={defaultStyles.btnIcon} />
                <Text style={styles.btnPrimaryText}>
                  {translate('sign_up_screen.button.signUp')}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>{translate('sign_up_screen.titleVerify')}</Text>

          {/* Display Error Message */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          <TextInput
            style={styles.input}
            value={code}
            placeholder={translate('sign_up_screen.placeholder.verificationCode')}
            keyboardType="number-pad"
            onChangeText={(text) => setCode(text)}
            editable={!isSubmitting}
            textContentType="oneTimeCode"
          />

          <TouchableOpacity
            style={[styles.btnPrimary, isSubmitting && styles.btnDisabled]}
            onPress={onPressVerify}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-done-outline" size={24} style={defaultStyles.btnIcon} />
                <Text style={styles.btnPrimaryText}>
                  {translate('sign_up_screen.button.verifyEmail')}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </>
      )}

      {/* Footer Section */}
      <View style={styles.footer}>
        {!pendingVerification && (
          <>
            <Text style={styles.footerText}>{translate('sign_up_screen.footerText')}</Text>
            <TouchableOpacity onPress={() => router.push('/(modals)/user/login')}>
              <Text style={styles.footerLink}>
                {' '}
                {translate('sign_up_screen.footerLink.signIn')}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: spacing.lg, // Ensure `spacing.lg` is defined in your spacing constants
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
