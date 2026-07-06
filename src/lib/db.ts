import path from 'path';

let db: any;

const connectionString = process.env.DATABASE_URL;

// Helper to translate queries from SQLite to PostgreSQL
function translateQuery(sqlString: string): string {
  // Convert SQLite ? placeholders to PostgreSQL $1, $2...
  let index = 0;
  let translated = sqlString.replace(/\?/g, () => {
    index++;
    return `$${index}`;
  });

  // Adapt SQLite date functions to PostgreSQL
  translated = translated
    .replace(/datetime\('now'\)/gi, 'NOW()')
    .replace(/datetime\('now', 'localtime'\)/gi, 'NOW()');

  // Lowercase and strip double quotes from SQL identifiers only, leaving string literals untouched
  const parts = translated.split("'");
  for (let i = 0; i < parts.length; i += 2) {
    parts[i] = parts[i]
      .toLowerCase()
      .replace(/"/g, ''); // Remove double quotes
  }

  return parts.join("'");
}

if (connectionString) {
  // PostgreSQL Mode (Vercel Production / Supabase Integration)
  const postgres = require('postgres');
  
  let sql: any;
  try {
    // Parse connection string manually to bypass connection pooler URL formatting quirks
    const url = new URL(connectionString);
    const username = decodeURIComponent(url.username);
    const password = decodeURIComponent(url.password);
    const host = url.hostname;
    const port = parseInt(url.port || '5432');
    const database = decodeURIComponent(url.pathname.replace(/^\//, ''));

    sql = postgres({
      host,
      port,
      database,
      username,
      password,
      ssl: { rejectUnauthorized: false },
      prepare: false // CRITICAL: Disable prepared statements for pgBouncer / Supavisor transaction mode compatibility
    });
  } catch (err) {
    // Fallback to direct string connection if parsing fails
    sql = postgres(connectionString, {
      ssl: { rejectUnauthorized: false },
      prepare: false
    });
  }

  db = {
    async exec(sqlString: string) {
      // Execute raw SQL commands, handling multiple statements separated by semicolon
      const translated = translateQuery(sqlString);
      const queries = translated.split(';').map(q => q.trim()).filter(Boolean);
      for (const q of queries) {
        await sql.unsafe(q);
      }
    },
    prepare(sqlString: string) {
      const pgSql = translateQuery(sqlString);

      return {
        async all(...params: any[]) {
          return await sql.unsafe(pgSql, params);
        },
        async get(...params: any[]) {
          const results = await sql.unsafe(pgSql, params);
          return results[0] || null;
        },
        async run(...params: any[]) {
          return await sql.unsafe(pgSql, params);
        }
      };
    }
  };
} else {
  // SQLite Mode (Fallback for local offline development)
  const Database = require('better-sqlite3');
  const dbPath = path.join(process.cwd(), 'dev.db');
  const sqliteDb = new Database(dbPath);
  sqliteDb.pragma('journal_mode = WAL');

  db = {
    async exec(sqlString: string) {
      return sqliteDb.exec(sqlString);
    },
    prepare(sqlString: string) {
      return {
        async all(...params: any[]) {
          return sqliteDb.prepare(sqlString).all(...params);
        },
        async get(...params: any[]) {
          return sqliteDb.prepare(sqlString).get(...params) || null;
        },
        async run(...params: any[]) {
          return sqliteDb.prepare(sqlString).run(...params);
        }
      };
    }
  };
}

// Automatically execute table initialization scripts asynchronously on startup
(async () => {
  try {
    if (connectionString) {
      // Create all 7 tables in PostgreSQL with completely lowercase names to ensure case-insensitive query matches
      await db.exec(`
        CREATE TABLE IF NOT EXISTS tank (
          id TEXT NOT NULL PRIMARY KEY,
          name TEXT NOT NULL,
          volume DOUBLE PRECISION NOT NULL,
          equipment TEXT,
          hasgravel INTEGER NOT NULL DEFAULT 0,
          isplanted INTEGER NOT NULL DEFAULT 0,
          setupdate TEXT NOT NULL,
          healthscore INTEGER NOT NULL DEFAULT 100,
          targettemp DOUBLE PRECISION DEFAULT 24.0,
          targetph DOUBLE PRECISION DEFAULT 7.0,
          imageurl TEXT
        );

        CREATE TABLE IF NOT EXISTS fishprofile (
          id TEXT NOT NULL PRIMARY KEY,
          species TEXT NOT NULL,
          name TEXT,
          quantity INTEGER NOT NULL DEFAULT 1,
          size TEXT,
          boughtfrom TEXT,
          price DOUBLE PRECISION,
          addeddate TEXT NOT NULL,
          imageurl TEXT,
          tankid TEXT NOT NULL REFERENCES tank(id) ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE TABLE IF NOT EXISTS plantprofile (
          id TEXT NOT NULL PRIMARY KEY,
          species TEXT NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          tankid TEXT NOT NULL REFERENCES tank(id) ON DELETE CASCADE ON UPDATE CASCADE,
          addeddate TEXT NOT NULL,
          boughtfrom TEXT,
          price DOUBLE PRECISION
        );

        CREATE TABLE IF NOT EXISTS equipment (
          id TEXT NOT NULL PRIMARY KEY,
          name TEXT NOT NULL,
          company TEXT,
          price DOUBLE PRECISION,
          boughtdate TEXT NOT NULL,
          tankid TEXT NOT NULL REFERENCES tank(id) ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE TABLE IF NOT EXISTS waterlog (
          id TEXT NOT NULL PRIMARY KEY,
          timestamp TEXT NOT NULL,
          temperature DOUBLE PRECISION,
          ph DOUBLE PRECISION,
          ammonia DOUBLE PRECISION,
          nitrite DOUBLE PRECISION,
          nitrate DOUBLE PRECISION,
          tankid TEXT NOT NULL REFERENCES tank(id) ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE TABLE IF NOT EXISTS maintenancelog (
          id TEXT NOT NULL PRIMARY KEY,
          timestamp TEXT NOT NULL,
          activitytype TEXT NOT NULL,
          notes TEXT,
          waterchangepercent DOUBLE PRECISION DEFAULT 0.0,
          tankid TEXT NOT NULL REFERENCES tank(id) ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE TABLE IF NOT EXISTS feedstock (
          id TEXT NOT NULL PRIMARY KEY,
          tankid TEXT NOT NULL REFERENCES tank(id) ON DELETE CASCADE ON UPDATE CASCADE,
          brandname TEXT NOT NULL,
          foodtype TEXT NOT NULL,
          weight DOUBLE PRECISION,
          boughtdate TEXT NOT NULL,
          expirationdate TEXT,
          notes TEXT
        );
      `);
    } else {
      // Legacy SQLite initialization
      await db.exec(`
        CREATE TABLE IF NOT EXISTS "PlantProfile" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "species" TEXT NOT NULL,
          "quantity" INTEGER NOT NULL DEFAULT 1,
          "tankId" TEXT NOT NULL,
          "addedDate" TEXT NOT NULL,
          "boughtFrom" TEXT,
          "price" REAL
        );
      `);

      try {
        await db.exec('ALTER TABLE "Tank" ADD COLUMN "targetTemp" REAL DEFAULT 24.0');
      } catch (e) {}
      try {
        await db.exec('ALTER TABLE "Tank" ADD COLUMN "targetPh" REAL DEFAULT 7.0');
      } catch (e) {}
      try {
        await db.exec('ALTER TABLE "MaintenanceLog" ADD COLUMN "waterChangePercent" REAL DEFAULT 0.0');
      } catch (e) {}

      await db.exec(`
        CREATE TABLE IF NOT EXISTS "FeedStock" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "tankId" TEXT NOT NULL,
          "brandName" TEXT NOT NULL,
          "foodType" TEXT NOT NULL,
          "weight" REAL,
          "boughtDate" TEXT NOT NULL,
          "expirationDate" TEXT,
          "notes" TEXT
        );
      `);
    }
  } catch (err) {
    console.error('Database schema initialization error:', err);
  }
})();

export { db };
