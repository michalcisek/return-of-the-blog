export type Lang = 'en' | 'pl';

export function getLangFromUrl(pathname: string): Lang {
  return pathname.startsWith('/pl/') || pathname === '/pl' ? 'pl' : 'en';
}

export function getAlternateUrl(pathname: string): string {
  if (pathname.startsWith('/pl/')) {
    return pathname.slice(3) || '/';
  }
  if (pathname === '/pl') {
    return '/';
  }
  return '/pl' + pathname;
}

export function getPostBaseSlug(postId: string): string {
  return postId.replace(/\/pl$/, '');
}
