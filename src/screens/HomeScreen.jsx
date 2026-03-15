import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Home Screen</Text>

      <TouchableOpacity
        style={styles.logout}
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800' },
  logout: {
    marginTop: 20,
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 8,
  },
  logoutText: { color: '#fff', fontWeight: '700' },
});
