/**
 * Areas / localities for the major cities. Anywhere else the area is typed.
 * Keys must match city names in india-cities.json exactly.
 * Add a city by adding a key; no other code changes.
 */
export const AREAS: Record<string, string[]> = {
  Hyderabad: [
    'Abids', 'Ameerpet', 'Attapur', 'Bachupally', 'Banjara Hills', 'Begumpet', 'Chanda Nagar', 'Charminar', 'Dilsukhnagar', 'Financial District',
    'Gachibowli', 'Habsiguda', 'Hitech City', 'Himayatnagar', 'Jubilee Hills', 'Kachiguda', 'Kokapet', 'Kondapur', 'Kothapet', 'KPHB Colony',
    'Kukatpally', 'LB Nagar', 'Madhapur', 'Malakpet', 'Manikonda', 'Mehdipatnam', 'Miyapur', 'Nampally', 'Nanakramguda', 'Narsingi',
    'Old City', 'Panjagutta', 'Puppalaguda', 'Raidurg', 'Sainikpuri', 'Secunderabad', 'Somajiguda', 'Tarnaka', 'Tolichowki', 'Uppal', 'Banjara Hills Road No. 12',
  ],
  Secunderabad: ['Alwal', 'Bowenpally', 'Kompally', 'Marredpally', 'Malkajgiri', 'Paradise', 'Sainikpuri', 'Tirumalgherry', 'Trimulgherry', 'West Marredpally'],
  Bengaluru: [
    'Banashankari', 'Banaswadi', 'Basavanagudi', 'Bellandur', 'BTM Layout', 'Brookefield', 'Domlur', 'Electronic City', 'Frazer Town', 'Hebbal',
    'HSR Layout', 'Indiranagar', 'Jayanagar', 'JP Nagar', 'Kalyan Nagar', 'Koramangala', 'Kumaraswamy Layout', 'Malleshwaram', 'Marathahalli', 'MG Road',
    'Rajajinagar', 'RT Nagar', 'Sadashivanagar', 'Sarjapur Road', 'Ulsoor', 'Whitefield', 'Yelahanka', 'Yeshwanthpur',
  ],
  Mumbai: [
    'Andheri East', 'Andheri West', 'Bandra East', 'Bandra West', 'Borivali', 'Byculla', 'Chembur', 'Colaba', 'Dadar', 'Fort',
    'Ghatkopar', 'Goregaon', 'Juhu', 'Kandivali', 'Khar', 'Kurla', 'Lower Parel', 'Malad', 'Marine Drive', 'Matunga',
    'Mulund', 'Powai', 'Santacruz', 'Sion', 'Vile Parle', 'Wadala', 'Worli',
  ],
  'Navi Mumbai': ['Airoli', 'Belapur', 'Ghansoli', 'Kharghar', 'Nerul', 'Panvel', 'Sanpada', 'Seawoods', 'Vashi'],
  Thane: ['Ghodbunder Road', 'Hiranandani Estate', 'Kolshet', 'Majiwada', 'Naupada', 'Pokhran Road', 'Vartak Nagar'],
  'New Delhi': [
    'Chanakyapuri', 'Connaught Place', 'Defence Colony', 'Dwarka', 'Greater Kailash', 'Green Park', 'Hauz Khas', 'Janakpuri', 'Karol Bagh', 'Lajpat Nagar',
    'Malviya Nagar', 'Mayur Vihar', 'Nehru Place', 'Pitampura', 'Rajouri Garden', 'Rohini', 'Saket', 'Shahpur Jat', 'South Extension', 'Vasant Kunj', 'Vasant Vihar',
  ],
  Delhi: [
    'Chandni Chowk', 'Civil Lines', 'Dwarka', 'Hauz Khas', 'Janakpuri', 'Kamla Nagar', 'Karol Bagh', 'Laxmi Nagar', 'Mayur Vihar', 'Model Town',
    'Paschim Vihar', 'Pitampura', 'Preet Vihar', 'Rajouri Garden', 'Rohini', 'Saket', 'Shalimar Bagh',
  ],
  Gurugram: ['Cyber City', 'DLF Phase 1', 'DLF Phase 2', 'DLF Phase 3', 'DLF Phase 4', 'Golf Course Road', 'MG Road', 'Sector 29', 'Sohna Road', 'Sushant Lok', 'Udyog Vihar'],
  Noida: ['Sector 15', 'Sector 18', 'Sector 50', 'Sector 62', 'Sector 76', 'Sector 93', 'Sector 137', 'Noida Extension'],
  Chennai: [
    'Adyar', 'Alwarpet', 'Anna Nagar', 'Besant Nagar', 'Egmore', 'Guindy', 'Kilpauk', 'Kodambakkam', 'Mylapore', 'Nungambakkam',
    'OMR', 'Perungudi', 'Porur', 'T. Nagar', 'Teynampet', 'Thiruvanmiyur', 'Velachery', 'Vadapalani',
  ],
  Pune: [
    'Aundh', 'Baner', 'Bavdhan', 'Camp', 'Deccan', 'Hadapsar', 'Hinjewadi', 'Kalyani Nagar', 'Kharadi', 'Kondhwa',
    'Koregaon Park', 'Kothrud', 'Magarpatta', 'Pimple Saudagar', 'Shivajinagar', 'Viman Nagar', 'Wakad',
  ],
  Kolkata: [
    'Alipore', 'Ballygunge', 'Behala', 'Bhowanipore', 'Dum Dum', 'Esplanade', 'Gariahat', 'Howrah', 'Lake Town', 'New Town',
    'Park Circus', 'Park Street', 'Salt Lake', 'Southern Avenue', 'Tollygunge',
  ],
  Ahmedabad: ['Ambawadi', 'Bodakdev', 'Bopal', 'CG Road', 'Gota', 'Maninagar', 'Navrangpura', 'Paldi', 'Prahlad Nagar', 'Satellite', 'SG Highway', 'Thaltej', 'Vastrapur'],
  Jaipur: ['Bani Park', 'C-Scheme', 'Civil Lines', 'Malviya Nagar', 'Mansarovar', 'MI Road', 'Raja Park', 'Tonk Road', 'Vaishali Nagar'],
  Lucknow: ['Aliganj', 'Aminabad', 'Gomti Nagar', 'Hazratganj', 'Indira Nagar', 'Jankipuram', 'Mahanagar', 'Vikas Nagar'],
  Chandigarh: ['Industrial Area', 'Manimajra', 'Sector 8', 'Sector 17', 'Sector 22', 'Sector 26', 'Sector 35', 'Sector 43'],
  Kochi: ['Edappally', 'Ernakulam South', 'Fort Kochi', 'Kadavanthra', 'Kakkanad', 'Kaloor', 'Marine Drive', 'Palarivattom', 'Panampilly Nagar', 'Vyttila'],
  Visakhapatnam: ['Dwaraka Nagar', 'Gajuwaka', 'MVP Colony', 'Madhurawada', 'Rushikonda', 'Seethammadhara', 'Siripuram'],
  Vijayawada: ['Benz Circle', 'Governorpet', 'Labbipet', 'Moghalrajpuram', 'Patamata', 'Siddhartha Nagar'],
  Indore: ['AB Road', 'Bhawarkua', 'Palasia', 'Rajwada', 'Sapna Sangeeta', 'Vijay Nagar'],
  Bhopal: ['Arera Colony', 'Kolar Road', 'MP Nagar', 'New Market', 'Shahpura'],
  Nagpur: ['Civil Lines', 'Dharampeth', 'Manish Nagar', 'Ramdaspeth', 'Sadar', 'Sitabuldi'],
  Surat: ['Adajan', 'Athwa', 'Citylight', 'Pal', 'Piplod', 'Vesu'],
  Coimbatore: ['Gandhipuram', 'Peelamedu', 'RS Puram', 'Race Course', 'Saibaba Colony'],
  Mysuru: ['Gokulam', 'Jayalakshmipuram', 'Kuvempunagar', 'Saraswathipuram', 'Vijayanagar'],
  Panaji: ['Altinho', 'Campal', 'Dona Paula', 'Fontainhas', 'Miramar'],
};

export const areasFor = (city?: string | null): string[] => (city ? (AREAS[city] ?? []) : []);
