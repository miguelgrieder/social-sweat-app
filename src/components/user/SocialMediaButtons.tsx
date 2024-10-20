import React from 'react';
import { View, TouchableOpacity, Image, Linking, StyleSheet } from 'react-native';
import { spacing } from '@/constants/spacing';
import Colors from '@/constants/Colors';

interface SocialMediaButtonsProps {
  socialMedias: Record<string, any>;
}

const SocialMediaButtons: React.FC<SocialMediaButtonsProps> = ({ socialMedias }) => {
  if (!socialMedias) {
    return null;
  }

  const renderPhoneIcons = () => {
    if (socialMedias.user_phone) {
      const value = socialMedias.user_phone;
      const usePhone = socialMedias.use_phone === true;
      const useSms = socialMedias.use_sms === true;
      const useWhatsApp = socialMedias.use_whatsapp === true;
      const phoneIcons = [];

      if (usePhone) {
        const phoneUrl = `tel:${value}`;
        phoneIcons.push(
          <TouchableOpacity key={`user_phone_phone`} onPress={() => Linking.openURL(phoneUrl)}>
            <Image
              source={require('assets/images/phone_logo.png')}
              style={styles.socialMediaIcon}
            />
          </TouchableOpacity>
        );
      }

      if (useSms) {
        const smsUrl = `sms:${value}`;
        phoneIcons.push(
          <TouchableOpacity key={`user_phone_sms`} onPress={() => Linking.openURL(smsUrl)}>
            <Image source={require('assets/images/sms_logo.png')} style={styles.socialMediaIcon} />
          </TouchableOpacity>
        );
      }

      if (useWhatsApp) {
        const whatsappUrl = `whatsapp://send?phone=${value}`;
        phoneIcons.push(
          <TouchableOpacity
            key={`user_phone_whatsapp`}
            onPress={() => Linking.openURL(whatsappUrl)}
          >
            <Image
              source={require('assets/images/whatsapp_logo.png')}
              style={styles.socialMediaIcon}
            />
          </TouchableOpacity>
        );
      }

      if (phoneIcons.length > 0) {
        return <>{phoneIcons}</>;
      }
    }
    return null;
  };

  const renderSocialMediaIcons = () => {
    return Object.entries(socialMedias).map(([key, value]) => {
      if (
        value &&
        key !== 'user_phone' &&
        key !== 'use_phone' &&
        key !== 'use_sms' &&
        key !== 'use_whatsapp'
      ) {
        let baseUrl = '';
        let iconSource = null;
        switch (key) {
          case 'user_youtube':
            baseUrl = 'https://youtube.com/channel/';
            iconSource = require('assets/images/youtube_logo.png');
            break;
          case 'user_instagram':
            baseUrl = 'https://instagram.com/';
            iconSource = require('assets/images/instagram_logo.png');
            break;
          case 'user_facebook':
            baseUrl = 'https://facebook.com/';
            iconSource = require('assets/images/facebook_logo.png');
            break;
          case 'user_tiktok':
            baseUrl = 'https://tiktok.com/@';
            iconSource = require('assets/images/tiktok_logo.png');
            break;
          case 'user_strava':
            baseUrl = 'https://www.strava.com/athletes/';
            iconSource = require('assets/images/strava_logo.png');
            break;
          default:
            return null;
        }
        const url = baseUrl + value;
        return (
          <TouchableOpacity key={key} onPress={() => Linking.openURL(url)}>
            <Image source={iconSource} style={styles.socialMediaIcon} />
          </TouchableOpacity>
        );
      }
      return null;
    });
  };

  return (
    <View style={styles.socialMediaContainer}>
      {renderPhoneIcons()}
      {renderSocialMediaIcons()}
    </View>
  );
};

export default SocialMediaButtons;

const styles = StyleSheet.create({
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  socialMediaIcon: {
    width: 40,
    height: 40,
  },
});
