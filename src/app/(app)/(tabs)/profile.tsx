import React from "react"
import { Screen, Text } from "src/components"
import { ClerkProvider } from "@clerk/clerk-expo"

export default function InboxScreen() {
  return (
    <Screen preset="fixed">
      <Text preset="heading" tx="profileScreen.title" />
    </Screen>
  )
}
