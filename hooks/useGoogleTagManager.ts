import { useEffect } from 'react';
import TagManager from 'react-gtm-module';

const useGoogleTagManager = (trackingCode?: string) => {
  useEffect(() => {
    if (trackingCode) {
      TagManager.initialize({ gtmId: trackingCode });
    }
  }, [trackingCode]);
};

export default useGoogleTagManager;
