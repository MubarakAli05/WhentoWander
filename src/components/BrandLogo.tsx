interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = 'h-6 w-6' }: BrandLogoProps) {
  return <img src="/brand-mark.svg" alt="" aria-hidden="true" width={24} height={24} className={`shrink-0 ${className}`} />;
}
