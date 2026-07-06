const postgres = require('postgres');

const poolerUrl = "postgresql://postgres.muwguhzaviaqwgdxlrpk:FINBOwillbe51072@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres";
const directUrl = "postgresql://postgres:FINBOwillbe51072@db.muwguhzaviaqwgdxlrpk.supabase.co:5432/postgres";

async function testConnection(name, url, options = {}) {
  console.log(`\nTesting connection to: ${name}...`);
  try {
    const sql = postgres(url, {
      ssl: { rejectUnauthorized: false },
      timeout: 5,
      ...options
    });
    const result = await sql`SELECT 1 as val`;
    console.log(`✅ ${name} Success:`, result);
    await sql.end();
  } catch (err) {
    console.error(`❌ ${name} Failed:`, err);
  }
}

async function run() {
  // Test 1: Pooler with standard string
  await testConnection("Pooler (URL String)", poolerUrl);

  // Test 2: Pooler with prepare: false
  await testConnection("Pooler (URL String + prepare:false)", poolerUrl, { prepare: false });

  // Test 3: Pooler with URL parsing
  try {
    const parsed = new URL(poolerUrl);
    const sql = postgres({
      host: parsed.hostname,
      port: parseInt(parsed.port),
      database: parsed.pathname.replace(/^\//, ''),
      username: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      ssl: { rejectUnauthorized: false },
      prepare: false
    });
    const result = await sql`SELECT 1 as val`;
    console.log("✅ Pooler (Parsed Options) Success:", result);
    await sql.end();
  } catch (err) {
    console.error("❌ Pooler (Parsed Options) Failed:", err);
  }

  // Test 4: Direct Connection
  await testConnection("Direct Connection (5432)", directUrl);
}

run();
