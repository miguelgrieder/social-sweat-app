import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useRef, useState } from "react"
import Colors from "src/theme/constants/Colors"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { Link } from "expo-router"

const categories = [
  {
    name: "Trending",
    icon: "trending-up",
  },
  {
    name: "Soccer",
    icon: "sports-soccer",
  },
  {
    name: "Baseball",
    icon: "sports-baseball",
  },
  {
    name: "Basketball",
    icon: "sports-basketball",
  },
  {
    name: "Football",
    icon: "sports-football",
  },
  {
    name: "Tennis",
    icon: "sports-tennis",
  },
  {
    name: "Golf",
    icon: "sports-golf",
  },
]

interface Props {
  onCategoryChanged: (category: string) => void
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null)
  const itemsRef = useRef<Array<TouchableOpacity | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index]
    setActiveIndex(index)
    selected?.measure((fx, fy, width, height, px, py) => {
      scrollRef.current?.scrollTo({ x: px - 16, y: 0, animated: true })
    })

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onCategoryChanged(categories[index].name)
  }

  return (
    <SafeAreaView style={{ backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <Link href={"/(modals)/search"} asChild>
            <TouchableOpacity>
              <View style={styles.searchBtn}>
                <Ionicons name="search" size={24} />
                <View>
                  <Text style={{ fontFamily: "sans-serif-medium" }}>Search Experiences</Text>
                  <Text style={{ color: Colors.grey, fontFamily: "sans-serif" }}>
                    Any sport · Any location
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            gap: 20,
            paddingHorizontal: 16,
          }}
        >
          {categories.map((item, index) => (
            <TouchableOpacity
              ref={(el) => (itemsRef.current[index] = el)}
              key={index}
              style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
              onPress={() => selectCategory(index)}
            >
              <MaterialIcons
                name={item.icon as any}
                size={24}
                color={activeIndex === index ? "#000" : Colors.grey}
              />
              <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  actionRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  categoriesBtn: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 4,
  },

  categoriesBtnActive: {
    alignItems: "center",
    borderBottomColor: "#000",
    borderBottomWidth: 2,
    flex: 1,
    justifyContent: "center",
    paddingBottom: 4,
  },
  categoryText: {
    color: Colors.grey,
    fontFamily: "sans-serif-medium",
    fontSize: 14,
  },
  categoryTextActive: {
    color: "#000",
    fontFamily: "sans-serif-medium",
    fontSize: 14,
  },
  container: {
    backgroundColor: "#fff",
    elevation: 2,
    height: 130,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  filterBtn: {
    borderColor: "#A2A0A2",
    borderRadius: 24,
    borderWidth: 1,
    padding: 10,
  },
  searchBtn: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#c2c2c2",
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
    flexDirection: "row",
    gap: 10,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    width: 280,
  },
})

export default ExploreHeader
