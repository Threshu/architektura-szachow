import { logger } from "firebase-functions";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

admin.initializeApp();
const db=admin.firestore();

// Lazy-loaded modules to avoid deployment timeout
let axiosModule: typeof import("axios")|null=null;
let cheerioModule: typeof import("cheerio")|null=null;

async function getAxios () {
  if(!axiosModule) axiosModule=await import("axios");
  return axiosModule.default;
}

async function getCheerio () {
  if(!cheerioModule) cheerioModule=await import("cheerio");
  return cheerioModule;
}

// ChessManager tournament URLs
const TOURNAMENTS: Record<string, string>={
  A: "https://www.chessmanager.com/pl-pl/tournaments/6526075911536640/players",
  B: "https://www.chessmanager.com/pl-pl/tournaments/5529562498465792/players",
  C: "https://www.chessmanager.com/pl-pl/tournaments/5194736444637184/players",
  D: "https://www.chessmanager.com/pl-pl/tournaments/5478942634672128/players",
};

// Female name detection
const FEMALE_NAMES=[
  "Dominika", "Aleksandra", "Weronika", "Lena", "Jagoda", "Maja",
  "Anna", "Maria", "Katarzyna", "Agnieszka", "Zofia", "Julia",
  "Natalia", "Karolina", "Joanna", "Magdalena", "Monika", "Ewa",
  "Oliwia", "Zuzanna", "Hanna", "Alicja", "Amelia", "Liliana",
  "Olga", "Nina", "Wiktoria", "Emilia", "Antonina", "Klara",
  "Zuzanna",
];

function detectFemale (fullName: string): boolean {
  const firstName=fullName.includes(",")
    ? fullName.split(",")[1]?.trim()
    :fullName.split(" ")[0]?.trim();
  return FEMALE_NAMES.some((fn) => firstName?.startsWith(fn));
}

interface ScrapedPlayer {
  id: string;
  name: string;
  club: string;
  ranking: number;
  birthYear: number|null;
  category: string;
  isFemale: boolean;
  paidCM: boolean;
}

async function scrapeGroup (groupId: string, url: string): Promise<ScrapedPlayer[]> {
  const axios=await getAxios();
  const cheerio=await getCheerio();

  const response=await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.8",
    },
    timeout: 15000,
  });

  const $=cheerio.load(response.data);
  const players: ScrapedPlayer[]=[];
  let playerIndex=0;

  // ChessManager uses table rows for player list
  // Try multiple selectors to find the right table
  const rows=$("table tbody tr").length>0
    ? $("table tbody tr")
    :$("tr").filter((_i: number, el: any) => {
      const tds=$(el).find("td");
      return tds.length>=4;
    });

  rows.each((_i: number, el: any) => {
    const cells=$(el).find("td");
    if(cells.length<4) return;

    const cellTexts: string[]=[];
    cells.each((_ci: number, cell: any) => {
      cellTexts.push($(cell).text().trim());
    });

    // Find name: cell containing a comma (Lastname, Firstname format)
    let name="";
    let nameIdx=-1;
    for(let i=0; i<cellTexts.length; i++) {
      const t=cellTexts[i];
      if(t.includes(",")&&t.length>3&&!t.match(/^\d/)) {
        name=t;
        nameIdx=i;
        break;
      }
    }

    if(!name) return;

    // Payment: check for checkmark icons in the row HTML
    const rowHtml=$(el).html()||"";
    const paidCM=rowHtml.includes("check")||rowHtml.includes("✓")||
      rowHtml.includes("✔")||rowHtml.includes("fa-check")||
      rowHtml.includes("icon-check")||rowHtml.includes("text-success");

    // Extract ranking and birth year from numeric cells
    let ranking=0;
    let birthYear: number|null=null;
    let category="";
    let club="";

    for(let i=0; i<cellTexts.length; i++) {
      if(i===nameIdx) continue;
      const text=cellTexts[i];

      // Ranking: 3-4 digit number (typically 1000-2800)
      const rankMatch=text.match(/^(\d{3,4})$/);
      if(rankMatch&&!ranking) {
        const num=parseInt(rankMatch[1]);
        if(num>=800&&num<=2900) {
          ranking=num;
          continue;
        }
      }

      // Birth year: 4 digit year (1940-2025)
      const yearMatch=text.match(/^(19[4-9]\d|20[0-2]\d)$/);
      if(yearMatch&&birthYear===null) {
        birthYear=parseInt(yearMatch[1]);
        continue;
      }

      // Category: chess titles or Roman numerals
      if(/^(FM|CM|IM|GM|WFM|WCM|WIM|WGM|k|I\+?|II\+?|III|IV|V)$/i.test(text)&&!category) {
        category=text;
        continue;
      }
    }

    // Club: look for longer text that's not name/ranking/year/category/number
    for(let i=0; i<cellTexts.length; i++) {
      if(i===nameIdx) continue;
      const text=cellTexts[i];
      if(text===String(ranking)||text===String(birthYear)||
        text===category||text.length<3||/^\d+\.?$/.test(text)) continue;
      if(!text.match(/^(FM|CM|IM|GM|WFM|WCM|WIM|WGM|k|I\+?|II\+?|III|IV|V)$/i)) {
        club=text;
        break;
      }
    }

    playerIndex++;
    const id=`${groupId.toLowerCase()}${String(playerIndex).padStart(2, "0")}`;
    players.push({
      id,
      name,
      club,
      ranking,
      birthYear,
      category,
      isFemale: detectFemale(name),
      paidCM,
    });
  });

  logger.info(`Group ${groupId}: scraped ${players.length} players from ${url}`);
  return players;
}

async function doScrape (): Promise<{ newPlayers: number; updatedPlayers: number; timestamp: number; }> {
  let totalNew=0;
  let totalUpdated=0;

  for(const [groupId, url] of Object.entries(TOURNAMENTS)) {
    try {
      const scrapedPlayers=await scrapeGroup(groupId, url);
      const playersCol=db.collection("groups").doc(groupId).collection("players");

      // Get existing players — use array to handle duplicate names
      const existing=await playersCol.get();
      const existingByName=new Map<string, Array<{ id: string;[key: string]: unknown; }>>();
      existing.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
        const data=doc.data();
        const name=data.name as string;
        if(!existingByName.has(name)) {
          existingByName.set(name, []);
        }
        existingByName.get(name)!.push({ id: doc.id, ...data });
      });

      // Track existing document IDs to avoid collisions
      const existingDocIds=new Set<string>();
      existing.forEach((doc: admin.firestore.QueryDocumentSnapshot) => {
        existingDocIds.add(doc.id);
      });

      // Track which players we found in scrape
      const scrapedNames=new Map<string, number>(); // name → count seen

      // Use batch writes for performance (max 500 ops per batch)
      let batch=db.batch();
      let opCount=0;

      for(const sp of scrapedPlayers) {
        const seenCount=scrapedNames.get(sp.name)||0;
        scrapedNames.set(sp.name, seenCount+1);
        const existingEntries=existingByName.get(sp.name)||[];
        const existingPlayer=existingEntries[seenCount]; // match Nth occurrence

        if(existingPlayer) {
          // Update existing player - DON'T touch paidManual, studentPP
          const ref=playersCol.doc(existingPlayer.id as string);
          batch.update(ref, {
            ranking: sp.ranking,
            club: sp.club,
            category: sp.category,
            birthYear: sp.birthYear,
            isFemale: sp.isFemale,
            paidCM: sp.paidCM,
            withdrawn: false,
          });
          totalUpdated++;
        } else {
          // New player — use auto-generated ID to avoid collisions
          // with existing documents when player order changes
          let newId=sp.id;
          if(existingDocIds.has(newId)) {
            // ID collision: generate a unique ID instead
            newId=playersCol.doc().id;
          }
          existingDocIds.add(newId);
          const ref=playersCol.doc(newId);
          batch.set(ref, {
            ...sp,
            id: newId,
            paidManual: false,
            studentPP: false,
            withdrawn: false,
          });
          totalNew++;
        }

        opCount++;
        if(opCount>=450) {
          await batch.commit();
          batch=db.batch();
          opCount=0;
        }
      }

      // Mark players not found in scrape as withdrawn
      for(const [name, entries] of existingByName) {
        const scrapedCount=scrapedNames.get(name)||0;
        // If we scraped fewer occurrences than exist, withdraw the extras
        for(let idx=scrapedCount; idx<entries.length; idx++) {
          const data=entries[idx];
          if(!data.withdrawn) {
            const ref=playersCol.doc(data.id as string);
            batch.update(ref, { withdrawn: true });
            opCount++;
            if(opCount>=450) {
              await batch.commit();
              batch=db.batch();
              opCount=0;
            }
          }
        }
        // Also withdraw all if name not found at all
        if(scrapedCount===0) {
          for(const data of entries) {
            if(!data.withdrawn) {
              const ref=playersCol.doc(data.id as string);
              batch.update(ref, { withdrawn: true });
              opCount++;
              if(opCount>=450) {
                await batch.commit();
                batch=db.batch();
                opCount=0;
              }
            }
          }
        }
      }

      // Commit remaining ops
      if(opCount>0) {
        await batch.commit();
      }
    } catch(err) {
      logger.error(`Error scraping group ${groupId}:`, err);
    }
  }

  const timestamp=Date.now();
  await db.doc("meta/lastScrape").set({ timestamp });

  return { newPlayers: totalNew, updatedPlayers: totalUpdated, timestamp };
}

// Scheduled scrape: every 6 hours
export const scheduledScrape=onSchedule(
  { schedule: "every 6 hours", region: "europe-west1", timeoutSeconds: 300, memory: "512MiB" },
  async () => {
    const result=await doScrape();
    logger.info("Scheduled scrape completed:", result);
  },
);

// Callable scrape: triggered manually from frontend
export const scrapePlayers=onCall(
  { region: "europe-west1", timeoutSeconds: 300, memory: "512MiB" },
  async () => {
    const result=await doScrape();
    return result;
  },
);
