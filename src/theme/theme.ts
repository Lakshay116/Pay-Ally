import { MD3LightTheme, MD3DarkTheme, MD3Theme } from "react-native-paper"
import { DarkColors, LightColors } from "./colors"

type FontConfig = {
  fontFamily: string
  fontWeight: string
}

interface Fonts {
  regular: FontConfig
  medium: FontConfig
  bold: FontConfig
  heavy: FontConfig
}

const fontConfig: Fonts = {
  regular: {
    fontFamily: "Sansation-Regular",
    fontWeight: "normal"
  },
  medium: {
    fontFamily: "Sansation-Regular",
    fontWeight: "500"
  },
  bold: {
    fontFamily: "Sansation-Bold",
    fontWeight: "700"
  },
  heavy: {
    fontFamily: "Sansation-Bold",
    fontWeight: "900"
  }
}

export const LightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightColors
  },
  fonts: {
    ...MD3LightTheme.fonts,
    ...fontConfig
  }
}

export const DarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkColors
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    ...fontConfig
  }
}