'use server';

import { db } from '@/lib/db';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addEquipment(formData: FormData) {
  const tankId = formData.get('tankId') as string;
  const name = formData.get('name') as string;
  const company = formData.get('company') as string;
  const priceStr = formData.get('price') as string;
  const boughtFrom = formData.get('boughtFrom') as string;
  const boughtDateStr = formData.get('boughtDate') as string;

  if (!tankId || !name) {
    throw new Error('Name and Tank ID are required fields');
  }

  const boughtDate = boughtDateStr ? new Date(boughtDateStr).toISOString() : new Date().toISOString();
  const price = priceStr ? parseFloat(priceStr) : null;
  const id = crypto.randomUUID();

  await db.prepare(`
    INSERT INTO Equipment (id, tankId, name, company, price, boughtFrom, boughtDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, tankId, name, company || null, isNaN(price as number) ? null : price, boughtFrom || null, boughtDate);

  revalidatePath(`/tanks/${tankId}`);
  redirect(`/tanks/${tankId}`);
}
