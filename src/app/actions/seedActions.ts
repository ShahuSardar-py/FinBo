'use server';

import { db } from '@/lib/db';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

export async function clearDatabase() {
  await db.exec('DELETE FROM WaterLog');
  await db.exec('DELETE FROM MaintenanceLog');
  await db.exec('DELETE FROM Equipment');
  await db.exec('DELETE FROM FishProfile');
  await db.exec('DELETE FROM PlantProfile');
  await db.exec('DELETE FROM Tank');
  
  revalidatePath('/');
  revalidatePath('/habitats');
  revalidatePath('/chemistry');
}

export async function seedDatabase() {
  // Clear first to avoid duplicate seeds
  await clearDatabase();

  // 1. Zen Garden (Planted Aquascape)
  const zenId = crypto.randomUUID();
  await db.prepare(`
    INSERT INTO Tank (id, name, volume, equipment, hasGravel, isPlanted, setupDate, healthScore)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    zenId, 
    'Zen Garden', 
    120.0, 
    'Oase BioMaster 350 Canister, Twinstar 600EA LED Light, Inline CO2 Injection', 
    1, // hasGravel
    1, // isPlanted
    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    98
  );

  // Zen Garden Fauna
  const faunaList = [
    { species: 'Neon Tetra', name: 'Neons', quantity: 15, size: '1 inch', price: 2.99, boughtFrom: 'Aqua Emporium' },
    { species: 'Cherry Shrimp', name: 'Cleaners', quantity: 20, size: '0.5 inch', price: 3.50, boughtFrom: 'Shrimp Heaven' },
    { species: 'Otocinclus Catfish', name: 'Otos', quantity: 4, size: '1.2 inches', price: 4.50, boughtFrom: 'Aqua Emporium' },
    { species: 'Amano Shrimp', name: 'Algae Eaters', quantity: 6, size: '1.5 inches', price: 3.99, boughtFrom: 'Aqua Emporium' }
  ];

  for (const f of faunaList) {
    await db.prepare(`
      INSERT INTO FishProfile (id, name, species, quantity, size, tankId, addedDate, boughtFrom, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      f.name,
      f.species,
      f.quantity,
      f.size,
      zenId,
      new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      f.boughtFrom,
      f.price
    );
  }

  // Zen Garden Flora
  const floraList = [
    { species: 'Monte Carlo (Carpeting)', quantity: 3, price: 8.50, boughtFrom: 'Tropica Plants' },
    { species: 'Rotala Rotundifolia H\'Ra', quantity: 15, price: 6.00, boughtFrom: 'Tropica Plants' },
    { species: 'Anubias Nana Petite', quantity: 4, price: 9.99, boughtFrom: 'Aqua Emporium' },
    { species: 'Java Fern', quantity: 2, price: 7.99, boughtFrom: 'Local Fish Store' }
  ];

  for (const pl of floraList) {
    await db.prepare(`
      INSERT INTO PlantProfile (id, species, quantity, tankId, addedDate, boughtFrom, price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      pl.species,
      pl.quantity,
      zenId,
      new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
      pl.boughtFrom,
      pl.price
    );
  }

  // Zen Garden Equipment
  const eqList = [
    { name: 'BioMaster Thermo 350', company: 'Oase', price: 289.99, boughtFrom: 'Aquarium Depot' },
    { name: '600EA LED Light', company: 'Twinstar', price: 185.00, boughtFrom: 'Twinstar Direct' },
    { name: 'Dual Stage CO2 Regulator', company: 'CO2Art', price: 149.99, boughtFrom: 'CO2Art Europe' }
  ];

  for (const eq of eqList) {
    await db.prepare(`
      INSERT INTO Equipment (id, name, company, boughtDate, price, boughtFrom, tankId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      eq.name,
      eq.company,
      new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
      eq.price,
      eq.boughtFrom,
      zenId
    );
  }

  // Zen Garden Water Logs (past 5 days)
  for (let i = 4; i >= 0; i--) {
    const logDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString();
    await db.prepare(`
      INSERT INTO WaterLog (id, tankId, timestamp, ph, ammonia, nitrite, nitrate, temperature, gh, kh)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      zenId,
      logDate,
      6.7 + (Math.random() - 0.5) * 0.2, // pH stays around 6.7
      0.0,
      0.0,
      5.0 + Math.random() * 2.0, // Nitrates low and stable
      24.2 + (Math.random() - 0.5) * 0.4, // Temp stable around 24.2 C
      6.0,
      4.0
    );
  }

  // Zen Garden Maintenance Logs
  await db.prepare(`
    INSERT INTO MaintenanceLog (id, tankId, timestamp, activityType, notes)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    zenId,
    new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    'Water Change & Trimming',
    'Performed a 30% water change. Trimmed the Rotala carpet at the back. Added liquid fertilizer (Tropica Premium).'
  );

  await db.prepare(`
    INSERT INTO MaintenanceLog (id, tankId, timestamp, activityType, notes)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    zenId,
    new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    'Filter Maintenance',
    'Cleaned the prefilter sponges in the BioMaster canister. Rinsed with aquarium water.'
  );


  // 2. Pacific Reef (Saltwater Reef)
  const reefId = crypto.randomUUID();
  await db.prepare(`
    INSERT INTO Tank (id, name, volume, equipment, hasGravel, isPlanted, setupDate, healthScore)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    reefId, 
    'Pacific Reef', 
    350.0, 
    'Sump filtration, Reef Octopus Classic Skimmer, 2x Ecotech Radion G5 LED, Nero 5 Wavemaker', 
    1, // hasGravel
    0, // isPlanted
    new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    95
  );

  // Reef Fauna
  const reefFauna = [
    { species: 'Ocellaris Clownfish', name: 'Nemo & Marlin', quantity: 2, size: '2 inches', price: 29.99, boughtFrom: 'Saltwater Pros' },
    { species: 'Blue Tang', name: 'Dory', quantity: 1, size: '3.5 inches', price: 79.99, boughtFrom: 'Marine Center' },
    { species: 'Cleaner Shrimp', name: 'Jacques', quantity: 2, size: '2 inches', price: 24.99, boughtFrom: 'Saltwater Pros' },
    { species: 'Bubble Tip Anemone', name: 'Anemone', quantity: 1, size: 'Medium', price: 49.99, boughtFrom: 'Coral Cave' }
  ];

  for (const f of reefFauna) {
    await db.prepare(`
      INSERT INTO FishProfile (id, name, species, quantity, size, tankId, addedDate, boughtFrom, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      f.name,
      f.species,
      f.quantity,
      f.size,
      reefId,
      new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      f.boughtFrom,
      f.price
    );
  }

  // Reef Equipment
  const reefEq = [
    { name: 'Radion G5 Blue LED', company: 'Ecotech Marine', price: 449.99, boughtFrom: 'Marine Depot' },
    { name: 'Classic 150-INT Skimmer', company: 'Reef Octopus', price: 269.99, boughtFrom: 'Premium Aquatics' },
    { name: 'Nero 5 Wavemaker', company: 'AquaIllumination', price: 220.00, boughtFrom: 'Premium Aquatics' }
  ];

  for (const eq of reefEq) {
    await db.prepare(`
      INSERT INTO Equipment (id, name, company, boughtDate, price, boughtFrom, tankId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      eq.name,
      eq.company,
      new Date(Date.now() - 145 * 24 * 60 * 60 * 1000).toISOString(),
      eq.price,
      eq.boughtFrom,
      reefId
    );
  }

  // Reef Water Logs (past 5 days)
  for (let i = 4; i >= 0; i--) {
    const logDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString();
    await db.prepare(`
      INSERT INTO WaterLog (id, tankId, timestamp, ph, ammonia, nitrite, nitrate, temperature, gh, kh)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      crypto.randomUUID(),
      reefId,
      logDate,
      8.2 + (Math.random() - 0.5) * 0.1, // Saltwater pH
      0.0,
      0.0,
      2.0 + Math.random() * 1.5, // Low nitrates essential for reefs
      25.5 + (Math.random() - 0.5) * 0.3, // Reef temp around 25.5 C
      12.0, // High GH (Hardness/Calcium)
      8.5  // KH around 8.5 dKH
    );
  }

  // Reef Maintenance Logs
  await db.prepare(`
    INSERT INTO MaintenanceLog (id, tankId, timestamp, activityType, notes)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    reefId,
    new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    'Protein Skimmer Empty',
    'Cleaned and emptied the protein skimmer collection cup. Re-calibrated the water gate.'
  );

  await db.prepare(`
    INSERT INTO MaintenanceLog (id, tankId, timestamp, activityType, notes)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    reefId,
    new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    'Water Change (Saltwater)',
    '10% saltwater change (35 Liters) with Red Sea salt mix. Parameters checked: Salinity 1.025sg.'
  );

  revalidatePath('/');
  revalidatePath('/habitats');
  revalidatePath('/chemistry');
}
