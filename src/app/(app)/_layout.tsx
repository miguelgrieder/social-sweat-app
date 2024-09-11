import React from "react"
import { observer } from "mobx-react-lite"
import { customFontsToLoad } from "src/theme"
import { useFonts } from "expo-font"
import { SplashScreen, Stack, useRouter, Redirect } from "expo-router"

import { Ionicons } from "@expo/vector-icons"
import Colors from "src/theme/constants/Colors"
import { TouchableOpacity } from "react-native"
import ModalHeaderText from "src/components/ModalHeaderText"

export default observer(function Layout() {
  const router = useRouter()

  const [fontsLoaded, fontError] = useFonts(customFontsToLoad)

  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <Stack>
      {/* <Stack.Screen */}
      {/*  name="(modals)/login" */}
      {/*  options={{ */}
      {/*    presentation: "modal", */}
      {/*    title: "Log in or sign up", */}
      {/*    headerTitleStyle: { */}
      {/*      fontFamily: "sans-serif-medium", */}
      {/*    }, */}
      {/*    headerLeft: () => ( */}
      {/*      <TouchableOpacity onPress={() => router.back()}> */}
      {/*        <Ionicons name="close-outline" size={28} /> */}
      {/*      </TouchableOpacity> */}
      {/*    ), */}
      {/*  }} */}
      {/* /> */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="listing/[id]" options={{ headerTitle: "", headerTransparent: true }} />
      <Stack.Screen
        name="(modals)/search"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerTransparent: true,
          headerTitle: () => <ModalHeaderText />, // TODO: not working
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "#fff",
                borderColor: Colors.grey,
                borderRadius: 20,
                borderWidth: 1,
                padding: 4,
              }}
            >
              <Ionicons name="close-outline" size={22} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  )
})
