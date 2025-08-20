import { useCallback, useState } from 'react';

interface UseShareableLinkReturn {
  generateShareableLink: (siteId: string) => string;
  copyShareableLink: (siteId: string) => Promise<boolean>;
  isCopying: boolean;
}

export function useShareableLink(): UseShareableLinkReturn {
  const [isCopying, setIsCopying] = useState(false);

  const generateShareableLink = useCallback((siteId: string): string => {
    if (typeof window === 'undefined') {
      return '';
    }

    const baseUrl = window.location.origin + window.location.pathname;
    const url = new URL(baseUrl);
    url.searchParams.set('site_id', siteId);
    return url.toString();
  }, []);

  const copyShareableLink = useCallback(
    async (siteId: string): Promise<boolean> => {
      if (typeof window === 'undefined' || !navigator.clipboard) {
        return false;
      }

      setIsCopying(true);

      try {
        const shareableLink = generateShareableLink(siteId);
        await navigator.clipboard.writeText(shareableLink);
        return true;
      } catch (err) {
        console.error('Failed to copy link to clipboard:', err);
        return false;
      } finally {
        setIsCopying(false);
      }
    },
    [generateShareableLink],
  );

  return {
    generateShareableLink,
    copyShareableLink,
    isCopying,
  };
}
