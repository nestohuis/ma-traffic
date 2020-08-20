import numeral from 'numeral';

numeral.register('locale', 'id', {
  delimiters: {
    thousands: '.',
    decimal: ',',
  },
  abbreviations: {
    thousand: 'ribu',
    million: 'juta',
    billion: 'mi',
    trillion: 'tr',
  },
  currency: {
    symbol: 'IDR ',
  },
});

numeral.locale('id');

export default function install(Vue) {
  Object.defineProperties(Vue.prototype, {
    $numeral: {
      get() {
        return numeral;
      },
    },
  });
}
