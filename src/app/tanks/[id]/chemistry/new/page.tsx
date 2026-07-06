import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import ChemistryForm from '@/components/ChemistryForm';

export default async function AddChemistryLog({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const tank = await db.prepare('SELECT * FROM Tank WHERE id = ?').get(resolvedParams.id) as any;
  if (!tank) return notFound();

  return (
    <ChemistryForm tankId={tank.id} tankName={tank.name} />
  );
}
