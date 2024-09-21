import Colors from '@/constants/Colors';
import { useOAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { Screen } from '@/components/Screen';

import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { defaultStyles } from '@/constants/Styles';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';

enum Strategy {
  Google = 'oauth_google',
  Apple = 'oauth_apple',
  Facebook = 'oauth_facebook',
}

const Page = () => {
  useWarmUpBrowser();

  const router = useRouter();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });
  const { startOAuthFlow: facebookAuth } = useOAuth({ strategy: 'oauth_facebook' });

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Apple]: appleAuth,
      [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.push('/(modals)/user/role-selection');
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  };

  return (
    <Screen preset="auto" contentContainerStyle={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder={translate('common.email')}
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
      />

      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>{translate('common.continue')}</Text>
      </TouchableOpacity>

      <View style={styles.seperatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text style={styles.seperator}>{translate('common.or')}</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>

      <View style={{ gap: 20 }}>
        <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Google)}>
          <Ionicons name="logo-google" size={24} style={defaultStyles.btnIcon} />
          <Text style={styles.btnOutlineText}>{translate('login_modal.continue_with')} Google</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 26,
  },
  seperatorView: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  seperator: {
    fontFamily: 'mon-sb',
    color: Colors.grey,
    fontSize: 16,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
  },
  btnOutlineText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
});
