import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { translate } from '@/app/services/translate';
import { sportTypeIconMappings } from '@/constants/sportTypeIconMappings';
import Colors from '@/constants/Colors';
import { spacing } from '@/constants/spacing';

interface SportTagProps {
  sport: string;
  key?: number;
}

const SportTag: React.FC<SportTagProps> = ({ sport, key }) => {
  const iconName = sportTypeIconMappings[sport.toLowerCase()] || sport;

  return (
    <View style={styles.tag}>
      <MaterialCommunityIcons name={iconName} size={spacing.sm} color={Colors.primary} />
      <Text style={styles.tagText}>{translate(`activity_sports.${sport.toLowerCase()}`)}</Text>
    </View>
  );
};

export default SportTag;

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary_light,
    borderRadius: 20,
    paddingHorizontal: spacing.xxs,
    paddingVertical: spacing.xxxs,
    margin: spacing.xxxs,
    gap: spacing.xxxs,
  },
  tagText: {
    color: Colors.primary,
  },
});
