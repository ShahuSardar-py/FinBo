import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import EquipmentForm from '@/components/EquipmentForm';

export default async function AddEquipment({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const tank = await db.prepare('SELECT * FROM Tank WHERE id = ?').get(resolvedParams.id) as any;
  if (!tank) return notFound();

  return (
    <EquipmentForm tankId={tank.id} tankName={tank.name} />
  );
}
