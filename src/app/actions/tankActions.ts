'use server';

import { db } from '@/lib/db';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addTank(formData: FormData) {
  const name = formData.get('name') as string;
  const volume = parseFloat(formData.get('volume') as string);
  const equipment = formData.get('equipment') as string;
  const hasGravel = formData.get('hasGravel') === 'yes' ? 1 : 0;
  const isPlanted = formData.get('isPlanted') === 'yes' ? 1 : 0;
  const targetTemp = parseFloat(formData.get('targetTemp') as string) || 24.0;
  const targetPh = parseFloat(formData.get('targetPh') as string) || 7.0;
  const imageUrl = formData.get('imageUrl') as string || null;

  if (!name || isNaN(volume)) {
    throw new Error('Name and Volume are required');
  }

  const id = crypto.randomUUID();

  await db.prepare(`
    INSERT INTO Tank (id, name, volume, equipment, hasGravel, isPlanted, setupDate, healthScore, targetTemp, targetPh, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), 100, ?, ?, ?)
  `).run(id, name, volume, equipment || null, hasGravel, isPlanted, targetTemp, targetPh, imageUrl);

  revalidatePath('/');
  revalidatePath('/habitats');
  redirect('/');
}

export async function updateTank(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const volume = parseFloat(formData.get('volume') as string);
  const equipment = formData.get('equipment') as string;
  const hasGravel = formData.get('hasGravel') === 'yes' ? 1 : 0;
  const isPlanted = formData.get('isPlanted') === 'yes' ? 1 : 0;
  const targetTemp = parseFloat(formData.get('targetTemp') as string) || 24.0;
  const targetPh = parseFloat(formData.get('targetPh') as string) || 7.0;
  const imageUrl = formData.get('imageUrl') as string || null;

  if (!id || !name || isNaN(volume)) {
    throw new Error('ID, Name, and Volume are required');
  }

  await db.prepare(`
    UPDATE Tank 
    SET name = ?, volume = ?, equipment = ?, hasGravel = ?, isPlanted = ?, targetTemp = ?, targetPh = ?, imageUrl = ?
    WHERE id = ?
  `).run(name, volume, equipment || null, hasGravel, isPlanted, targetTemp, targetPh, imageUrl, id);

  revalidatePath('/');
  revalidatePath('/habitats');
  revalidatePath(`/tanks/${id}`);
}
