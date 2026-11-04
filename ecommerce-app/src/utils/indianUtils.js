// Indian utility functions, currency formatters, and regional master data

export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const calculateSavings = (mrp, price) => {
  const original = Number(mrp) || Number(price);
  const current = Number(price) || 0;
  if (original <= current) return { amount: 0, percent: 0 };
  const diff = original - current;
  const pct = Math.round((diff / original) * 100);
  return { amount: diff, percent: pct };
};

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const INDIAN_BANKS = [
  { id: 'sbi', name: 'State Bank of India (SBI)', logo: '🏛️' },
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
  { id: 'icici', name: 'ICICI Bank', logo: '💳' },
  { id: 'axis', name: 'Axis Bank', logo: '🏦' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🛡️' },
  { id: 'pnb', name: 'Punjab National Bank (PNB)', logo: '🏛️' },
  { id: 'bob', name: 'Bank of Baroda', logo: '🏦' }
];

export const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', handle: '@okhdfcbank', color: '#4285F4', icon: '⚡' },
  { id: 'phonepe', name: 'PhonePe', handle: '@ybl', color: '#5f259f', icon: '🟣' },
  { id: 'paytm', name: 'Paytm UPI', handle: '@paytm', color: '#00BAF2', icon: '🔵' },
  { id: 'bhim', name: 'BHIM UPI', handle: '@upi', color: '#00796B', icon: '🇮🇳' },
  { id: 'cred', name: 'CRED UPI', handle: '@axisbank', color: '#1A1A1A', icon: '💎' }
];

export const SAMPLE_PINCODES = [
  { code: '400001', city: 'Mumbai', state: 'Maharashtra' },
  { code: '560001', city: 'Bengaluru', state: 'Karnataka' },
  { code: '110001', city: 'New Delhi', state: 'Delhi' },
  { code: '600001', city: 'Chennai', state: 'Tamil Nadu' },
  { code: '700001', city: 'Kolkata', state: 'West Bengal' },
  { code: '500001', city: 'Hyderabad', state: 'Telangana' }
];

export const getDeliverySpeed = (product) => {
  if (product && product.deliverySpeed) return product.deliverySpeed;
  if (product && product.deliveryTime) return product.deliveryTime;
  
  const options = [
    '⚡ Delivery by Tomorrow, 2 PM',
    '⚡ Free Delivery by Tomorrow, 5 PM',
    '🚚 Delivery in 2 Days (Express)',
    '🚚 Delivery in 2 - 3 Days',
    '🚚 Standard Delivery in 3 - 4 Days',
    '⚡ Same-Day Delivery (Order within 3 hrs)',
    '🚚 Delivery in 3 Days (Regional Hub)',
    '⚡ 24-Hour Express Dispatch'
  ];

  const key = (product && (product._id || product.id || product.name)) || 'prod';
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return options[Math.abs(hash) % options.length];
};
