import { useLocalSearchParams, useNavigation } from "expo-router"
import React, { useLayoutEffect } from "react"
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Share } from "react-native"
import listingsData from "assets/data/activity-listings.json"
import { Ionicons } from "@expo/vector-icons"
import Colors from "src/theme/constants/Colors"
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated"
import { defaultStyles } from "src/theme/constants/Styles"
import { Listing } from "src/interfaces/listing"

const { width } = Dimensions.get("window")
const IMG_HEIGHT = 300

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const listing: Listing = (listingsData as any[]).find((item) => item.id === id)
  const navigation = useNavigation()
  const scrollRef = useAnimatedRef<Animated.ScrollView>()

  const shareListing = async () => {
    // Share functionality of header share button
    try {
      await Share.share({
        title: listing.name,
        url: listing.listing_url,
      })
    } catch (err) {
      console.log(err)
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerTransparent: true,

      headerBackground: () => (
        <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
      ), // Header opacity effect
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
            <Ionicons name="share-outline" size={22} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="heart-outline" size={22} color={"#000"} />
          </TouchableOpacity>
        </View> // Header share and hearth button
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={"#000"} />
        </TouchableOpacity> // Header back button
      ),
    })
  }, [])

  const scrollOffset = useScrollViewOffset(scrollRef)

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
        },
      ],
    }
  })

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    }
  }, [])
  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        <Animated.Image
          source={{ uri: listing.xl_picture_url }}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{listing.name}</Text>
          <Text style={styles.location}>
            {listing.activity_type} in {listing.smart_location}
          </Text>
          <Text style={styles.information}>{listing.participants} participants</Text>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <Ionicons name="star" size={16} />
            <Text style={styles.ratings}>
              {listing.review_scores_rating / 20} · {listing.number_of_reviews} reviews
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.hostView}>
            <Image source={{ uri: listing.host_picture_url }} style={styles.host} />

            <View>
              <Text style={{ fontWeight: "500", fontSize: 16 }}>Hosted by {listing.host_name}</Text>
              <Text>Host since {listing.host_since}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{listing.description}</Text>
        </View>
      </Animated.ScrollView>

      <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
        <View
          style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>€{listing.price}</Text>
            <Text>registration</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}>
            <Text style={defaultStyles.btnText}>Join Now</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  description: {
    fontFamily: "sans-serif",
    fontSize: 16,
    marginTop: 10,
  },
  divider: {
    backgroundColor: Colors.grey,
    height: StyleSheet.hairlineWidth,
    marginVertical: 16,
  },
  footerPrice: {
    fontFamily: "sans-serif-medium",
    fontSize: 18,
  },
  footerText: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    height: "100%",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
    height: 100,
  },
  host: {
    backgroundColor: Colors.grey,
    borderRadius: 50,
    height: 50,
    width: 50,
  },
  hostView: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  image: {
    height: IMG_HEIGHT,
    width,
  },
  infoContainer: {
    backgroundColor: "#fff",
    padding: 24,
  },
  information: {
    color: Colors.grey,
    fontFamily: "sans-serif",
    fontSize: 16,
    marginVertical: 4,
  },
  location: {
    fontFamily: "sans-serif-medium",
    fontSize: 18,
    marginTop: 10,
  },
  name: {
    fontFamily: "sans-serif-medium",
    fontSize: 26,
    fontWeight: "bold",
  },
  ratings: {
    fontFamily: "sans-serif-medium",
    fontSize: 16,
  },

  roundButton: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 50,
    color: Colors.primary,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
})

export default Page
