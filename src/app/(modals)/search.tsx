import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { defaultStyles } from '@/constants/Styles';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useFilters } from '@/context/FilterActivityInputContext';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { translate } from '@/app/services/translate';

// @ts-ignore
import DatePicker from 'react-native-modern-datepicker';
import { spacing } from '@/constants/spacing';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const SearchModal = () => {
  const router = useRouter();
  const { setFilters } = useFilters();

  const [openCard, setOpenCard] = useState<number | null>(null);

  const [activityType, setActivityType] = useState<string>(''); // 'spot', 'event', or 'session'
  const [price, setPrice] = useState<string>(''); // Store as string for TextInput
  const [activityId, setActivityId] = useState<string>('');
  const [hostUserId, setHostUserId] = useState<string>('');
  const [datetimeStart, setDatetimeStart] = useState<string>(''); // ISO 8601 date-time string

  const today = new Date().toISOString().substring(0, 10);

  const onClearAll = () => {
    setActivityType('');
    setPrice('');
    setActivityId('');
    setHostUserId('');
    setDatetimeStart('');
    setOpenCard(null);
  };

  const onSearch = () => {
    // Prepare the filters
    const filters = {
      activity_type: activityType || undefined,
      price: price ? parseFloat(price) : undefined,
      activity_id: activityId || undefined,
      host_user_id: hostUserId || undefined,
      datetime_start: datetimeStart || undefined,
    };

    // Update the filters in context
    setFilters(filters);

    router.back();
  };

  return (
    <BlurView
      experimentalBlurMethod="dimezisBlurView"
      style={styles.container}
      intensity={70}
      tint="light"
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* DateTime Start */}
        <View style={styles.card}>
          {openCard !== 1 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(1)}
              style={styles.cardPreview}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text style={styles.previewText}>{translate('explorer_screen.search.when')}</Text>
              <Text style={styles.previewdData}>
                {datetimeStart
                  ? datetimeStart.substring(0, 10)
                  : translate('explorer_screen.search.any_day')}
              </Text>
            </AnimatedTouchableOpacity>
          )}

          {openCard === 1 && (
            <>
              <Animated.Text entering={FadeIn} style={styles.cardHeader}>
                {translate('explorer_screen.search.whens_your_workout')}
              </Animated.Text>
              <Animated.View style={styles.cardBody}>
                <DatePicker
                  options={{
                    defaultFont: 'mon',
                    headerFont: 'mon-sb',
                    mainColor: Colors.primary,
                    borderColor: 'transparent',
                  }}
                  current={today}
                  selected={
                    datetimeStart ? datetimeStart.substring(0, 10).replace(/-/g, '/') : today
                  }
                  mode={'calendar'}
                  onSelectedChange={(date) => {
                    if (date) {
                      const [year, month, day] = date.split('/').map(Number);
                      const isoDate = new Date(year, month - 1, day).toISOString();
                      setDatetimeStart(isoDate);
                    }
                  }}
                />
              </Animated.View>
            </>
          )}
        </View>

        {/* Activity Type */}
        <View style={styles.card}>
          {openCard !== 2 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(2)}
              style={styles.cardPreview}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text style={styles.previewText}>{translate('explorer_screen.search.what')}</Text>
              <Text style={styles.previewdData}>
                {activityType ? activityType : translate('explorer_screen.search.any_activity')}
              </Text>
            </AnimatedTouchableOpacity>
          )}

          {openCard === 2 && (
            <>
              <Animated.Text entering={FadeIn} style={styles.cardHeader}>
                {translate('explorer_screen.search.what_activity_are_you_interested')}
              </Animated.Text>
              <Animated.View style={styles.cardBody}>
                {/* Activity Type Options */}
                {['spot', 'event', 'session'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionButton,
                      activityType === type && styles.optionButtonSelected,
                    ]}
                    onPress={() => setActivityType(type)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        activityType === type && styles.optionTextSelected,
                      ]}
                    >
                      {translate(`activity_types.${type}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </>
          )}
        </View>

        {/* Price */}
        <View style={styles.card}>
          {openCard !== 3 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(3)}
              style={styles.cardPreview}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text style={styles.previewText}>{translate('explorer_screen.search.price')}</Text>
              <Text style={styles.previewdData}>
                {price ? `$${price}` : translate('explorer_screen.search.any_price')}
              </Text>
            </AnimatedTouchableOpacity>
          )}

          {openCard === 3 && (
            <>
              <Animated.Text entering={FadeIn} style={styles.cardHeader}>
                {translate('explorer_screen.search.enter_price')}
              </Animated.Text>
              <Animated.View style={styles.cardBody}>
                <TextInput
                  style={styles.inputField}
                  keyboardType="numeric"
                  placeholder={translate('explorer_screen.search.price_placeholder')}
                  value={price}
                  onChangeText={setPrice}
                />
              </Animated.View>
            </>
          )}
        </View>

        {/* Activity ID */}
        <View style={styles.card}>
          {openCard !== 4 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(4)}
              style={styles.cardPreview}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text style={styles.previewText}>
                {translate('explorer_screen.search.activity_id')}
              </Text>
              <Text style={styles.previewdData}>
                {activityId || translate('explorer_screen.search.any_activity_id')}
              </Text>
            </AnimatedTouchableOpacity>
          )}

          {openCard === 4 && (
            <>
              <Animated.Text entering={FadeIn} style={styles.cardHeader}>
                {translate('explorer_screen.search.enter_activity_id')}
              </Animated.Text>
              <Animated.View style={styles.cardBody}>
                <TextInput
                  style={styles.inputField}
                  placeholder={translate('explorer_screen.search.activity_id_placeholder')}
                  value={activityId}
                  onChangeText={setActivityId}
                />
              </Animated.View>
            </>
          )}
        </View>

        {/* Host User ID */}
        <View style={styles.card}>
          {openCard !== 5 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(5)}
              style={styles.cardPreview}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text style={styles.previewText}>
                {translate('explorer_screen.search.host_user_id')}
              </Text>
              <Text style={styles.previewdData}>
                {hostUserId || translate('explorer_screen.search.any_host_user_id')}
              </Text>
            </AnimatedTouchableOpacity>
          )}

          {openCard === 5 && (
            <>
              <Animated.Text entering={FadeIn} style={styles.cardHeader}>
                {translate('explorer_screen.search.enter_host_user_id')}
              </Animated.Text>
              <Animated.View style={styles.cardBody}>
                <TextInput
                  style={styles.inputField}
                  placeholder={translate('explorer_screen.search.host_user_id_placeholder')}
                  value={hostUserId}
                  onChangeText={setHostUserId}
                />
              </Animated.View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <Animated.View
        style={[defaultStyles.footer, { height: 70 }]}
        entering={SlideInDown.delay(200)}
      >
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <TouchableOpacity
            style={{ height: '100%', justifyContent: 'center' }}
            onPress={onClearAll}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'mon-sb',
                textDecorationLine: 'underline',
              }}
            >
              {translate('explorer_screen.search.clear_all')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 50 }]}
            onPress={onSearch}
          >
            <Ionicons
              name="search-outline"
              size={24}
              style={defaultStyles.btnIcon}
              color={'#fff'}
            />
            <Text style={defaultStyles.btnText}>{translate('explorer_screen.search.search')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    margin: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: 20,
  },
  cardHeader: {
    fontFamily: 'mon-b',
    fontSize: 24,
    padding: 20,
  },
  cardBody: {
    paddingHorizontal: 20,
  },
  cardPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },

  searchSection: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ABABAB',
    borderRadius: 8,
    marginBottom: 4,
  },
  searchIcon: {
    padding: 10,
  },
  placesContainer: {
    flexDirection: 'row',
    gap: 25,
    marginBottom: 20,
  },
  place: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  placeSelected: {
    borderColor: Colors.grey,
    borderWidth: 2,
    borderRadius: 10,
    width: 120,
    height: 120,
  },
  previewText: {
    fontFamily: 'mon-sb',
    fontSize: 14,
    color: Colors.grey,
  },
  previewdData: {
    fontFamily: 'mon-sb',
    fontSize: 14,
    color: Colors.dark,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.grey,
  },
  optionButton: {
    padding: spacing.xs,
    borderRadius: spacing.xs,
    borderWidth: 1,
    borderColor: Colors.grey,
    marginBottom: spacing.xs,
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary_light,
    borderColor: Colors.primary,
  },
  optionText: {
    fontFamily: 'mon',
    color: Colors.dark,
  },
  optionTextSelected: {
    fontFamily: 'mon-sb',
    color: Colors.primary,
  },
  inputField: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.xs,
    fontFamily: 'mon',
    marginBottom: spacing.xs,
  },
});

export default SearchModal;
