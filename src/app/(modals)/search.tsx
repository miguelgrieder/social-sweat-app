import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { BlurView } from 'expo-blur';
import { defaultStyles } from '@/constants/Styles';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { places } from 'assets/data/places';
import { useTranslation } from 'react-i18next';

// @ts-ignore
import DatePicker from 'react-native-modern-datepicker';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const Page = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [openCard, setOpenCard] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState(0);

  const today = new Date().toISOString().substring(0, 10);

  const onClearAll = () => {
    setSelectedPlace(0);
    setOpenCard(0);
  };

  return (
    <BlurView intensity={90} style={styles.container} tint="light">
      {/*  Where */}
      <View style={styles.card}>
        {openCard != 0 && (
          <AnimatedTouchableOpacity
            onPress={() => setOpenCard(0)}
            style={styles.cardPreview}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            <Text style={styles.previewText}>{t('explorer_screen.search.where')}</Text>
            <Text style={styles.previewdData}>{t('explorer_screen.search.im_flexible')}</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard == 0 && (
          <>
            <Animated.Text entering={FadeIn} style={styles.cardHeader}>
              {t('explorer_screen.search.title_have_you_exercised')}
            </Animated.Text>
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.cardBody}>
              <View style={styles.searchSection}>
                <Ionicons style={styles.searchIcon} name="search" size={20} color="#000" />
                <TextInput
                  style={styles.inputField}
                  placeholder="Search activities"
                  placeholderTextColor={Colors.grey}
                />
              </View>
            </Animated.View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.placesContainer}
            >
              {places.map((item, index) => (
                <TouchableOpacity onPress={() => setSelectedPlace(index)} key={index}>
                  <Image
                    source={item.img}
                    style={selectedPlace == index ? styles.placeSelected : styles.place}
                  />
                  <Text
                    style={[
                      { paddingTop: 6 },
                      selectedPlace === index ? { fontFamily: 'mon-sb' } : { fontFamily: 'mon' },
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </View>

      {/* When */}
      <View style={styles.card}>
        {openCard != 1 && (
          <AnimatedTouchableOpacity
            onPress={() => setOpenCard(1)}
            style={styles.cardPreview}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            <Text style={styles.previewText}>{t('explorer_screen.search.when')}</Text>
            <Text style={styles.previewdData}>{t('explorer_screen.search.any_day')}</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard == 1 && (
          <>
            <Animated.Text entering={FadeIn} style={styles.cardHeader}>
              {t('explorer_screen.search.whens_your_workout')}
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
                selected={today}
                mode={'calendar'}
              />
            </Animated.View>
          </>
        )}
      </View>

      {/* Activity */}
      <View style={styles.card}>
        {openCard != 2 && (
          <AnimatedTouchableOpacity
            onPress={() => setOpenCard(2)}
            style={styles.cardPreview}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            <Text style={styles.previewText}>{t('explorer_screen.search.what')}</Text>
            <Text style={styles.previewdData}>{t('explorer_screen.search.any_activity')}</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard == 2 && (
          <>
            <Animated.Text entering={FadeIn} style={styles.cardHeader}>
              {t('explorer_screen.search.what_activity_are_you_interested')}
            </Animated.Text>
          </>
        )}
      </View>

      {/* Footer */}
      <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
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
              {t('explorer_screen.search.clear_all')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 50 }]}
            onPress={() => router.back()}
          >
            <Ionicons
              name="search-outline"
              size={24}
              style={defaultStyles.btnIcon}
              color={'#fff'}
            />
            <Text style={defaultStyles.btnText}>{t('explorer_screen.search.search')}</Text>
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
  inputField: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
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
});

export default Page;
