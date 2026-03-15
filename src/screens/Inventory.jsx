import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Inventory() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700' },
});
