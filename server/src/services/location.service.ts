export interface LocationResult {
  city: string;
  state?: string;
  country: string;
  displayName: string;
  latitude: number;
  longitude: number;
  timeZone: number; // UTC offset in decimal hours
  timeZoneId: string;
}

// Built-in database of major cities with verified coordinates & timezones
const PRESET_CITIES: LocationResult[] = [
  // India
  { city: 'New Delhi', state: 'Delhi', country: 'India', displayName: 'New Delhi, Delhi, India', latitude: 28.6139, longitude: 77.2090, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Mumbai', state: 'Maharashtra', country: 'India', displayName: 'Mumbai, Maharashtra, India', latitude: 19.0760, longitude: 72.8777, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Bengaluru', state: 'Karnataka', country: 'India', displayName: 'Bengaluru, Karnataka, India', latitude: 12.9716, longitude: 77.5946, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Kolkata', state: 'West Bengal', country: 'India', displayName: 'Kolkata, West Bengal, India', latitude: 22.5726, longitude: 88.3639, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Chennai', state: 'Tamil Nadu', country: 'India', displayName: 'Chennai, Tamil Nadu, India', latitude: 13.0827, longitude: 80.2707, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Hyderabad', state: 'Telangana', country: 'India', displayName: 'Hyderabad, Telangana, India', latitude: 17.3850, longitude: 78.4867, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Pune', state: 'Maharashtra', country: 'India', displayName: 'Pune, Maharashtra, India', latitude: 18.5204, longitude: 73.8567, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Ahmedabad', state: 'Gujarat', country: 'India', displayName: 'Ahmedabad, Gujarat, India', latitude: 23.0225, longitude: 72.5714, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Jaipur', state: 'Rajasthan', country: 'India', displayName: 'Jaipur, Rajasthan, India', latitude: 26.9124, longitude: 75.7873, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', displayName: 'Lucknow, Uttar Pradesh, India', latitude: 26.8467, longitude: 80.9462, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Varanasi', state: 'Uttar Pradesh', country: 'India', displayName: 'Varanasi, Uttar Pradesh, India', latitude: 25.3176, longitude: 82.9739, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Surat', state: 'Gujarat', country: 'India', displayName: 'Surat, Gujarat, India', latitude: 21.1702, longitude: 72.8311, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Chandigarh', state: 'Punjab', country: 'India', displayName: 'Chandigarh, India', latitude: 30.7333, longitude: 76.7794, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Bhopal', state: 'Madhya Pradesh', country: 'India', displayName: 'Bhopal, Madhya Pradesh, India', latitude: 23.2599, longitude: 77.4126, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Indore', state: 'Madhya Pradesh', country: 'India', displayName: 'Indore, Madhya Pradesh, India', latitude: 22.7196, longitude: 75.8577, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Patna', state: 'Bihar', country: 'India', displayName: 'Patna, Bihar, India', latitude: 25.5941, longitude: 85.1376, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Nagpur', state: 'Maharashtra', country: 'India', displayName: 'Nagpur, Maharashtra, India', latitude: 21.1458, longitude: 79.0882, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Thiruvananthapuram', state: 'Kerala', country: 'India', displayName: 'Thiruvananthapuram, Kerala, India', latitude: 8.5241, longitude: 76.9366, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Kochi', state: 'Kerala', country: 'India', displayName: 'Kochi, Kerala, India', latitude: 9.9312, longitude: 76.2673, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Guwahati', state: 'Assam', country: 'India', displayName: 'Guwahati, Assam, India', latitude: 26.1445, longitude: 91.7362, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Bhubaneswar', state: 'Odisha', country: 'India', displayName: 'Bhubaneswar, Odisha, India', latitude: 20.2961, longitude: 85.8245, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Dehradun', state: 'Uttarakhand', country: 'India', displayName: 'Dehradun, Uttarakhand, India', latitude: 30.3165, longitude: 78.0322, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Haridwar', state: 'Uttarakhand', country: 'India', displayName: 'Haridwar, Uttarakhand, India', latitude: 29.9457, longitude: 78.1642, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Rishikesh', state: 'Uttarakhand', country: 'India', displayName: 'Rishikesh, Uttarakhand, India', latitude: 30.0869, longitude: 78.2676, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Amritsar', state: 'Punjab', country: 'India', displayName: 'Amritsar, Punjab, India', latitude: 31.6340, longitude: 74.8723, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Agra', state: 'Uttar Pradesh', country: 'India', displayName: 'Agra, Uttar Pradesh, India', latitude: 27.1767, longitude: 78.0081, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Mathura', state: 'Uttar Pradesh', country: 'India', displayName: 'Mathura, Uttar Pradesh, India', latitude: 27.4924, longitude: 77.6737, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Ayodhya', state: 'Uttar Pradesh', country: 'India', displayName: 'Ayodhya, Uttar Pradesh, India', latitude: 26.7922, longitude: 82.1998, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Ujjain', state: 'Madhya Pradesh', country: 'India', displayName: 'Ujjain, Madhya Pradesh, India', latitude: 23.1765, longitude: 75.7885, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Vadodara', state: 'Gujarat', country: 'India', displayName: 'Vadodara, Gujarat, India', latitude: 22.3072, longitude: 73.1812, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Rajkot', state: 'Gujarat', country: 'India', displayName: 'Rajkot, Gujarat, India', latitude: 22.3039, longitude: 70.8022, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', displayName: 'Visakhapatnam, Andhra Pradesh, India', latitude: 17.6868, longitude: 83.2185, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Tirupati', state: 'Andhra Pradesh', country: 'India', displayName: 'Tirupati, Andhra Pradesh, India', latitude: 13.6288, longitude: 79.4192, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Vijayawada', state: 'Andhra Pradesh', country: 'India', displayName: 'Vijayawada, Andhra Pradesh, India', latitude: 16.5062, longitude: 80.6480, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Coimbatore', state: 'Tamil Nadu', country: 'India', displayName: 'Coimbatore, Tamil Nadu, India', latitude: 11.0168, longitude: 76.9558, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Madurai', state: 'Tamil Nadu', country: 'India', displayName: 'Madurai, Tamil Nadu, India', latitude: 9.9252, longitude: 78.1198, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Mysuru', state: 'Karnataka', country: 'India', displayName: 'Mysuru, Karnataka, India', latitude: 12.2958, longitude: 76.6394, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Mangalore', state: 'Karnataka', country: 'India', displayName: 'Mangalore, Karnataka, India', latitude: 12.9141, longitude: 74.8560, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Nashik', state: 'Maharashtra', country: 'India', displayName: 'Nashik, Maharashtra, India', latitude: 19.9975, longitude: 73.7898, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Noida', state: 'Uttar Pradesh', country: 'India', displayName: 'Noida, Uttar Pradesh, India', latitude: 28.5355, longitude: 77.3910, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Gurugram', state: 'Haryana', country: 'India', displayName: 'Gurugram, Haryana, India', latitude: 28.4595, longitude: 77.0266, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Faridabad', state: 'Haryana', country: 'India', displayName: 'Faridabad, Haryana, India', latitude: 28.4089, longitude: 77.3178, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Ghaziabad', state: 'Uttar Pradesh', country: 'India', displayName: 'Ghaziabad, Uttar Pradesh, India', latitude: 28.6692, longitude: 77.4538, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Ranchi', state: 'Jharkhand', country: 'India', displayName: 'Ranchi, Jharkhand, India', latitude: 23.3441, longitude: 85.3096, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Jamshedpur', state: 'Jharkhand', country: 'India', displayName: 'Jamshedpur, Jharkhand, India', latitude: 22.8046, longitude: 86.2029, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Raipur', state: 'Chhattisgarh', country: 'India', displayName: 'Raipur, Chhattisgarh, India', latitude: 21.2514, longitude: 81.6296, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Shimla', state: 'Himachal Pradesh', country: 'India', displayName: 'Shimla, Himachal Pradesh, India', latitude: 31.1048, longitude: 77.1734, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Srinagar', state: 'Jammu and Kashmir', country: 'India', displayName: 'Srinagar, Jammu and Kashmir, India', latitude: 34.0837, longitude: 74.7973, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Jammu', state: 'Jammu and Kashmir', country: 'India', displayName: 'Jammu, Jammu and Kashmir, India', latitude: 32.7266, longitude: 74.8570, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Panaji', state: 'Goa', country: 'India', displayName: 'Panaji, Goa, India', latitude: 15.4909, longitude: 73.8278, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },
  { city: 'Puducherry', state: 'Puducherry', country: 'India', displayName: 'Puducherry, India', latitude: 11.9416, longitude: 79.8083, timeZone: 5.5, timeZoneId: 'Asia/Kolkata' },

  // International
  { city: 'London', country: 'United Kingdom', displayName: 'London, United Kingdom', latitude: 51.5074, longitude: -0.1278, timeZone: 0.0, timeZoneId: 'Europe/London' },
  { city: 'New York', state: 'NY', country: 'United States', displayName: 'New York, NY, United States', latitude: 40.7128, longitude: -74.0060, timeZone: -5.0, timeZoneId: 'America/New_York' },
  { city: 'San Francisco', state: 'CA', country: 'United States', displayName: 'San Francisco, CA, United States', latitude: 37.7749, longitude: -122.4194, timeZone: -8.0, timeZoneId: 'America/Los_Angeles' },
  { city: 'Los Angeles', state: 'CA', country: 'United States', displayName: 'Los Angeles, CA, United States', latitude: 34.0522, longitude: -118.2437, timeZone: -8.0, timeZoneId: 'America/Los_Angeles' },
  { city: 'Chicago', state: 'IL', country: 'United States', displayName: 'Chicago, IL, United States', latitude: 41.8781, longitude: -87.6298, timeZone: -6.0, timeZoneId: 'America/Chicago' },
  { city: 'Toronto', state: 'Ontario', country: 'Canada', displayName: 'Toronto, Ontario, Canada', latitude: 43.6532, longitude: -79.3832, timeZone: -5.0, timeZoneId: 'America/Toronto' },
  { city: 'Vancouver', state: 'BC', country: 'Canada', displayName: 'Vancouver, BC, Canada', latitude: 49.2827, longitude: -123.1207, timeZone: -8.0, timeZoneId: 'America/Vancouver' },
  { city: 'Dubai', country: 'United Arab Emirates', displayName: 'Dubai, United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timeZone: 4.0, timeZoneId: 'Asia/Dubai' },
  { city: 'Singapore', country: 'Singapore', displayName: 'Singapore', latitude: 1.3521, longitude: 103.8198, timeZone: 8.0, timeZoneId: 'Asia/Singapore' },
  { city: 'Sydney', state: 'NSW', country: 'Australia', displayName: 'Sydney, NSW, Australia', latitude: -33.8688, longitude: 151.2093, timeZone: 10.0, timeZoneId: 'Australia/Sydney' },
  { city: 'Melbourne', state: 'Victoria', country: 'Australia', displayName: 'Melbourne, Victoria, Australia', latitude: -37.8136, longitude: 144.9631, timeZone: 10.0, timeZoneId: 'Australia/Melbourne' },
  { city: 'Tokyo', country: 'Japan', displayName: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503, timeZone: 9.0, timeZoneId: 'Asia/Tokyo' },
  { city: 'Paris', country: 'France', displayName: 'Paris, France', latitude: 48.8566, longitude: 2.3522, timeZone: 1.0, timeZoneId: 'Europe/Paris' },
  { city: 'Berlin', country: 'Germany', displayName: 'Berlin, Germany', latitude: 52.5200, longitude: 13.4050, timeZone: 1.0, timeZoneId: 'Europe/Berlin' },
  { city: 'Kathmandu', country: 'Nepal', displayName: 'Kathmandu, Nepal', latitude: 27.7172, longitude: 85.3240, timeZone: 5.75, timeZoneId: 'Asia/Kathmandu' },
  { city: 'Colombo', country: 'Sri Lanka', displayName: 'Colombo, Sri Lanka', latitude: 6.9271, longitude: 79.8612, timeZone: 5.5, timeZoneId: 'Asia/Colombo' },
  { city: 'Kuala Lumpur', country: 'Malaysia', displayName: 'Kuala Lumpur, Malaysia', latitude: 3.1390, longitude: 101.6869, timeZone: 8.0, timeZoneId: 'Asia/Kuala_Lumpur' },
  { city: 'Bangkok', country: 'Thailand', displayName: 'Bangkok, Thailand', latitude: 13.7563, longitude: 100.5018, timeZone: 7.0, timeZoneId: 'Asia/Bangkok' }
];

export class LocationService {
  /**
   * Search for cities by query string
   */
  public async searchLocations(query: string): Promise<LocationResult[]> {
    if (!query || query.trim().length < 2) {
      return PRESET_CITIES.slice(0, 10);
    }

    const cleanQuery = query.trim().toLowerCase();

    // 1. Check local preset cities
    const localMatches = PRESET_CITIES.filter(c =>
      c.displayName.toLowerCase().includes(cleanQuery) ||
      c.city.toLowerCase().includes(cleanQuery) ||
      (c.state && c.state.toLowerCase().includes(cleanQuery))
    );

    if (localMatches.length >= 5) {
      return localMatches.slice(0, 10);
    }

    // 2. Fetch from OpenStreetMap Nominatim if fewer than 5 local matches
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Voxigen-Vedic-Astrology-App/1.0'
        }
      });

      if (response.ok) {
        const results: any[] = await response.json();
        const apiMatches: LocationResult[] = results.map(item => {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          // Estimate timezone from longitude if timezone not returned
          const approxOffset = Math.round((lon / 15.0) * 2) / 2;
          const country = item.address?.country || '';
          const isIndia = country.toLowerCase() === 'india' || item.display_name.toLowerCase().includes('india');

          return {
            city: item.address?.city || item.address?.town || item.address?.village || item.name,
            state: item.address?.state,
            country: country,
            displayName: item.display_name,
            latitude: Number(lat.toFixed(4)),
            longitude: Number(lon.toFixed(4)),
            timeZone: isIndia ? 5.5 : approxOffset,
            timeZoneId: isIndia ? 'Asia/Kolkata' : 'UTC'
          };
        });

        // Merge and deduplicate by displayName
        const combined = [...localMatches, ...apiMatches];
        const seen = new Set<string>();
        return combined.filter(item => {
          const key = `${item.city}_${item.latitude.toFixed(2)}_${item.longitude.toFixed(2)}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }).slice(0, 10);
      }
    } catch {
      // Fallback silently to whatever local matches we have
    }

    return localMatches.slice(0, 10);
  }
}

export const locationService = new LocationService();
