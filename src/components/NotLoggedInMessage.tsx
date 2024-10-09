import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

import { translate } from '@/app/services/translate';
import { defaultStyles } from '@/constants/Styles';
import { spacing } from '@/constants/spacing';

interface NotLoggedInMessageProps {
  addLink?: boolean;
}

const NotLoggedInMessage: React.FC<NotLoggedInMessageProps> = ({ addLink = true }) => {
  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginPrompt}>{translate('common.not_logged_in')}</Text>
      {addLink && (
        <Link href={'/(modals)/user/login'} asChild>
          <TouchableOpacity style={defaultStyles.btn}>
            <Text style={defaultStyles.btnText}>{translate('common.login')}</Text>
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
};

export default NotLoggedInMessage;

const styles = StyleSheet.create({
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  loginPrompt: {
    fontSize: 16,
    marginBottom: spacing.sm,
  },
});
