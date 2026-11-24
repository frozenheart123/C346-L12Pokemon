import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import PressableScale from './PressableScale.js';
import {
  checkCard,
  CardPreview,
  FormInput,
  QuantityStepper,
  TypeChips,
} from './FormParts.js';

const Edit = ({ navigation, route }) => {
  let mydata = JSON.parse(route.params.datastring);
  let index = route.params.index;
  let card = mydata[index];

  const [name, setName] = useState(card.name);
  const [number, setNumber] = useState(String(card.number));
  const [type, setType] = useState(card.type);
  const [quantity, setQuantity] = useState(String(card.quantity));
  const [price, setPrice] = useState(String(card.price));

  const [submitted, setSubmitted] = useState(false);
  let errors = {};
  if (submitted) {
    errors = checkCard(name, number, quantity, price);
  }
  let hasErrors = Object.keys(errors).length > 0;

  const setData = async (value) => {
    await AsyncStorage.setItem('pokedata', value);
    navigation.goBack();
  };

  const deleteCard = () => {
    mydata.splice(index, 1);
    setData(JSON.stringify(mydata));
  };

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
        <Text style={styles.title}>Edit Card</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <CardPreview number={number} />

        <FormInput
          label="Card name"
          value={name}
          onChangeText={(text) => setName(text)}
          error={errors.name}
        />

        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <FormInput
              label="Card no. (151 set)"
              keyboardType="numeric"
              maxLength={3}
              value={number}
              onChangeText={(text) => setNumber(text)}
              error={errors.number}
            />
          </View>
          <View style={styles.inputHalf}>
            <QuantityStepper
              label="Quantity"
              value={quantity}
              onChange={(text) => setQuantity(text)}
              error={errors.quantity}
            />
          </View>
        </View>

        <TypeChips label="Type" value={type} onChange={(value) => setType(value)} />

        <FormInput
          label="Value per card (S$)"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={(text) => setPrice(text)}
          error={errors.price}
        />

        {hasErrors ? (
          <View style={styles.errorBanner}>
            <FontAwesome6 name="circle-exclamation" size={14} color="#D32F2F" />
            <Text style={styles.errorBannerText}>
              Please fix the fields marked in red.
            </Text>
          </View>
        ) : null}

        <View style={styles.buttonRow}>
          <PressableScale
            style={[styles.button, styles.saveButton]}
            accessibilityLabel="Save changes"
            onPress={() => {
              setSubmitted(true);
              let problems = checkCard(name, number, quantity, price);
              if (Object.keys(problems).length > 0) {
                return;
              }

              mydata[index].name = name.trim();
              mydata[index].number = Number(number);
              mydata[index].type = type;
              mydata[index].quantity = Number(quantity);
              mydata[index].price = Number(price);

              let stringdata = JSON.stringify(mydata);
              setData(stringdata);
            }}
          >
            <FontAwesome6 name="floppy-disk" size={15} color="#FFFFFF" />
            <Text style={styles.buttonText}>SAVE</Text>
          </PressableScale>

          <PressableScale
            style={[styles.button, styles.deleteButton]}
            accessibilityLabel={'Delete ' + card.name}
            onPress={() => {
              if (Platform.OS === 'web') {
                if (window.confirm('Are you sure you want to delete ' + card.name + '?')) {
                  deleteCard();
                }
              } else {
                Alert.alert('Are you sure?', 'Delete ' + card.name + '?', [
                  { text: 'Yes', onPress: () => deleteCard() },
                  { text: 'No' },
                ]);
              }
            }}
          >
            <FontAwesome6 name="trash-can" size={15} color="#D32F2F" />
            <Text style={[styles.buttonText, styles.deleteText]}>DELETE</Text>
          </PressableScale>
        </View>
      </ScrollView>
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
  form: {
    padding: 16,
    paddingBottom: 40,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FDECEC',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
  },
  errorBannerText: {
    color: '#B71C1C',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    minHeight: 52,
  },
  saveButton: {
    backgroundColor: '#1D2B53',
    boxShadow: '0 6px 14px rgba(29, 43, 83, 0.30)',
  },
  deleteButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D32F2F',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  deleteText: {
    color: '#D32F2F',
  },
});

export default Edit;
