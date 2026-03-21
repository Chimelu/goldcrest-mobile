export type AssetType = 'currency' | 'crypto' | 'shares';

export type AssetItem = {
  id: string;
  type: AssetType;
  name: string;
  fromTicker: string;
  toTicker: string;
  sellPrice: string;
  fromSymbol: string;
  toSymbol: string;
  change: string;
  imageURL: string;
  /** CoinGecko API id for live USD price (crypto only) */
  coingeckoId?: string;
};

type AssetsData = readonly AssetItem[];

// Copied from craftrn TradingDashboard demo data
export const assets: AssetsData = [
  {
    id: '3e458e61-677c-4d55-b908-507a490a4853',
    type: 'currency',
    name: 'Euro',
    fromTicker: 'EUR',
    toTicker: 'GBP',
    sellPrice: '0.8564',
    fromSymbol: '€',
    toSymbol: '£',
    change: '-0.25%',
    imageURL:
      'https://media.istockphoto.com/id/530234499/photo/european-union-flag.jpg?s=612x612&w=0&k=20&c=jUKgc6dGz74FWIvnyKJwEU-Cq82TQWgRgPlTyf0qPD8=',
  },
  {
    id: '353234ee-982f-4765-937b-2759ca65a759',
    type: 'currency',
    name: 'United States Dollar',
    fromTicker: 'USD',
    toTicker: 'GBP',
    sellPrice: '0.7543',
    fromSymbol: '$',
    toSymbol: '£',
    change: '0.13%',
    imageURL:
      'https://media.istockphoto.com/id/487485528/vector/american-flag.jpg?s=612x612&w=0&k=20&c=6bypKWbj_cY14h00yDllWUpuhrQK2Dn5ilyzOLBnamQ=',
  },
  {
    id: '9d95e10c-959d-4784-9259-595542054599',
    type: 'currency',
    name: 'Pound Sterling',
    fromTicker: 'GBP',
    toTicker: 'JPY',
    sellPrice: '161.83',
    fromSymbol: '£',
    toSymbol: '¥',
    change: '0.63%',
    imageURL:
      'https://media.istockphoto.com/id/497118178/vector/flag-of-great-britain.jpg?s=612x612&w=0&k=20&c=yAuSdTVvmou5r5_gEj7NHdGdYmJfQPorq_9UFz2iEWk=',
  },
  {
    id: '13919513-9c18-467c-be95-b3249585370e',
    type: 'currency',
    name: 'Chinese Yuan',
    fromTicker: 'CNY',
    toTicker: 'GBP',
    sellPrice: '0.1136',
    fromSymbol: '¥',
    toSymbol: '£',
    change: '-0.11%',
    imageURL:
      'https://media.istockphoto.com/id/537287169/vector/flag-of-china.jpg?s=612x612&w=0&k=20&c=PZMieLTEfmwDg7hcnXR3uPfMEld5MOtZRBoVQqi9dZI=',
  },
  {
    id: '3e458e61-677c-4d55-b909-507a490a4853',
    type: 'crypto',
    name: 'Bitcoin',
    coingeckoId: 'bitcoin',
    fromTicker: 'BTC',
    toTicker: 'USD',
    sellPrice: '38805.81',
    fromSymbol: 'BTC',
    toSymbol: '$',
    change: '-2.15%',
    imageURL:
      'https://logos-world.net/wp-content/uploads/2020/08/Bitcoin-Logo.png',
  },
  {
    id: '2b6f0cc7-84d5-45ec-834b-22edd519e6e5',
    type: 'crypto',
    name: 'Ethereum',
    coingeckoId: 'ethereum',
    fromTicker: 'ETH',
    toTicker: 'USD',
    sellPrice: '2960.76',
    fromSymbol: 'ETH',
    toSymbol: '$',
    change: '0.17%',
    imageURL:
      'https://www.citypng.com/public/uploads/preview/ethereum-eth-round-logo-icon-png-701751694969815akblwl2552.png',
  },
  {
    id: '9c4f4a8e-1c6e-4ba4-9ce6-5a6f2fcd6f9c',
    type: 'crypto',
    name: 'Tether',
    coingeckoId: 'tether',
    fromTicker: 'USDT',
    toTicker: 'USD',
    sellPrice: '1.00',
    fromSymbol: 'USDT',
    toSymbol: '$',
    change: '0.00%',
    imageURL:
      'https://w7.pngwing.com/pngs/520/303/png-transparent-tether-united-states-dollar-cryptocurrency-fiat-money-market-capitalization-bitcoin-logo-bitcoin-trade.png',
  },
  {
    id: 'ed38f2c2-cb2f-4f4e-8d8a-6c9e9b25a6a5',
    type: 'crypto',
    name: 'Binance',
    coingeckoId: 'binancecoin',
    fromTicker: 'BNB',
    toTicker: 'USD',
    sellPrice: '309.56',
    fromSymbol: 'BNB',
    toSymbol: '$',
    change: '-0.64%',
    imageURL:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe9rjRtIJJM5o6xP2LqfQFFcWejwFgRA1rag&s',
  },
  {
    id: 'd9c5e6a1-9f5d-4c2a-8f4c-9b7c9a61fe3c',
    type: 'crypto',
    name: 'Ripple',
    coingeckoId: 'ripple',
    fromTicker: 'XRP',
    toTicker: 'USD',
    sellPrice: '0.25801',
    fromSymbol: 'XRP',
    toSymbol: '$',
    change: '-1.51%',
    imageURL:
      'https://www.iconarchive.com/download/i109650/cjdowner/cryptocurrency-flat/Ripple-XRP.1024.png',
  },
  {
    id: 'c3a20c9e-3f1c-4b4e-8a24-2edc8f2b3ecf',
    type: 'crypto',
    name: 'Dogecoin',
    coingeckoId: 'dogecoin',
    fromTicker: 'DOGE',
    toTicker: 'USD',
    sellPrice: '147.02',
    fromSymbol: 'DOGE',
    toSymbol: '$',
    change: '-2.78%',
    imageURL:
      'https://static.wikia.nocookie.net/businessempire/images/c/c7/Crypto_dogecoin.png/revision/latest/thumbnail/width/360/height/450?cb=20230223081450',
  },
  {
    id: 'f4f3f5a7-8eb7-4a9b-8c8b-2ab1c3b4fba3',
    type: 'crypto',
    name: 'Litecoin',
    coingeckoId: 'litecoin',
    fromTicker: 'LTC',
    toTicker: 'USD',
    sellPrice: '169.16',
    fromSymbol: 'LTC',
    toSymbol: '$',
    change: '-0.87%',
    imageURL:
      'https://upload.wikimedia.org/wikipedia/commons/e/e3/Litecoin_Logo.jpg',
  },
  {
    id: '95c3a8c4-8d46-4a4b-8f4c-2f1a7a4f1f0f',
    type: 'crypto',
    name: 'Stellar',
    coingeckoId: 'stellar',
    fromTicker: 'XLM',
    toTicker: 'USD',
    sellPrice: '0.00000000647',
    fromSymbol: 'XLM',
    toSymbol: '$',
    change: '-0.36%',
    imageURL: 'https://s2.coinmarketcap.com/static/img/coins/200x200/512.png',
  },
  {
    id: '5503557c-3726-400b-8001-35c5858860e3',
    type: 'shares',
    name: 'Alphabet',
    fromTicker: 'GOOGL',
    toTicker: 'USD',
    sellPrice: '167.18',
    fromSymbol: 'GOOGL',
    toSymbol: '$',
    change: '0.48%',
    imageURL:
      'https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Google-512.png',
  },
  {
    id: '5503557c-3726-400b-8001-35c5858860i3',
    type: 'shares',
    name: 'Facebook',
    fromTicker: 'FB',
    toTicker: 'USD',
    sellPrice: '526.73',
    fromSymbol: 'FB',
    toSymbol: '$',
    change: '-0.47%',
    imageURL:
      'https://cdn1.iconfinder.com/data/icons/logotypes/32/square-facebook-512.png',
  },
  {
    id: '5503557c-3726-400b-8001-35c5858860f3',
    type: 'shares',
    name: 'Amazon.com',
    fromTicker: 'AMZN',
    toTicker: 'USD',
    sellPrice: '178.88',
    fromSymbol: 'AMZN',
    toSymbol: '$',
    change: '1.42%',
    imageURL:
      'https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Amazon-512.png',
  },
  {
    id: '5503557c-3726-400b-8001-35c5858860g3',
    type: 'shares',
    name: 'Apple',
    fromTicker: 'AAPL',
    toTicker: 'USD',
    sellPrice: '226.51',
    fromSymbol: 'AAPL',
    toSymbol: '$',
    change: '0.87%',
    imageURL:
      'https://cdn2.iconfinder.com/data/icons/social-icons-grey/512/APPLE-512.png',
  },
  {
    id: '5503557c-3726-400b-8001-35c5858860h3',
    type: 'shares',
    name: 'Microsoft',
    fromTicker: 'MSFT',
    toTicker: 'USD',
    sellPrice: '424.80',
    fromSymbol: 'MSFT',
    toSymbol: '$',
    change: '0.23%',
    imageURL:
      'https://cdn4.iconfinder.com/data/icons/social-media-logos-6/512/78-microsoft-512.png',
  },
];

