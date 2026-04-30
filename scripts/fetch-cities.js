const cities = require('all-the-cities');
const fs = require('fs');
const path = require('path');

// Sort by population
cities.sort((a, b) => b.population - a.population);

// Filter top 100 Indian cities
const indianCities = cities.filter(c => c.country === 'IN').slice(0, 100).map(c => c.name);

// Filter top 1000 global cities (excluding India)
const globalCities = cities.filter(c => c.country !== 'IN').slice(0, 1000).map(c => c.name);

const combined = [...indianCities, ...globalCities];
// Remove exact name duplicates just in case
const uniqueCities = [...new Set(combined)];

const outputPath = path.join(__dirname, 'cities.json');
fs.writeFileSync(outputPath, JSON.stringify(uniqueCities, null, 2));

console.log(`Generated ${uniqueCities.length} top cities and saved to cities.json`);
