const palette = {
  rose: 'pastel-panel bg-dusty-rose text-cocoa border-dusty-rose-accent',
  sage: 'pastel-panel bg-sage text-cocoa border-sage-accent',
  periwinkle: 'pastel-panel bg-periwinkle text-cocoa border-periwinkle-accent',
  gold: 'pastel-panel bg-gold text-cocoa border-gold-accent',
  mauve: 'pastel-panel bg-mauve text-cocoa border-mauve-accent',
  neutral: 'pastel-panel bg-sand text-cocoa border-cocoa/20',
};

export function getRegionColor(region: string): string {
  switch (region.trim().toLowerCase()) {
    case 'europe': return palette.rose;
    case 'asia': return palette.sage;
    case 'the americas':
    case 'americas':
    case 'north america':
    case 'south america':
    case 'central america':
    case 'caribbean': return palette.periwinkle;
    case 'africa': return palette.gold;
    case 'middle east': return palette.mauve;
    default: return palette.neutral;
  }
}

export function getSeasonColor(season: string): string {
  if (/\b(year[ -]round|all[ -]year)\b/i.test(season)) return palette.mauve;
  const matches = [
    { pattern: /\b(spring|blossoms?|blooms?)\b/i, color: palette.sage },
    { pattern: /\bsummer\b/i, color: palette.gold },
    { pattern: /\b(autumn|fall)\b/i, color: palette.rose },
    { pattern: /\b(winter|auroras?|northern lights|snow)\b/i, color: palette.periwinkle },
  ].filter(({ pattern }) => pattern.test(season));
  return matches.length === 1 ? matches[0].color : palette.neutral;
}

// Calendar colours are a northern-hemisphere visual convention, not local weather forecasts.
export function getMonthColor(month: number): string {
  if (!Number.isInteger(month) || month < 1 || month > 12) return palette.neutral;
  if (month >= 3 && month <= 5) return palette.sage;
  if (month >= 6 && month <= 8) return palette.gold;
  if (month >= 9 && month <= 11) return palette.rose;
  return palette.periwinkle;
}
