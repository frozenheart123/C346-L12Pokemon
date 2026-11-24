import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
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

const Add = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [type, setType] = useState('Grass');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');

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
        <Text style={styles.title}>Add Card</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <CardPreview number={number} />

        <FormInput
          label="Card name"
          placeholder="e.g. Pikachu"
          value={name}
          onChangeText={(text) => setName(text)}
          error={errors.name}
        />

        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <FormInput
              label="Card no. (151 set)"
              placeholder="e.g. 25"
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
          placeholder="e.g. 0.80"
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

        <PressableScale
          style={styles.submitButton}
          accessibilityLabel="Submit new card"
          onPress={() => {
            setSubmitted(true);
            let problems = checkCard(name, number, quantity, price);
            if (Object.keys(problems).length > 0) {
              return;
            }

            let mydata = JSON.parse(route.params.datastring);
            let item = {
              key: String(Date.now()),
              name: name.trim(),
              number: Number(number),
              type: type,
              quantity: Number(quantity),
              price: Number(price),
            };
            mydata.push(item);

            let stringdata = JSON.stringify(mydata);
            setData(stringdata);
          }}
        >
          <FontAwesome6 name="floppy-disk" size={15} color="#FFFFFF" />
          <Text style={styles.submitText}>SUBMIT</Text>
        </PressableScale>
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
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E3350D',
    borderRadius: 14,
    minHeight: 52,
    marginTop: 20,
    boxShadow: '0 6px 14px rgba(227, 53, 13, 0.30)',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});

export default Add;
