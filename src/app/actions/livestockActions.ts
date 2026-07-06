'use server';

import { db } from '@/lib/db';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addLivestock(formData: FormData) {
  const tankId = formData.get('tankId') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const species = formData.get('species') as string;
  const name = formData.get('name') as string;
  const quantity = parseInt(formData.get('quantity') as string, 10);
  const size = formData.get('size') as string;
  const boughtFrom = formData.get('boughtFrom') as string;
  const price = formData.get('price') ? parseFloat(formData.get('price') as string) : null;
  const addedDateStr = formData.get('addedDate') as string;

  if (!tankId || !species || isNaN(quantity)) {
    throw new Error('Missing required fields');
  }

  const addedDate = addedDateStr ? new Date(addedDateStr).toISOString() : new Date().toISOString();
  const id = crypto.randomUUID();

  await db.prepare(`
    INSERT INTO FishProfile (id, tankId, species, name, quantity, size, boughtFrom, price, imageUrl, addedDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, tankId, species, name || null, quantity, size || null, boughtFrom || null, price, imageUrl || null, addedDate
  );

  revalidatePath(`/tanks/${tankId}`);
  redirect(`/tanks/${tankId}`);
}

export async function updateLivestock(formData: FormData) {
  const id = formData.get('id') as string;
  const tankId = formData.get('tankId') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const species = formData.get('species') as string;
  const name = formData.get('name') as string;
  const quantity = parseInt(formData.get('quantity') as string, 10);
  const size = formData.get('size') as string;
  const boughtFrom = formData.get('boughtFrom') as string;
  const price = formData.get('price') ? parseFloat(formData.get('price') as string) : null;
  const addedDateStr = formData.get('addedDate') as string;

  if (!id || !tankId || !species || isNaN(quantity)) {
    throw new Error('Missing required fields');
  }

  const addedDate = addedDateStr ? new Date(addedDateStr).toISOString() : new Date().toISOString();

  await db.prepare(`
    UPDATE FishProfile
    SET species = ?, name = ?, quantity = ?, size = ?, boughtFrom = ?, price = ?, imageUrl = ?, addedDate = ?
    WHERE id = ? AND tankId = ?
  `).run(
    species, name || null, quantity, size || null, boughtFrom || null, price, imageUrl || null, addedDate, id, tankId
  );

  revalidatePath(`/tanks/${tankId}`);
  redirect(`/tanks/${tankId}`);
}

export async function deleteLivestock(id: string, tankId: string) {
  await db.prepare('DELETE FROM FishProfile WHERE id = ? AND tankId = ?').run(id, tankId);
  revalidatePath(`/tanks/${tankId}`);
  redirect(`/tanks/${tankId}`);
}
