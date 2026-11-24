import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import PressableScale from './PressableScale.js';
import { types, MAX_CARD_NUMBER, getCardImage } from './Data.js';

const checkCard = (name, number, quantity, price) => {
  let errors = {};
  let cardNumber = Number(number);
  let cardQuantity = Number(quantity);
  let cardPrice = Number(price);

  if (name.trim() == '') {
    errors.name = 'Please enter the card name.';
  }
  if (
    number.trim() == '' ||
    !Number.isInteger(cardNumber) ||
    cardNumber < 1 ||
    cardNumber > MAX_CARD_NUMBER
  ) {
    errors.number = 'Use a number from 1 to ' + MAX_CARD_NUMBER + '.';
  }
  if (!Number.isInteger(cardQuantity) || cardQuantity < 1) {
    errors.quantity = 'Must be 1 or more.';
  }
  if (price.trim() == '' || isNaN(cardPrice) || cardPrice < 0) {
    errors.price = 'Enter a value like 0.80';
  }
  return errors;
};

const CardPreview = ({ number }) => {
  let previewNumber = Number(number);
  let valid =
    number.trim() != '' &&
    Number.isInteger(previewNumber) &&
    previewNumber >= 1 &&
    previewNumber <= MAX_CARD_NUMBER;

  return (
    <View style={styles.previewBox}>
      {valid ? (
        <Image
          source={{ uri: getCardImage(previewNumber) }}
          style={styles.previewImage}
          resizeMode="contain"
          accessibilityLabel={'Card number ' + previewNumber}
        />
      ) : (
        <View style={styles.previewEmpty}>
          <FontAwesome6 name="image" size={28} color="#8A94A6" />
          <Text style={styles.previewText}>
            Type a card number (1 - {MAX_CARD_NUMBER}) to see the card
          </Text>
        </View>
      )}
    </View>
  );
};

const FormInput = ({ label, error, ...inputProps }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        style={[
          styles.input,
          focused ? styles.inputFocused : null,
          error ? styles.inputError : null,
        ]}
        placeholderTextColor="#8A94A6"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const QuantityStepper = ({ label, value, onChange, error }) => {
  let current = parseInt(value);
  if (isNaN(current)) {
    current = 0;
  }

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.stepper, error ? styles.inputError : null]}>
        <PressableScale
          style={styles.stepButton}
          scaleTo={0.85}
          accessibilityLabel="Decrease quantity"
          onPress={() => onChange(String(Math.max(1, current - 1)))}
        >
          <FontAwesome6 name="minus" size={14} color="#1D2B53" />
        </PressableScale>

        <TextInput
          style={styles.stepValue}
          keyboardType="numeric"
          maxLength={3}
          value={value}
          onChangeText={onChange}
          accessibilityLabel="Quantity"
        />

        <PressableScale
          style={styles.stepButton}
          scaleTo={0.85}
          accessibilityLabel="Increase quantity"
          onPress={() => onChange(String(Math.min(999, current + 1)))}
        >
          <FontAwesome6 name="plus" size={14} color="#1D2B53" />
        </PressableScale>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const TypeChips = ({ label, value, onChange }) => {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipWrap}>
        {types.map((t) => {
          let selected = t.label == value;
          return (
            <PressableScale
              key={t.label}
              scaleTo={0.9}
              accessibilityLabel={t.label + ' type'}
              accessibilityState={{ selected: selected }}
              onPress={() => onChange(t.label)}
              style={[
                styles.typeChip,
                { borderColor: t.color },
                selected ? { backgroundColor: t.color } : null,
              ]}
            >
              {selected ? (
                <FontAwesome6 name="check" size={11} color={t.textColor} />
              ) : (
                <View style={[styles.typeDot, { backgroundColor: t.color }]} />
              )}
              <Text
                style={[
                  styles.typeChipText,
                  { color: selected ? t.textColor : '#1D2B53' },
                ]}
              >
                {t.label}
              </Text>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginTop: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D2B53',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D5DCE8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1D2B53',
  },
  inputFocused: {
    borderColor: '#3B6FD8',
    backgroundColor: '#F7FAFF',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  previewBox: {
    alignItems: 'center',
    marginBottom: 4,
  },
  previewImage: {
    width: 150,
    height: 210,
    borderRadius: 8,
    backgroundColor: '#E6EAF2',
  },
  previewEmpty: {
    width: 150,
    height: 210,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#AEB9D6',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  previewText: {
    color: '#5B6B7F',
    fontSize: 13,
    textAlign: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D5DCE8',
    borderRadius: 12,
    padding: 4,
  },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E6EAF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepValue: {
    flex: 1,
    minWidth: 0,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#1D2B53',
    paddingVertical: 6,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderRadius: 999,
    paddingHorizontal: 12,
    minHeight: 38,
    backgroundColor: '#FFFFFF',
  },
  typeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export { checkCard, CardPreview, FormInput, QuantityStepper, TypeChips };
