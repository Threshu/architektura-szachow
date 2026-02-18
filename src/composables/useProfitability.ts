import { computed, type Ref } from 'vue';
import type { GroupConfig, GroupId, Player } from '../types';
import { isPlayerPaid } from '../types';

const CURRENT_YEAR=2026;

export function useProfitability (
  groups: Ref<Record<GroupId, GroupConfig>>,
  players: Ref<Record<GroupId, Player[]>>,
) {
  function getActiveSpecialPrizesTotal (groupId: GroupId): number {
    const config=groups.value[groupId];
    const groupPlayers=players.value[groupId];

    return config.specialPrizes.reduce((sum, sp) => {
      if(!sp.enabled) return sum;

      if(config.autoClassification) {
        const count=countPlayersInCategory(groupPlayers, sp.category);
        if(count<sp.minPlayers) return sum;
      }

      return sum+sp.amount;
    }, 0);
  }

  function countPlayersInCategory (
    groupPlayers: Player[],
    category: 'kobieta'|'u18'|'u14'|'u12',
  ): number {
    return groupPlayers.filter((p) => {
      if(p.withdrawn) return false;
      switch(category) {
        case 'kobieta':
          return p.isFemale;
        case 'u18':
          return p.birthYear!==null&&p.birthYear>=CURRENT_YEAR-18;
        case 'u14':
          return p.birthYear!==null&&p.birthYear>=CURRENT_YEAR-14;
        case 'u12':
          return p.birthYear!==null&&p.birthYear>=CURRENT_YEAR-12;
      }
    }).length;
  }

  function getGroupSummary (groupId: GroupId) {
    const config=groups.value[groupId];
    const groupPlayers=players.value[groupId];
    const playerCount=groupPlayers.length;
    const paidCount=groupPlayers.filter(isPlayerPaid).length;

    const revenue=playerCount*config.entryFee;
    const pzszachCost=playerCount*config.pzszachFee;
    const prizesTotal=config.prizes
      .filter((p) => p.enabled)
      .reduce((sum, p) => sum+p.amount, 0);
    const specialPrizesTotal=getActiveSpecialPrizesTotal(groupId);
    const totalCosts=pzszachCost+prizesTotal+specialPrizesTotal;
    const balance=revenue-totalCosts;

    return {
      groupId,
      groupName: config.name,
      playerCount,
      paidCount,
      revenue,
      pzszachCost,
      prizesTotal,
      specialPrizesTotal,
      totalCosts,
      balance,
    };
  }

  const summaries=computed(() => {
    const groupIds: GroupId[]=['A', 'B', 'C', 'D'];
    return groupIds.map(getGroupSummary);
  });

  const totalSummary=computed(() => {
    return summaries.value.reduce(
      (acc, s) => ({
        playerCount: acc.playerCount+s.playerCount,
        paidCount: acc.paidCount+s.paidCount,
        revenue: acc.revenue+s.revenue,
        totalCosts: acc.totalCosts+s.totalCosts,
        balance: acc.balance+s.balance,
      }),
      { playerCount: 0, paidCount: 0, revenue: 0, totalCosts: 0, balance: 0 },
    );
  });

  return {
    summaries,
    totalSummary,
    getGroupSummary,
    countPlayersInCategory,
  };
}
