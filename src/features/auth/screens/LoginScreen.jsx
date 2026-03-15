import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../../../context/UserContext';
import { useTheme } from 'react-native-paper';
import Config from 'react-native-config';

const BASE_URL = Config.NATIVE_PUBLIC_API;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const { colors } = useTheme();

  const handleLogin = async () => {
    try {
      console.log(BASE_URL);
      if (!email || !password) {
        Alert.alert('Error', 'Email and Password are required');
        return;
      }
      await fetch('https://api-p2p-1.thepvhub.com/api/v1/user/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EmailId: email,
          Password: password,
        }),
      });

      await AsyncStorage.multiRemove(['ACCESS_TOKEN', 'REFRESH_TOKEN']);

      const resp = await fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EmailId: email,
          Password: password,
        }),
      });

      const result = await resp.json();

      if (!resp.ok || !result?.success) {
        Alert.alert('Login Failed', result?.message || 'Invalid credentials');
        return;
      }

      const user = result.data;

      await AsyncStorage.setItem('PAYALLY_USER', JSON.stringify(user));
      setUser(user);

      Alert.alert('Success', `Welcome ${user.FirstName} 👋`);
      navigation.replace('Home');
    } catch (error) {
      console.log('Login Error:', error);
      Alert.alert('Network Error', 'Could not connect to server');
    }
  };

  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={
          colors.background === '#ffffff' ? 'dark-content' : 'light-content'
        }
      />

      <Image
        source={require('../../../assets/thepvhub.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.card}>
        <Text style={styles.title}>Pay-Ally</Text>
        <Text style={styles.subtitle}>Procure Smarter, Pay Easier!</Text>

        <View style={styles.field}>
          <Text style={styles.label}>* Email</Text>
          <TextInput
            placeholder="Enter Email"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>* Password</Text>
          <TextInput
            placeholder="********"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    card: {
      width: '85%',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 24,
      elevation: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      textAlign: 'center',
      fontSize: 28,
      fontWeight: '800',
      color: colors.primary,
    },
    subtitle: {
      textAlign: 'center',
      marginBottom: 20,
      marginTop: 4,
      color: colors.muted,
      fontStyle: 'italic',
    },
    field: { marginBottom: 14 },
    label: { marginBottom: 6, fontWeight: '600', color: colors.text },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    forgot: { color: colors.muted, marginVertical: 8 },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 10,
    },
    buttonText: {
      textAlign: 'center',
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
    },
    logo: {
      width: 140,
      height: 60,
      marginBottom: 20,
    },
  });
