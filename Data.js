const datasource = [
  { key: '1', name: 'Bulbasaur', number: 1, type: 'Grass', quantity: 2, price: 0.3 },
  { key: '2', name: 'Charizard ex', number: 6, type: 'Fire', quantity: 1, price: 8.5 },
  { key: '3', name: 'Squirtle', number: 7, type: 'Water', quantity: 3, price: 0.3 },
  { key: '4', name: 'Pikachu', number: 25, type: 'Lightning', quantity: 2, price: 0.8 },
  { key: '5', name: 'Alakazam ex', number: 65, type: 'Psychic', quantity: 1, price: 3.2 },
  { key: '6', name: 'Machamp', number: 68, type: 'Fighting', quantity: 1, price: 0.5 },
  { key: '7', name: 'Mew ex', number: 151, type: 'Psychic', quantity: 1, price: 4.0 },
];

const types = [
  { label: 'Grass', color: '#5DAE3B', textColor: '#FFFFFF' },
  { label: 'Fire', color: '#EE8130', textColor: '#FFFFFF' },
  { label: 'Water', color: '#4A90E2', textColor: '#FFFFFF' },
  { label: 'Lightning', color: '#F7D02C', textColor: '#4A3B00' },
  { label: 'Psychic', color: '#A33EA1', textColor: '#FFFFFF' },
  { label: 'Fighting', color: '#C22E28', textColor: '#FFFFFF' },
  { label: 'Dragon', color: '#6F35FC', textColor: '#FFFFFF' },
  { label: 'Colorless', color: '#A8A77A', textColor: '#FFFFFF' },
];

const getTypeStyle = (typeName) => {
  let found = types.find((t) => t.label == typeName);
  if (found == undefined) {
    found = types[types.length - 1];
  }
  return found;
};

const MAX_CARD_NUMBER = 207;

const getCardImage = (number) =>
  'https://dz3we2x72f7ol.cloudfront.net/expansions/151/en-us/SV3pt5_EN_' +
  number +
  '-2x.png';

const formatMoney = (amount) => 'S$' + Number(amount).toFixed(2);

const formatNumber = (number) => '#' + String(number).padStart(3, '0');

export {
  datasource,
  types,
  getTypeStyle,
  MAX_CARD_NUMBER,
  getCardImage,
  formatMoney,
  formatNumber,
};
