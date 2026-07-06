import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import FeedStockForm from '@/components/FeedStockForm';

export default async function AddFeedStock({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const tank = await db.prepare('SELECT * FROM Tank WHERE id = ?').get(resolvedParams.id) as any;
  if (!tank) return notFound();

  return (
    <FeedStockForm tankId={tank.id} tankName={tank.name} />
  );
}
