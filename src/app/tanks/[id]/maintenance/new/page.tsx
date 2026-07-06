import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import MaintenanceForm from '@/components/MaintenanceForm';

export default async function AddMaintenanceLog({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const tank = await db.prepare('SELECT * FROM Tank WHERE id = ?').get(resolvedParams.id) as any;
  if (!tank) return notFound();

  return (
    <MaintenanceForm tankId={tank.id} tankName={tank.name} />
  );
}
