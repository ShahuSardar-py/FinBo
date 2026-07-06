import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import LivestockDetailClient from '@/components/LivestockDetailClient';

export default async function LivestockDetailPage({
  params
}: {
  params: Promise<{ id: string; livestockId: string }>;
}) {
  const resolvedParams = await params;
  const tank = await db.prepare('SELECT id, name FROM Tank WHERE id = ?').get(resolvedParams.id) as any;
  if (!tank) return notFound();

  const fish = await db.prepare('SELECT * FROM FishProfile WHERE id = ? AND tankId = ?').get(resolvedParams.livestockId, tank.id) as any;
  if (!fish) return notFound();

  return (
    <LivestockDetailClient tank={tank} fish={fish} />
  );
}
