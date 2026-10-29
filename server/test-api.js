require('dotenv').config();
const http = require('http');
const { app } = require('./dist/app');
const { connectDatabase } = require('./dist/config/database');

async function runTests() {
  console.log('--- Starting Voxigen Full-Stack API Integration Tests ---');
  await connectDatabase();

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(5099, resolve));
  const baseUrl = 'http://127.0.0.1:5099/api';

  try {
    // 1. Health check
    console.log('[Test 1] Health Check...');
    const healthRes = await fetch(`${baseUrl}/health`).then(r => r.json());
    if (healthRes.status !== 'ok') throw new Error('Health check failed');
    console.log('✓ Health check passed:', healthRes.service);

    // 2. Location search
    console.log('[Test 2] Location Search for "mumbai"...');
    const locRes = await fetch(`${baseUrl}/locations/search?q=mumbai`).then(r => r.json());
    if (!locRes.success || locRes.data.length === 0) throw new Error('Location search failed');
    console.log(`✓ Location search found ${locRes.data.length} results. First: ${locRes.data[0].displayName}`);

    // 3. Generate Kundali
    console.log('[Test 3] Generate Kundali for "Aarav Sharma"...');
    const genPayload = {
      name: 'Aarav Sharma',
      birthDate: '1995-08-15',
      birthTime: '14:30',
      birthTimeUnknown: false,
      birthPlace: 'Mumbai, Maharashtra, India',
      latitude: 19.0760,
      longitude: 72.8777,
      timeZone: 5.5,
      gender: 'male'
    };

    const genRes = await fetch(`${baseUrl}/kundali/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(genPayload)
    }).then(r => r.json());

    if (!genRes.success || !genRes.chartId) throw new Error('Kundali generation failed');
    const chartId = genRes.chartId;
    console.log(`✓ Kundali created with ID: ${chartId}`);
    console.log(`  - Ascendant: ${genRes.data.ascendant.sign} (${genRes.data.ascendant.degreeFormatted})`);
    console.log(`  - Moon Sign: ${genRes.data.moonSign.sign} (Nakshatra: ${genRes.data.janmaNakshatra.name})`);
    console.log(`  - Sun Sign: ${genRes.data.sunSign.sign} (House: ${genRes.data.planetaryPositions.Sun.house})`);
    console.log(`  - D9 Navamsa Lagna: ${genRes.data.divisionalCharts.d9.lagnaSignName}`);
    console.log(`  - D10 Dashamsa Lagna: ${genRes.data.divisionalCharts.d10.lagnaSignName}`);
    console.log(`  - Active Dasha: ${genRes.data.dashaPeriods.currentMahadasha} / ${genRes.data.dashaPeriods.currentAntardasha}`);
    console.log(`  - Provider: ${genRes.data.calculationProvider}`);

    // 4. Retrieve Kundali by ID (Simulate page refresh)
    console.log(`[Test 4] Retrieve Kundali by ID '${chartId}'...`);
    const getRes = await fetch(`${baseUrl}/kundali/${chartId}`).then(r => r.json());
    if (!getRes.success || getRes.data.chartId !== chartId) throw new Error('Kundali retrieval failed');
    console.log('✓ Kundali retrieved successfully from persistence store.');

    // 5. Update Kundali (Edit details)
    console.log(`[Test 5] Update Kundali with revised birth place...`);
    const updateRes = await fetch(`${baseUrl}/kundali/${chartId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birthPlace: 'New Delhi, Delhi, India',
        latitude: 28.6139,
        longitude: 77.2090
      })
    }).then(r => r.json());

    if (!updateRes.success || updateRes.data.birthPlace !== 'New Delhi, Delhi, India') {
      throw new Error('Kundali update failed');
    }
    console.log(`✓ Kundali updated: New Place = ${updateRes.data.birthPlace}`);

    // 6. Panchang
    console.log('[Test 6] Panchang Today...');
    const panchangRes = await fetch(`${baseUrl}/panchang/today`).then(r => r.json());
    if (!panchangRes.success || !panchangRes.data.tithi) throw new Error('Panchang failed');
    console.log(`✓ Panchang verified: Tithi = ${panchangRes.data.tithi.name}, Nakshatra = ${panchangRes.data.nakshatra.name}`);

    // 7. Horoscope
    console.log('[Test 7] Daily Horoscope...');
    const horoRes = await fetch(`${baseUrl}/horoscope/daily?sign=Aries`).then(r => r.json());
    if (!horoRes.success || !horoRes.data.rashi) throw new Error('Horoscope failed');
    console.log(`✓ Horoscope verified for ${horoRes.data.rashi}`);

    // 8. Compatibility
    console.log('[Test 8] Ashtakoot Gun Milan...');
    const compatRes = await fetch(`${baseUrl}/compatibility/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groomNakshatra: 'Rohini', brideNakshatra: 'Pushya' })
    }).then(r => r.json());
    if (!compatRes.success || !compatRes.data.totalScore) throw new Error('Compatibility failed');
    console.log(`✓ Compatibility verified: ${compatRes.data.totalScore}/36 (${compatRes.data.verdict})`);

    // 9. Delete Chart
    console.log(`[Test 9] Delete chart '${chartId}'...`);
    const delRes = await fetch(`${baseUrl}/kundali/${chartId}`, { method: 'DELETE' }).then(r => r.json());
    if (!delRes.success) throw new Error('Delete failed');
    console.log('✓ Chart deleted successfully.');

    // 10. Verify 404 after deletion
    const verifyDel = await fetch(`${baseUrl}/kundali/${chartId}`).then(r => r.json());
    if (verifyDel.success) throw new Error('Expected 404 after deletion but got chart');
    console.log('✓ Confirmed 404 for deleted record.');

    console.log('\n🎉 ALL 10 INTEGRATION TESTS PASSED WITH 100% SUCCESS! 🎉');
  } finally {
    server.close();
  }
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
