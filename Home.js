import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import PressableScale from './PressableScale.js';
import {
  datasource,
  getTypeStyle,
  getCardImage,
  formatMoney,
  formatNumber,
} from './Data.js';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'value', label: 'Value' },
  { value: 'name', label: 'Name' },
  { value: 'number', label: 'Card #' },
];

const Home = ({ navigation }) => {
  const [mydata, setMydata] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const getData = async () => {
    let datastr = await AsyncStorage.getItem('pokedata');
    if (datastr != null) {
      let jsondata = JSON.parse(datastr);
      setMydata(jsondata);
    } else {
      setMydata(datasource);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  let totalCopies = 0;
  let totalValue = 0;
  for (let i = 0; i < mydata.length; i++) {
    totalCopies = totalCopies + mydata[i].quantity;
    totalValue = totalValue + mydata[i].quantity * mydata[i].price;
  }

  let text = search.trim().toLowerCase();
  let shownCards = mydata.filter(
    (card) =>
      card.name.toLowerCase().includes(text) ||
      card.type.toLowerCase().includes(text)
  );
  if (sortBy == 'newest') {
    shownCards.reverse();
  } else if (sortBy == 'value') {
    shownCards.sort((a, b) => b.quantity * b.price - a.quantity * a.price);
  } else if (sortBy == 'name') {
    shownCards.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy == 'number') {
    shownCards.sort((a, b) => a.number - b.number);
  }

  const renderItem = ({ item }) => {
    const typeStyle = getTypeStyle(item.type);
    return (
      <PressableScale
        style={styles.cardRow}
        scaleTo={0.97}
        accessibilityLabel={'Edit ' + item.name}
        onPress={() => {
          let realIndex = mydata.findIndex((card) => card.key == item.key);
          let datastr = JSON.stringify(mydata);
          navigation.navigate('Edit', { datastring: datastr, index: realIndex });
        }}
      >
        <Image
          source={{ uri: getCardImage(item.number) }}
          style={styles.cardImage}
          resizeMode="contain"
          accessibilityLabel={item.name + ' card'}
        />

        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.chipRow}>
            <View style={[styles.chip, { backgroundColor: typeStyle.color }]}>
              <Text style={[styles.chipText, { color: typeStyle.textColor }]}>
                {item.type.toUpperCase()}
              </Text>
            </View>
            <View style={[styles.chip, styles.numberChip]}>
              <Text style={[styles.chipText, styles.numberChipText]}>
                {formatNumber(item.number)}
              </Text>
            </View>
          </View>

          <Text style={styles.cardDetail}>
            {item.quantity} x {formatMoney(item.price)}
          </Text>
          <Text style={styles.cardValue}>
            {formatMoney(item.quantity * item.price)}
          </Text>
        </View>

        <View style={styles.editIcon}>
          <FontAwesome6 name="pen" size={13} color="#1D2B53" />
        </View>
      </PressableScale>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.topBar}>
        <View style={styles.titleRow}>
          <View style={styles.pokeball}>
            <View style={styles.pokeballTop} />
            <View style={styles.pokeballBand} />
            <View style={styles.pokeballCenter} />
          </View>
          <View style={styles.titleText}>
            <Text style={styles.title}>PokeCard Collection</Text>
            <Text style={styles.subtitle}>
              {mydata.length} cards | {totalCopies} copies |{' '}
              {formatMoney(totalValue)}
            </Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <PressableScale
            style={[styles.button, styles.addButton]}
            accessibilityLabel="Add card"
            onPress={() => {
              let datastr = JSON.stringify(mydata);
              navigation.navigate('Add', { datastring: datastr });
            }}
          >
            <FontAwesome6 name="plus" size={14} color="#FFFFFF" />
            <Text style={styles.buttonText}>ADD CARD</Text>
          </PressableScale>

          <PressableScale
            style={[styles.button, styles.summaryButton]}
            accessibilityLabel="Collection summary"
            onPress={() => {
              let datastr = JSON.stringify(mydata);
              navigation.navigate('Summary', { datastring: datastr });
            }}
          >
            <FontAwesome6 name="chart-simple" size={14} color="#1D2B53" />
            <Text style={[styles.buttonText, styles.summaryButtonText]}>
              SUMMARY
            </Text>
          </PressableScale>
        </View>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.searchBox}>
          <FontAwesome6 name="magnifying-glass" size={14} color="#5B6B7F" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name or type"
            placeholderTextColor="#8A94A6"
            value={search}
            onChangeText={(value) => setSearch(value)}
            accessibilityLabel="Search cards"
          />
          {search != '' ? (
            <PressableScale
              style={styles.clearButton}
              scaleTo={0.85}
              accessibilityLabel="Clear search"
              onPress={() => setSearch('')}
            >
              <FontAwesome6 name="xmark" size={12} color="#FFFFFF" />
            </PressableScale>
          ) : null}
        </View>

        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort</Text>
          {sortOptions.map((option) => {
            let selected = option.value == sortBy;
            return (
              <PressableScale
                key={option.value}
                scaleTo={0.9}
                accessibilityLabel={'Sort by ' + option.label}
                accessibilityState={{ selected: selected }}
                style={[styles.sortChip, selected ? styles.sortChipSelected : null]}
                onPress={() => setSortBy(option.value)}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    selected ? styles.sortChipTextSelected : null,
                  ]}
                >
                  {option.label}
                </Text>
              </PressableScale>
            );
          })}
        </View>

        {text != '' ? (
          <Text style={styles.resultText}>
            Showing {shownCards.length} of {mydata.length} cards
          </Text>
        ) : null}
      </View>

      <FlatList
        data={shownCards}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <FontAwesome6 name="box-open" size={36} color="#8A94A6" />
            <Text style={styles.emptyText}>
              {mydata.length == 0
                ? 'No cards yet. Tap ADD CARD to start your collection.'
                : 'No cards match "' + search.trim() + '".'}
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <FontAwesome6 name="star" solid size={13} color="#E3350D" />
            <Text style={styles.footerText}>
              Developed by NELSON (24039810)
            </Text>
          </View>
        }
      />
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pokeball: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#111827',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokeballTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#E3350D',
  },
  pokeballBand: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#111827',
  },
  pokeballCenter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#111827',
    backgroundColor: '#FFFFFF',
  },
  titleText: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#C9D2EA',
    fontSize: 13,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    minHeight: 48,
  },
  addButton: {
    backgroundColor: '#E3350D',
    boxShadow: '0 6px 14px rgba(227, 53, 13, 0.35)',
  },
  summaryButton: {
    backgroundColor: '#FFCB05',
    boxShadow: '0 6px 14px rgba(255, 203, 5, 0.30)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  summaryButtonText: {
    color: '#1D2B53',
  },
  toolbar: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D5DCE8',
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    color: '#1D2B53',
    paddingVertical: 10,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8A94A6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B6B7F',
    marginRight: 2,
  },
  sortChip: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#D5DCE8',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    minHeight: 34,
    justifyContent: 'center',
  },
  sortChipSelected: {
    backgroundColor: '#1D2B53',
    borderColor: '#1D2B53',
  },
  sortChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D2B53',
  },
  sortChipTextSelected: {
    color: '#FFFFFF',
  },
  resultText: {
    fontSize: 13,
    color: '#5B6B7F',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    gap: 14,
    boxShadow: '0 4px 12px rgba(29, 43, 83, 0.10)',
  },
  cardImage: {
    width: 80,
    height: 112,
    borderRadius: 6,
    backgroundColor: '#E6EAF2',
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1D2B53',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  numberChip: {
    backgroundColor: '#E6EAF2',
  },
  numberChipText: {
    color: '#1D2B53',
  },
  cardDetail: {
    fontSize: 14,
    color: '#5B6B7F',
    marginTop: 8,
  },
  cardValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2E7D32',
    marginTop: 2,
  },
  editIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E6EAF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    color: '#5B6B7F',
    fontSize: 15,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  footerText: {
    color: '#5B6B7F',
    fontSize: 13,
  },
});

export default Home;
