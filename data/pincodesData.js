// Indian PIN codes database with city, state, delivery estimate, and COD eligibility
const pincodes = {
  '110001': { city: 'New Delhi', state: 'Delhi', deliveryTime: 'Tomorrow by 5 PM', codAvailable: true, hub: 'Okhla Logistics Park, Delhi' },
  '110020': { city: 'New Delhi', state: 'Delhi', deliveryTime: 'Tomorrow by 2 PM', codAvailable: true, hub: 'Okhla Industrial Area, Delhi' },
  '400001': { city: 'Mumbai', state: 'Maharashtra', deliveryTime: 'Tomorrow by 4 PM', codAvailable: true, hub: 'Bhiwandi Superhub, Mumbai' },
  '400050': { city: 'Bandra, Mumbai', state: 'Maharashtra', deliveryTime: 'Tomorrow by 1 PM', codAvailable: true, hub: 'Bhiwandi Superhub, Mumbai' },
  '560001': { city: 'Bengaluru', state: 'Karnataka', deliveryTime: 'Tomorrow by 6 PM', codAvailable: true, hub: 'Nelamangala Fulfillment Hub, Bengaluru' },
  '560034': { city: 'Koramangala, Bengaluru', state: 'Karnataka', deliveryTime: 'Tomorrow by 11 AM', codAvailable: true, hub: 'Nelamangala Fulfillment Hub, Bengaluru' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', deliveryTime: '2 Days (Express)', codAvailable: true, hub: 'Sriperumbudur Hub, Chennai' },
  '700001': { city: 'Kolkata', state: 'West Bengal', deliveryTime: '2 Days (Express)', codAvailable: true, hub: 'Dankuni Logistics Center, Kolkata' },
  '500001': { city: 'Hyderabad', state: 'Telangana', deliveryTime: 'Tomorrow by 7 PM', codAvailable: true, hub: 'Medchal Hub, Hyderabad' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', deliveryTime: 'Tomorrow by 5 PM', codAvailable: true, hub: 'Changodar Hub, Ahmedabad' },
  '411001': { city: 'Pune', state: 'Maharashtra', deliveryTime: 'Tomorrow by 3 PM', codAvailable: true, hub: 'Chakan Logistics Park, Pune' },
  '302001': { city: 'Jaipur', state: 'Rajasthan', deliveryTime: '2 Days (Express)', codAvailable: true, hub: 'Mahapura Hub, Jaipur' },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh', deliveryTime: '2 Days (Express)', codAvailable: true, hub: 'Transport Nagar, Lucknow' },
  '201301': { city: 'Noida', state: 'Uttar Pradesh', deliveryTime: 'Tomorrow by 12 PM', codAvailable: true, hub: 'Greater Noida Express Hub' },
  '122001': { city: 'Gurugram', state: 'Haryana', deliveryTime: 'Tomorrow by 12 PM', codAvailable: true, hub: 'Bilaspur Mega Hub, Gurugram' },
  '682001': { city: 'Kochi', state: 'Kerala', deliveryTime: '3 Days (Standard)', codAvailable: true, hub: 'Kalamassery Hub, Kochi' },
  '781001': { city: 'Guwahati', state: 'Assam', deliveryTime: '3-4 Days (Air Cargo)', codAvailable: true, hub: 'Amingaon Hub, Guwahati' },
  '800001': { city: 'Patna', state: 'Bihar', deliveryTime: '2-3 Days (Express)', codAvailable: true, hub: 'Didarganj Hub, Patna' },
  '160001': { city: 'Chandigarh', state: 'Punjab', deliveryTime: 'Tomorrow by 6 PM', codAvailable: true, hub: 'Zirakpur Logistics Park' },
  '462001': { city: 'Bhopal', state: 'Madhya Pradesh', deliveryTime: '2 Days (Express)', codAvailable: true, hub: 'Mandideep Hub, Bhopal' },
  '751001': { city: 'Bhubaneswar', state: 'Odisha', deliveryTime: '2-3 Days (Express)', codAvailable: true, hub: 'Jatani Logistics Park, Bhubaneswar' }
};

// State mapping by the first 2 digits of Indian Pincode
const prefixToState = {
  '11': { state: 'Delhi', city: 'Delhi NCR' },
  '12': { state: 'Haryana', city: 'Gurugram / Faridabad' },
  '13': { state: 'Haryana', city: 'Ambala / Panipat' },
  '14': { state: 'Punjab', city: 'Amritsar / Jalandhar' },
  '15': { state: 'Punjab', city: 'Bathinda' },
  '16': { state: 'Chandigarh', city: 'Chandigarh' },
  '17': { state: 'Himachal Pradesh', city: 'Shimla' },
  '18': { state: 'Jammu & Kashmir', city: 'Jammu' },
  '19': { state: 'Jammu & Kashmir', city: 'Srinagar' },
  '20': { state: 'Uttar Pradesh', city: 'Noida / Ghaziabad' },
  '21': { state: 'Uttar Pradesh', city: 'Prayagraj' },
  '22': { state: 'Uttar Pradesh', city: 'Lucknow' },
  '23': { state: 'Uttar Pradesh', city: 'Varanasi' },
  '24': { state: 'Uttarakhand', city: 'Dehradun' },
  '25': { state: 'Uttar Pradesh', city: 'Meerut' },
  '26': { state: 'Uttarakhand', city: 'Nainital' },
  '27': { state: 'Uttar Pradesh', city: 'Gorakhpur' },
  '28': { state: 'Uttar Pradesh', city: 'Agra' },
  '30': { state: 'Rajasthan', city: 'Jaipur' },
  '31': { state: 'Rajasthan', city: 'Udaipur' },
  '32': { state: 'Rajasthan', city: 'Kota' },
  '33': { state: 'Rajasthan', city: 'Bikaner' },
  '34': { state: 'Rajasthan', city: 'Jodhpur' },
  '36': { state: 'Gujarat', city: 'Rajkot' },
  '37': { state: 'Gujarat', city: 'Kutch / Jamnagar' },
  '38': { state: 'Gujarat', city: 'Ahmedabad' },
  '39': { state: 'Gujarat', city: 'Surat / Vadodara' },
  '40': { state: 'Maharashtra', city: 'Mumbai' },
  '41': { state: 'Maharashtra', city: 'Pune' },
  '42': { state: 'Maharashtra', city: 'Nashik' },
  '43': { state: 'Maharashtra', city: 'Aurangabad' },
  '44': { state: 'Maharashtra', city: 'Nagpur' },
  '45': { state: 'Madhya Pradesh', city: 'Indore' },
  '46': { state: 'Madhya Pradesh', city: 'Bhopal' },
  '47': { state: 'Madhya Pradesh', city: 'Gwalior' },
  '48': { state: 'Madhya Pradesh', city: 'Jabalpur' },
  '49': { state: 'Chhattisgarh', city: 'Raipur' },
  '50': { state: 'Telangana', city: 'Hyderabad' },
  '51': { state: 'Andhra Pradesh', city: 'Tirupati' },
  '52': { state: 'Andhra Pradesh', city: 'Vijayawada' },
  '53': { state: 'Andhra Pradesh', city: 'Visakhapatnam' },
  '56': { state: 'Karnataka', city: 'Bengaluru' },
  '57': { state: 'Karnataka', city: 'Mangaluru / Mysuru' },
  '58': { state: 'Karnataka', city: 'Hubballi / Belagavi' },
  '59': { state: 'Karnataka', city: 'Belagavi' },
  '60': { state: 'Tamil Nadu', city: 'Chennai' },
  '61': { state: 'Tamil Nadu', city: 'Tiruchirappalli' },
  '62': { state: 'Tamil Nadu', city: 'Madurai' },
  '63': { state: 'Tamil Nadu', city: 'Salem' },
  '64': { state: 'Tamil Nadu', city: 'Coimbatore' },
  '67': { state: 'Kerala', city: 'Kozhikode' },
  '68': { state: 'Kerala', city: 'Kochi' },
  '69': { state: 'Kerala', city: 'Thiruvananthapuram' },
  '70': { state: 'West Bengal', city: 'Kolkata' },
  '71': { state: 'West Bengal', city: 'Howrah' },
  '72': { state: 'West Bengal', city: 'Kharagpur' },
  '73': { state: 'West Bengal', city: 'Siliguri' },
  '74': { state: 'West Bengal', city: 'North 24 Parganas' },
  '75': { state: 'Odisha', city: 'Bhubaneswar' },
  '76': { state: 'Odisha', city: 'Cuttack' },
  '77': { state: 'Odisha', city: 'Rourkela' },
  '78': { state: 'Assam', city: 'Guwahati' },
  '79': { state: 'North East', city: 'Shillong / Agartala' },
  '80': { state: 'Bihar', city: 'Patna' },
  '81': { state: 'Bihar', city: 'Bhagalpur' },
  '82': { state: 'Jharkhand', city: 'Ranchi / Dhanbad' },
  '83': { state: 'Jharkhand', city: 'Jamshedpur' },
  '84': { state: 'Bihar', city: 'Muzaffarpur' },
  '85': { state: 'Bihar', city: 'Purnia' }
};

const lookupPincode = (code) => {
  if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
    return null;
  }

  // Calculate delivery date strings
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 3600 * 1000);
  const in2Days = new Date(today.getTime() + 48 * 3600 * 1000);
  const in3Days = new Date(today.getTime() + 72 * 3600 * 1000);

  const formatDate = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  // Known major PIN codes
  if (pincodes[code]) {
    const p = pincodes[code];
    let dist = 25;
    let days = 1;
    if (code.startsWith('40') || code.startsWith('41')) dist = 22 + (parseInt(code.slice(3)) % 30);
    else if (code.startsWith('56')) dist = 18 + (parseInt(code.slice(3)) % 25);
    else if (code.startsWith('11') || code.startsWith('12') || code.startsWith('20')) dist = 28 + (parseInt(code.slice(3)) % 35);
    else { dist = 450 + (parseInt(code.slice(2)) % 600); days = 2; }

    return {
      ...p,
      distanceKm: dist,
      estimatedDate: days === 1 ? `Tomorrow (${formatDate(tomorrow)}), by 4 PM` : `${formatDate(in2Days)}, by 7 PM`,
      courierPartner: dist < 300 ? 'Delhivery Surface Express' : 'Blue Dart Air Express',
      freeShipping: true,
      shippingFee: 0,
      cutoffHours: 3,
      cutoffMinutes: 45,
      doorstepUPI: true
    };
  }

  const prefix = code.slice(0, 2);
  const numPrefix = parseInt(prefix, 10);
  let dist = 650;
  let days = 2;
  let hubName = 'Central India Logistics Hub, Nagpur';

  if (numPrefix >= 11 && numPrefix <= 19) {
    hubName = 'NCR Super Hub, Bilaspur';
    dist = 120 + (parseInt(code.slice(2)) % 150);
    days = 1;
  } else if (numPrefix >= 20 && numPrefix <= 29) {
    hubName = 'Northern Logistics Hub, Lucknow';
    dist = 280 + (parseInt(code.slice(2)) % 200);
    days = 2;
  } else if (numPrefix >= 30 && numPrefix <= 34) {
    hubName = 'Western Gateway Hub, Jaipur';
    dist = 340 + (parseInt(code.slice(2)) % 180);
    days = 2;
  } else if (numPrefix >= 36 && numPrefix <= 39) {
    hubName = 'Gujarat Regional Hub, Ahmedabad';
    dist = 220 + (parseInt(code.slice(2)) % 160);
    days = 1;
  } else if (numPrefix >= 40 && numPrefix <= 44) {
    hubName = 'Bhiwandi Superhub, Mumbai';
    dist = 45 + (parseInt(code.slice(2)) % 80);
    days = 1;
  } else if (numPrefix >= 50 && numPrefix <= 53) {
    hubName = 'Deccan Fulfillment Center, Hyderabad';
    dist = 310 + (parseInt(code.slice(2)) % 220);
    days = 2;
  } else if (numPrefix >= 56 && numPrefix <= 59) {
    hubName = 'Nelamangala Mega Hub, Bengaluru';
    dist = 35 + (parseInt(code.slice(2)) % 65);
    days = 1;
  } else if (numPrefix >= 60 && numPrefix <= 64) {
    hubName = 'Southern Express Hub, Chennai';
    dist = 320 + (parseInt(code.slice(2)) % 210);
    days = 2;
  } else if (numPrefix >= 67 && numPrefix <= 69) {
    hubName = 'Kerala Regional Hub, Kochi';
    dist = 420 + (parseInt(code.slice(2)) % 250);
    days = 2;
  } else if (numPrefix >= 70 && numPrefix <= 74) {
    hubName = 'Eastern Fulfillment Center, Kolkata';
    dist = 350 + (parseInt(code.slice(2)) % 300);
    days = 2;
  } else if (numPrefix >= 75 && numPrefix <= 77) {
    hubName = 'Odisha Logistics Hub, Bhubaneswar';
    dist = 550 + (parseInt(code.slice(2)) % 280);
    days = 2;
  } else if (numPrefix >= 78 && numPrefix <= 79) {
    hubName = 'North-East Air Cargo Hub, Guwahati';
    dist = 1150 + (parseInt(code.slice(2)) % 400);
    days = 3;
  } else if (numPrefix >= 80 && numPrefix <= 85) {
    hubName = 'Bihar-Jharkhand Hub, Patna';
    dist = 680 + (parseInt(code.slice(2)) % 260);
    days = 2;
  }

  const stateInfo = prefixToState[prefix] || { city: 'Regional City', state: 'India' };
  const targetDate = days === 1 ? tomorrow : days === 2 ? in2Days : in3Days;

  return {
    city: stateInfo.city,
    state: stateInfo.state,
    deliveryTime: days === 1 ? 'Tomorrow by 4 PM' : `${days} - ${days + 1} Days (Express)`,
    estimatedDate: `${formatDate(targetDate)}, by 7 PM`,
    codAvailable: true,
    hub: hubName,
    distanceKm: dist,
    courierPartner: dist < 400 ? 'Delhivery Surface Express' : 'Blue Dart Air Express',
    freeShipping: true,
    shippingFee: 0,
    cutoffHours: 2,
    cutoffMinutes: 40,
    doorstepUPI: true
  };
};

module.exports = { pincodes, lookupPincode };
