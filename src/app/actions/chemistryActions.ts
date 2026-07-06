'use server';

import { db } from '@/lib/db';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addWaterLog(formData: FormData) {
  const tankId = formData.get('tankId') as string;
  const phVal = formData.get('ph') ? parseFloat(formData.get('ph') as string) : null;
  const ammoniaVal = formData.get('ammonia') ? parseFloat(formData.get('ammonia') as string) : null;
  const nitriteVal = formData.get('nitrite') ? parseFloat(formData.get('nitrite') as string) : null;
  const nitrateVal = formData.get('nitrate') ? parseFloat(formData.get('nitrate') as string) : null;
  const tempVal = formData.get('temperature') ? parseFloat(formData.get('temperature') as string) : null;
  const ghVal = formData.get('gh') ? parseFloat(formData.get('gh') as string) : null;
  const khVal = formData.get('kh') ? parseFloat(formData.get('kh') as string) : null;
  const timestampStr = formData.get('timestamp') as string;

  if (!tankId) {
    throw new Error('Tank ID is required');
  }

  const timestamp = timestampStr ? new Date(timestampStr).toISOString() : new Date().toISOString();
  const id = crypto.randomUUID();

  await db.prepare(`
    INSERT INTO WaterLog (id, tankId, ph, ammonia, nitrite, nitrate, temperature, gh, kh, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, tankId, phVal, ammoniaVal, nitriteVal, nitrateVal, tempVal, ghVal, khVal, timestamp);

  // Dynamically update the tank health score based on parameter levels
  let deductions = 0;
  if (ammoniaVal !== null && ammoniaVal > 0.25) deductions += 20;
  if (nitriteVal !== null && nitriteVal > 0.25) deductions += 25;
  if (nitrateVal !== null && nitrateVal > 20) deductions += 10;
  if (phVal !== null && (phVal < 6.0 || phVal > 8.5)) deductions += 15;
  
  const currentHealth = 100 - deductions;
  await db.prepare('UPDATE Tank SET healthScore = ? WHERE id = ?').run(Math.max(0, currentHealth), tankId);

  revalidatePath(`/tanks/${tankId}`);
  revalidatePath('/chemistry');
  revalidatePath('/');
  redirect(`/tanks/${tankId}`);
}
