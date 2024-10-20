import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import Colors from '@/constants/Colors';

interface UserMetrics {
  activities_participated?: number;
  activities_participating?: number;
  activities_created?: number;
}

interface HorizontalCardsProps {
  userMetrics: UserMetrics;
}

const HorizontalCards: React.FC<HorizontalCardsProps> = ({ userMetrics }) => {
  return (
    <View style={styles.cardsContainer}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{translate('profile_screen.activities_participated')}</Text>
        <Text style={styles.cardValue}>{userMetrics?.activities_participated || 0}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{translate('profile_screen.activities_participating')}</Text>
        <Text style={styles.cardValue}>{userMetrics?.activities_participating || 0}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{translate('profile_screen.activities_created')}</Text>
        <Text style={styles.cardValue}>{userMetrics?.activities_created || 0}</Text>
      </View>
    </View>
  );
};

export default HorizontalCards;

const styles = StyleSheet.create({
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.xs,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: spacing.md,
    marginHorizontal: spacing.xxs,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    padding: spacing.sm,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
