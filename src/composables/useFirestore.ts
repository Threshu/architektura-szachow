import { ref, onUnmounted } from 'vue';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Player, GroupConfig, GroupId } from '../types';
import { defaultGroupConfigs } from '../data/players';

const groups=ref<Record<GroupId, GroupConfig>>({ ...defaultGroupConfigs });
const players=ref<Record<GroupId, Player[]>>({
  A: [],
  B: [],
  C: [],
  D: [],
});
const lastScrape=ref<number|null>(null);
const initialized=ref(false);

const unsubs: Unsubscribe[]=[];

export function useFirestore () {
  async function initializeData () {
    if(initialized.value) return;

    let needsScrape=false;
    const groupIds: GroupId[]=['A', 'B', 'C', 'D'];

    for(const gid of groupIds) {
      const groupRef=doc(db, 'groups', gid);
      const groupSnap=await getDoc(groupRef);

      if(!groupSnap.exists()) {
        // Seed group config only – players come from scraper
        await setDoc(groupRef, {
          id: defaultGroupConfigs[gid].id,
          name: defaultGroupConfigs[gid].name,
          entryFee: defaultGroupConfigs[gid].entryFee,
          pzszachFee: defaultGroupConfigs[gid].pzszachFee,
          prizes: defaultGroupConfigs[gid].prizes,
          specialPrizes: defaultGroupConfigs[gid].specialPrizes,
          autoClassification: defaultGroupConfigs[gid].autoClassification,
        });
        needsScrape=true;
      } else {
        // Check if group has any players
        const playersCol=collection(db, 'groups', gid, 'players');
        const playersSnap=await getDocs(playersCol);
        if(playersSnap.empty) needsScrape=true;
      }
    }

    // Seed meta
    const metaRef=doc(db, 'meta', 'lastScrape');
    const metaSnap=await getDoc(metaRef);
    if(!metaSnap.exists()) {
      await setDoc(metaRef, { timestamp: null });
    }

    initialized.value=true;
    return needsScrape;
  }

  function subscribeToGroups () {
    const groupIds: GroupId[]=['A', 'B', 'C', 'D'];

    for(const gid of groupIds) {
      // Subscribe to group config
      const groupUnsub=onSnapshot(doc(db, 'groups', gid), (snap) => {
        if(snap.exists()) {
          groups.value[gid]=snap.data() as GroupConfig;
        }
      });
      unsubs.push(groupUnsub);

      // Subscribe to players
      const playersUnsub=onSnapshot(
        collection(db, 'groups', gid, 'players'),
        (snap) => {
          players.value[gid]=snap.docs.map((d) => d.data() as Player)
            .filter(p => !p.withdrawn)
            .sort((a, b) => b.ranking-a.ranking);
        },
      );
      unsubs.push(playersUnsub);
    }

    // Subscribe to scrape status
    const metaUnsub=onSnapshot(doc(db, 'meta', 'lastScrape'), (snap) => {
      if(snap.exists()) {
        lastScrape.value=snap.data().timestamp;
      }
    });
    unsubs.push(metaUnsub);
  }

  function unsubscribeAll () {
    unsubs.forEach((u) => u());
    unsubs.length=0;
  }

  async function updatePlayerPaid (groupId: GroupId, playerId: string, paidManual: boolean) {
    const playerRef=doc(db, 'groups', groupId, 'players', playerId);
    await updateDoc(playerRef, { paidManual });
  }

  async function updatePlayerStudentPP (groupId: GroupId, playerId: string, studentPP: boolean) {
    const playerRef=doc(db, 'groups', groupId, 'players', playerId);
    await updateDoc(playerRef, { studentPP });
  }

  async function updateGroupConfig (groupId: GroupId, updates: Partial<GroupConfig>) {
    const groupRef=doc(db, 'groups', groupId);
    await updateDoc(groupRef, updates as Record<string, unknown>);
  }

  async function updatePrizes (groupId: GroupId, prizes: GroupConfig['prizes']) {
    const groupRef=doc(db, 'groups', groupId);
    await updateDoc(groupRef, { prizes });
  }

  async function updateSpecialPrizes (groupId: GroupId, specialPrizes: GroupConfig['specialPrizes']) {
    const groupRef=doc(db, 'groups', groupId);
    await updateDoc(groupRef, { specialPrizes });
  }

  async function updateAutoClassification (groupId: GroupId, auto: boolean) {
    const groupRef=doc(db, 'groups', groupId);
    await updateDoc(groupRef, { autoClassification: auto });
  }

  onUnmounted(() => {
    unsubscribeAll();
  });

  return {
    groups,
    players,
    lastScrape,
    initialized,
    initializeData,
    subscribeToGroups,
    unsubscribeAll,
    updatePlayerPaid,
    updatePlayerStudentPP,
    updateGroupConfig,
    updatePrizes,
    updateSpecialPrizes,
    updateAutoClassification,
  };
}
