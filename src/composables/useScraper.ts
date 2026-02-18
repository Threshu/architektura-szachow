import { ref } from 'vue';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import type { ScrapeStatus } from '../types';

export function useScraper () {
  const scrapeStatus=ref<ScrapeStatus>({
    timestamp: null,
    loading: false,
    error: null,
    newPlayers: 0,
    updatedPlayers: 0,
  });

  async function triggerScrape () {
    scrapeStatus.value.loading=true;
    scrapeStatus.value.error=null;

    try {
      const scrapePlayersCallable=httpsCallable(functions, 'scrapePlayers');
      const result=await scrapePlayersCallable();
      const data=result.data as {
        newPlayers: number;
        updatedPlayers: number;
        timestamp: number;
      };
      scrapeStatus.value.newPlayers=data.newPlayers;
      scrapeStatus.value.updatedPlayers=data.updatedPlayers;
      scrapeStatus.value.timestamp=data.timestamp;
    } catch(err: unknown) {
      scrapeStatus.value.error=err instanceof Error? err.message:'Błąd scrapowania';
    } finally {
      scrapeStatus.value.loading=false;
    }
  }

  return { scrapeStatus, triggerScrape };
}
