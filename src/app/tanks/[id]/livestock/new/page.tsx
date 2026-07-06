import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import LivestockForm from '@/components/LivestockForm';

export default async function AddLivestock({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const tank = await db.prepare('SELECT * FROM Tank WHERE id = ?').get(resolvedParams.id) as any;
  if (!tank) return notFound();

  return (
    <LivestockForm tankId={tank.id} tankName={tank.name} />
  );
}
