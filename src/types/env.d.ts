declare module 'react-native-config' {
  export interface NativeConfig {
    NATIVE_PUBLIC_API: string;
  }

  export const Config: NativeConfig;
  export default Config;
}