import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, LayerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { hasCoordinates, type GuidePlace } from '@/data/travelGuide';

interface Props {
  places: GuidePlace[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function TravelGuideMap({ places, activeId, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const mapped = places.filter(hasCoordinates).length;

  useEffect(() => {
    let disposed = false;
    import('leaflet').then(L => {
      if (disposed || !container.current) return;
      const map = L.map(container.current, { scrollWheelZoom: false }).setView([20, 0], 2);
      mapRef.current = map;
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).on('tileerror', () => { if (!disposed) setFailed(true); }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      setReady(true);
    }).catch(() => { if (!disposed) setFailed(true); });
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    let disposed = false;
    import('leaflet').then(L => {
      const map = mapRef.current;
      const layer = layerRef.current;
      if (disposed || !map || !layer) return;
      map.invalidateSize({ pan: false });
      layer.clearLayers();
      const bounds: [number, number][] = [];
      const groups = new Map<string, { place: GuidePlace & { lat: number; lon: number }; number: number }[]>();
      places.forEach((place, index) => {
        if (!hasCoordinates(place)) return;
        const key = `${place.lat},${place.lon}`;
        const group = groups.get(key) ?? [];
        group.push({ place, number: index + 1 });
        groups.set(key, group);
      });
      groups.forEach(group => {
        const first = group[0];
        const point: [number, number] = [first.place.lat, first.place.lon];
        bounds.push(point);
        const selected = group.some(item => item.place.id === activeId);
        const label = group.length > 1 ? `${group.length} places at this location` : first.place.name;
        const icon = L.divIcon({
          className: 'guide-marker-wrapper',
          html: `<span class="guide-map-pin${selected ? ' is-active' : ''}">${first.number}${group.length > 1 ? '+' : ''}</span>`,
          iconSize: [30, 38], iconAnchor: [15, 38],
        });
        const marker = L.marker(point, { icon, title: label, alt: label, keyboard: true }).addTo(layer);
        marker.getElement()?.setAttribute('aria-label', label);
        const tooltip = document.createElement('span');
        tooltip.textContent = label;
        marker.bindTooltip(tooltip);
        if (group.length === 1) {
          marker.on('click', () => onSelect(first.place.id));
        } else {
          const menu = document.createElement('div');
          group.forEach(({ place, number }) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'guide-map-choice';
            button.textContent = `${number}. ${place.name}`;
            button.addEventListener('click', () => { onSelect(place.id); map.closePopup(); });
            menu.appendChild(button);
          });
          marker.bindPopup(menu);
        }
      });
      if (bounds.length) map.fitBounds(bounds, { padding: [35, 35], maxZoom: 14, animate: false });
    });
    return () => { disposed = true; };
  }, [places, ready, activeId, onSelect]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-stone-900">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5">
        <h3 className="text-sm font-semibold text-white">Explore the map</h3>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-1 text-[11px] tabular-nums text-stone-300"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-red-400" />{mapped} mapped places</span>
      </div>
      <div ref={container} role="region" aria-label="Interactive map of listed travel places" className="guide-map h-[240px] bg-stone-800 sm:h-[320px] lg:h-[clamp(240px,32vh,320px)]" />
      <p className="px-5 py-3 text-xs leading-relaxed text-stone-400">
        {!mapped ? 'No sourced coordinates for this selection. Use the listing map links; no location is guessed.' : 'Pins match listing numbers. Select a pin for details; + groups shared locations. Use the controls to zoom.'}
        {places.length > mapped && mapped > 0 && ` ${places.length - mapped} places have no sourced coordinates.`}
      </p>
      {failed && <p role="status" className="px-5 pb-4 text-xs text-amber-300">The map service could not load completely. All listings and map search links remain available.</p>}
    </div>
  );
}
