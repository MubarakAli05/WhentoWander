import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppContent } from './App';

export function renderPage(path: string): string {
  return renderToString(<StaticRouter location={path}><AppContent /></StaticRouter>);
}
