'use server';

import { db } from '@/lib/db';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addMaintenanceLog(formData: FormData) {
  const tankId = formData.get('tankId') as string;
  const activityType = formData.get('activityType') as string;
  const notes = formData.get('notes') as string;
  const timestampStr = formData.get('timestamp') as string;
  const waterChangePercent = parseFloat(formData.get('waterChangePercent') as string) || 0.0;

  if (!tankId || !activityType) {
    throw new Error('Tank ID and Activity Type are required');
  }

  const timestamp = timestampStr ? new Date(timestampStr).toISOString() : new Date().toISOString();
  const id = crypto.randomUUID();

  await db.prepare(`
    INSERT INTO MaintenanceLog (id, tankId, activityType, notes, timestamp, waterChangePercent)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, tankId, activityType, notes || null, timestamp, waterChangePercent);

  revalidatePath(`/tanks/${tankId}`);
  revalidatePath('/');
  redirect(`/tanks/${tankId}`);
}

export async function quickFeed(tankId: string) {
  if (!tankId) {
    throw new Error('Tank ID is required');
  }

  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  await db.prepare(`
    INSERT INTO MaintenanceLog (id, tankId, activityType, notes, timestamp, waterChangePercent)
    VALUES (?, ?, 'Feeding', 'Logged quick feeding session.', ?, 0.0)
  `).run(id, tankId, timestamp);

  revalidatePath(`/tanks/${tankId}`);
  revalidatePath('/');
}
