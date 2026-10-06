import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageSeo, renderSeoHead } from '@/data/seo';

export function Seo() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    document.head.querySelectorAll('[data-seo]').forEach(element => element.remove());
    const template = document.createElement('template');
    template.innerHTML = renderSeoHead(getPageSeo(pathname, search));
    document.head.append(template.content);
  }, [pathname, search]);
  return null;
}
