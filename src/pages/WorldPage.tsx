import { SectionHeading } from '@/components/SectionHeading';
import { WorldExplorer } from '@/components/WorldExplorer';

export function WorldPage() {
  return (
    <div className="bg-stone-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <SectionHeading
          eyebrow="Explore the World"
          title="Discover by Continent"
          subtitle="Select a region to reveal countries. Search by name to find your next destination."
        />
        <WorldExplorer />
      </div>
    </div>
  );
}
