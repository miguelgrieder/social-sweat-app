import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { translate } from '@/app/services/translate';
import { spacing } from '@/constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
      <View style={[styles.card, styles.participatedCard]}>
        <Text
          style={styles.cardTitle}
          numberOfLines={2}
          ellipsizeMode="tail" // Prevents text breaking and adds "..." if necessary
        >
          {translate('profile_screen.activities_participated')}
        </Text>
        <View style={styles.bottomContainer}>
          <View style={styles.iconBackground}>
            <MaterialCommunityIcons name="check-outline" size={20} color="#fff" />
          </View>
          <Text style={styles.cardValue}>{userMetrics?.activities_participated || 0}</Text>
        </View>
      </View>
      <View style={[styles.card, styles.participatingCard]}>
        <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
          {translate('profile_screen.activities_participating')}
        </Text>
        <View style={styles.bottomContainer}>
          <View style={styles.iconBackground}>
            <MaterialCommunityIcons name="run-fast" size={20} color="#fff" />
          </View>
          <Text style={styles.cardValue}>{userMetrics?.activities_participating || 0}</Text>
        </View>
      </View>
      <View style={[styles.card, styles.createdCard]}>
        <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
          {translate('profile_screen.activities_created')}
        </Text>
        <View style={styles.bottomContainer}>
          <View style={styles.iconBackground}>
            <MaterialCommunityIcons name="creation" size={20} color="#fff" />
          </View>
          <Text style={styles.cardValue}>{userMetrics?.activities_created || 0}</Text>
        </View>
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
    borderRadius: spacing.sm,
    marginHorizontal: spacing.xxs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    elevation: spacing.xxs,
    position: 'relative',
    justifyContent: 'space-between',
    height: 100,
  },
  participatedCard: {
    backgroundColor: '#FF6B6B',
  },
  participatingCard: {
    backgroundColor: '#1DD1A1',
  },
  createdCard: {
    backgroundColor: '#576574',
  },
  cardTitle: {
    fontSize: spacing.sm,
    fontFamily: 'mon-sb',
    color: '#fff',
    textAlign: 'left',
    marginBottom: spacing.xxs,
    flexShrink: 1, // Ensure the text shrinks within the container
    maxWidth: '99%', // Constrain the text width to prevent overflow
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  iconBackground: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: spacing.xs,
  },
});
