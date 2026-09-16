import { DestinationCard } from './DestinationCard';
import { EmptyState } from './EmptyState';
import type { Destination } from '@/data';

interface Props {
  destinations: Destination[];
  emptyMessage?: string;
}

export function DestinationGrid({ destinations, emptyMessage }: Props) {
  if (!destinations.length) {
    return <EmptyState message={emptyMessage || 'No destinations match your filters.'} />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {destinations.map((dest, i) => (
        <DestinationCard key={dest.id} destination={dest} index={i} />
      ))}
    </div>
  );
}
