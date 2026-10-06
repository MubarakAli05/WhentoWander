export const navLinks = [
  { label: 'Explore', path: '/', detailPaths: ['/destination/'] },
  { label: 'By Month', path: '/months', detailPaths: ['/month/'] },
  { label: 'Experiences', path: '/experiences', detailPaths: ['/experience/'] },
  { label: 'Countries', path: '/countries', detailPaths: ['/country/'] },
  { label: 'World', path: '/world', detailPaths: [] },
  { label: 'Events', path: '/events', detailPaths: [] },
  { label: 'Phenomena', path: '/phenomena', detailPaths: ['/phenomena/'] },
  { label: 'Wanderlist', path: '/wanderlist', detailPaths: [] },
];

export function isNavigationActive(pathname: string, link: typeof navLinks[number]) {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === link.path || link.detailPaths.some(prefix => path.startsWith(prefix));
}
