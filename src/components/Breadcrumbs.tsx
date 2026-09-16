import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  path?: string;
}

interface Props {
  items: Crumb[];
}

export function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {item.path ? (
            <Link to={item.path} className="text-stone-500 hover:text-amber-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-white/80">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="w-3 h-3 text-stone-600" />}
        </div>
      ))}
    </nav>
  );
}
