'use server';

import { db } from '@/lib/db';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addFeedStock(formData: FormData) {
  const tankId = formData.get('tankId') as string;
  const brandName = formData.get('brandName') as string;
  const foodType = formData.get('foodType') as string;
  const weight = formData.get('weight') ? parseFloat(formData.get('weight') as string) : null;
  const boughtDateStr = formData.get('boughtDate') as string;
  const expirationDateStr = formData.get('expirationDate') as string;
  const notes = formData.get('notes') as string;

  if (!tankId || !brandName || !foodType) {
    throw new Error('Tank ID, Brand Name, and Food Type are required');
  }

  const boughtDate = boughtDateStr ? new Date(boughtDateStr).toISOString() : new Date().toISOString();
  const expirationDate = expirationDateStr ? new Date(expirationDateStr).toISOString() : null;
  const id = crypto.randomUUID();

  await db.prepare(`
    INSERT INTO FeedStock (id, tankId, brandName, foodType, weight, boughtDate, expirationDate, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, tankId, brandName, foodType, weight, boughtDate, expirationDate, notes || null);

  revalidatePath(`/tanks/${tankId}`);
  redirect(`/tanks/${tankId}`);
}
