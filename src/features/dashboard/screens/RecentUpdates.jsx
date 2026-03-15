import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from '../../../utils/api';
import { useTheme } from 'react-native-paper';

/* ------------------ API ------------------ */
const fetchFeatureUpdates = async () => {
  const response = await api.get('/feature-updates');
  return response?.data?.data || [];
};

/* ------------------ Card UI ------------------ */
function UpdateCard({ update, colors }) {
  const date = new Date(update.CreatedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.dateRow}>
        <Icon name="calendar" size={16} color={colors.muted} />
        <Text style={[styles.dateText, { color: colors.muted }]}>{date}</Text>
      </View>

      <Text style={[styles.title, { color: colors.primary }]}>
        {update.Title}
      </Text>

      <Text style={[styles.desc, { color: colors.text }]} numberOfLines={3}>
        {update.ShortDescription}
      </Text>

      {!!update.ReleaseNotesUrl && (
        <TouchableOpacity
          onPress={() => Linking.openURL(update.ReleaseNotesUrl)}
        >
          <Text style={[styles.link, { color: colors.primary }]}>
            Learn more →
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ------------------ Main Screen ------------------ */
export default function RecentUpdates() {
  const { colors } = useTheme();

  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUpdates = async () => {
    try {
      setLoading(true);
      const data = await fetchFeatureUpdates();
      setUpdates(data || []);
    } catch (e) {
      setUpdates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUpdates();
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.muted }]}>
          Loading recent updates...
        </Text>
      </View>
    );
  }

  if (!updates.length) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Icon name="inbox" size={36} color={colors.muted} />
        <Text style={[styles.emptyText, { color: colors.muted }]}>
          No recent updates available
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={updates}
      keyExtractor={item => String(item.FeatureUpdateId)}
      contentContainerStyle={{ padding: 12 }}
      renderItem={({ item }) => <UpdateCard update={item} colors={colors} />}
    />
  );
}

/* ------------------ Styles ------------------ */
const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
    borderWidth: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  dateText: {
    fontFamily: 'Sansation-Regular',
    fontSize: 12,
  },
  title: {
    fontFamily: 'Sansation-Regular',
    fontSize: 16,
    // fontWeight: '800',
    marginBottom: 6,
  },
  desc: {
    fontFamily: 'Sansation-Regular',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  link: {
    fontFamily: 'Sansation-Regular',
    fontSize: 13,
    // fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  loadingText: {
    fontFamily: 'Sansation-Regular',
    marginTop: 10,
  },
  emptyText: {
    fontFamily: 'Sansation-Regular',
    marginTop: 10,
    fontSize: 14,
  },
});
