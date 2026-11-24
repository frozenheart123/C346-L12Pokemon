import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import PressableScale from './PressableScale.js';
import {
  types,
  getCardImage,
  formatMoney,
  formatNumber,
} from './Data.js';

const Summary = ({ navigation, route }) => {
  let mydata = JSON.parse(route.params.datastring);

  let totalCopies = 0;
  let totalValue = 0;
  let mostValuable = null;

  for (let i = 0; i < mydata.length; i++) {
    let card = mydata[i];
    totalCopies = totalCopies + card.quantity;
    totalValue = totalValue + card.quantity * card.price;
    if (mostValuable == null || card.price > mostValuable.price) {
      mostValuable = card;
    }
  }

  let averageValue = 0;
  if (totalCopies > 0) {
    averageValue = totalValue / totalCopies;
  }

  let typeTotals = [];
  for (let t = 0; t < types.length; t++) {
    let copies = 0;
    let value = 0;
    for (let i = 0; i < mydata.length; i++) {
      if (mydata[i].type == types[t].label) {
        copies = copies + mydata[i].quantity;
        value = value + mydata[i].quantity * mydata[i].price;
      }
    }
    if (copies > 0) {
      typeTotals.push({
        label: types[t].label,
        color: types[t].color,
        copies: copies,
        value: value,
      });
    }
  }
  typeTotals.sort((a, b) => b.value - a.value);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.topBar}>
        <PressableScale
          style={styles.backButton}
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
        >
          <FontAwesome6 name="arrow-left" size={15} color="#FFFFFF" />
          <Text style={styles.backText}>Back</Text>
        </PressableScale>
        <Text style={styles.title}>Collection Summary</Text>
      </View>

      {mydata.length == 0 ? (
        <View style={styles.empty}>
          <FontAwesome6 name="box-open" size={36} color="#8A94A6" />
          <Text style={styles.emptyText}>
            Your collection is empty. Add some cards first!
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>TOTAL COLLECTION VALUE</Text>
            <Text style={styles.totalValue}>{formatMoney(totalValue)}</Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statTile}>
              <Text style={styles.statNumber}>{mydata.length}</Text>
              <Text style={styles.statLabel}>Different cards</Text>
            </View>
            <View style={styles.statTile}>
              <Text style={styles.statNumber}>{totalCopies}</Text>
              <Text style={styles.statLabel}>Total copies</Text>
            </View>
            <View style={styles.statTile}>
              <Text style={styles.statNumber}>{formatMoney(averageValue)}</Text>
              <Text style={styles.statLabel}>Avg per copy</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Most valuable card</Text>
          <View style={styles.bestCard}>
            <Image
              source={{ uri: getCardImage(mostValuable.number) }}
              style={styles.bestImage}
              resizeMode="contain"
            />
            <View style={styles.bestInfo}>
              <FontAwesome6 name="crown" size={18} color="#FFCB05" />
              <Text style={styles.bestName}>{mostValuable.name}</Text>
              <Text style={styles.bestDetail}>
                {mostValuable.type} | {formatNumber(mostValuable.number)}
              </Text>
              <Text style={styles.bestPrice}>
                {formatMoney(mostValuable.price)} each
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Value by type</Text>
          {typeTotals.map((t) => {
            let percent = 0;
            if (totalValue > 0) {
              percent = (t.value / totalValue) * 100;
            }
            return (
              <View key={t.label} style={styles.typeRow}>
                <View style={styles.typeHeader}>
                  <Text style={styles.typeName}>{t.label}</Text>
                  <Text style={styles.typeValue}>
                    {formatMoney(t.value)} ({t.copies}{' '}
                    {t.copies == 1 ? 'copy' : 'copies'})
                  </Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: percent + '%', backgroundColor: t.color },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F8',
  },
  topBar: {
    backgroundColor: '#1D2B53',
    paddingTop: 52,
    paddingBottom: 18,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 999,
    paddingHorizontal: 14,
    minHeight: 40,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 12,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  totalBox: {
    backgroundColor: '#E3350D',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  totalLabel: {
    color: '#FFE3DC',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    marginTop: 4,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  statTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    boxShadow: '0 4px 10px rgba(29, 43, 83, 0.08)',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1D2B53',
  },
  statLabel: {
    fontSize: 12,
    color: '#5B6B7F',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1D2B53',
    marginTop: 20,
    marginBottom: 10,
  },
  bestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    gap: 16,
    boxShadow: '0 4px 10px rgba(29, 43, 83, 0.08)',
  },
  bestImage: {
    width: 100,
    height: 140,
    borderRadius: 6,
    backgroundColor: '#E6EAF2',
  },
  bestInfo: {
    flex: 1,
    gap: 4,
  },
  bestName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1D2B53',
  },
  bestDetail: {
    fontSize: 13,
    color: '#5B6B7F',
  },
  bestPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2E7D32',
  },
  typeRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  typeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1D2B53',
  },
  typeValue: {
    fontSize: 13,
    color: '#5B6B7F',
  },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E6EAF2',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    color: '#5B6B7F',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Summary;
