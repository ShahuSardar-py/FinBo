'use server';

import { db } from '@/lib/db';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addPlant(formData: FormData) {
  const tankId = formData.get('tankId') as string;
  const species = formData.get('species') as string;
  const quantity = parseInt(formData.get('quantity') as string, 10);
  const boughtFrom = formData.get('boughtFrom') as string;
  const price = formData.get('price') ? parseFloat(formData.get('price') as string) : null;
  const addedDateStr = formData.get('addedDate') as string;

  if (!tankId || !species || isNaN(quantity)) {
    throw new Error('Tank ID, Species, and Quantity are required');
  }

  const addedDate = addedDateStr ? new Date(addedDateStr).toISOString() : new Date().toISOString();
  const id = crypto.randomUUID();

  await db.prepare(`
    INSERT INTO PlantProfile (id, tankId, species, quantity, boughtFrom, price, addedDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, tankId, species, quantity, boughtFrom || null, price, addedDate);

  revalidatePath(`/tanks/${tankId}`);
  redirect(`/tanks/${tankId}`);
}
