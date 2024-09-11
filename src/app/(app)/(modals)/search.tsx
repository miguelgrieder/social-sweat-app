import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native"
import React, { useState } from "react"
import { BlurView } from "expo-blur"
import { defaultStyles } from "src/theme/constants/Styles"
import Animated, { FadeIn, FadeOut, SlideInDown } from "react-native-reanimated"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import Colors from "src/theme/constants/Colors"
import { places } from "assets/data/places"

// @ts-ignore
import DatePicker from "react-native-modern-datepicker"

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

const Page = () => {
  const router = useRouter()

  const [openCard, setOpenCard] = useState(0)
  const [selectedPlace, setSelectedPlace] = useState(0)

  const today = new Date().toISOString().substring(0, 10)

  const onClearAll = () => {
    setSelectedPlace(0)
    setOpenCard(0)
  }

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
            <Text style={styles.previewText}>Where</Text>
            <Text style={styles.previewdData}>I'm flexible</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard == 0 && (
          <>
            <Animated.Text entering={FadeIn} style={styles.cardHeader}>
              Have you exercised today?
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
                      selectedPlace === index
                        ? { fontFamily: "sans-serif-medium" }
                        : { fontFamily: "sans-serif" },
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
            <Text style={styles.previewText}>When</Text>
            <Text style={styles.previewdData}>Any day</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard == 1 && (
          <>
            <Animated.Text entering={FadeIn} style={styles.cardHeader}>
              When's your workout?
            </Animated.Text>
            <Animated.View style={styles.cardBody}>
              <DatePicker
                options={{
                  defaultFont: "sans-serif",
                  headerFont: "sans-serif-medium",
                  mainColor: Colors.primary,
                  borderColor: "transparent",
                }}
                current={today}
                selected={today}
                mode={"calendar"}
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
            <Text style={styles.previewText}>What</Text>
            <Text style={styles.previewdData}>Any activity</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard == 2 && (
          <>
            <Animated.Text entering={FadeIn} style={styles.cardHeader}>
              What activity are you interested?
            </Animated.Text>
          </>
        )}
      </View>

      {/* Footer */}
      <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
        <View
          style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <TouchableOpacity
            style={{ height: "100%", justifyContent: "center" }}
            onPress={onClearAll}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "sans-serif-medium",
                textDecorationLine: "underline",
              }}
            >
              Clear all
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
              color={"#fff"}
            />
            <Text style={defaultStyles.btnText}>Search</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </BlurView>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    elevation: 4,
    gap: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardBody: {
    paddingHorizontal: 20,
  },
  cardHeader: {
    fontFamily: "sans-serif-medium", // TODO: BOLD
    fontSize: 24,
    padding: 20,
  },
  cardPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  container: {
    flex: 1,
    paddingTop: 100,
  },

  inputField: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 10,
  },
  itemBorder: {
    borderBottomColor: Colors.grey,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  place: {
    borderRadius: 10,
    height: 120,
    width: 120,
  },
  placeSelected: {
    borderColor: Colors.grey,
    borderRadius: 10,
    borderWidth: 2,
    height: 120,
    width: 120,
  },
  placesContainer: {
    flexDirection: "row",
    gap: 25,
    marginBottom: 20,
  },
  previewText: {
    color: Colors.grey,
    fontFamily: "sans-serif-medium",
    fontSize: 14,
  },
  previewdData: {
    color: Colors.dark,
    fontFamily: "sans-serif-medium",
    fontSize: 14,
  },
  searchIcon: {
    padding: 10,
  },
  searchSection: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ABABAB",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    height: 50,
    justifyContent: "center",
    marginBottom: 4,
  },
})

export default Page
