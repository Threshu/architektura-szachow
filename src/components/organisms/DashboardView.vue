<script setup lang="ts">
	import { toRef } from "vue";
	import type { GroupConfig, GroupId, Player } from "../../types";
	import { useProfitability } from "../../composables/useProfitability";
	import GroupSummaryCard from "../molecules/GroupSummaryCard.vue";
	import StatusBadge from "../atoms/StatusBadge.vue";

	const props = defineProps<{
		groups: Record<GroupId, GroupConfig>;
		players: Record<GroupId, Player[]>;
	}>();

	const { summaries, totalSummary } = useProfitability(
		toRef(props, "groups"),
		toRef(props, "players"),
	);
</script>

<template>
	<div>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
			<GroupSummaryCard
				v-for="s in summaries"
				:key="s.groupId"
				:group-name="s.groupName"
				:player-count="s.playerCount"
				:paid-count="s.paidCount"
				:student-p-p-count="s.studentPPCount"
				:revenue="s.revenue"
				:pzszach-cost="s.pzszachCost"
				:prizes-total="s.prizesTotal"
				:special-prizes-total="s.specialPrizesTotal"
				:total-costs="s.totalCosts"
				:balance="s.balance"
			/>
		</div>

		<!-- Total summary bar -->
		<div
			class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4"
		>
			<div class="flex items-center gap-6 text-sm">
				<div>
					<span class="text-gray-500">Łącznie zawodników:</span>
					<span class="ml-1 font-bold text-gray-900">{{
						totalSummary.playerCount
					}}</span>
				</div>
				<div>
					<span class="text-gray-500">Opłaconych:</span>
					<span
						class="ml-1 font-bold"
						:class="
							totalSummary.paidCount === totalSummary.playerCount
								? 'text-green-700'
								: 'text-amber-600'
						"
					>
						{{ totalSummary.paidCount }}/{{ totalSummary.playerCount }}
					</span>
				</div>
				<div v-if="totalSummary.studentPPCount > 0">
					<span class="text-purple-500">🎓 Studenci PP:</span>
					<span class="ml-1 font-bold text-purple-700">{{
						totalSummary.studentPPCount
					}}</span>
				</div>
				<div>
					<span class="text-gray-500">Przychód:</span>
					<span class="ml-1 font-bold text-green-700"
						>{{ totalSummary.revenue }} zł</span
					>
				</div>
				<div>
					<span class="text-gray-500">Koszty:</span>
					<span class="ml-1 font-bold text-red-600"
						>{{ totalSummary.totalCosts }} zł</span
					>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-sm font-semibold text-gray-700">BILANS:</span>
				<StatusBadge :amount="totalSummary.balance" />
			</div>
		</div>
	</div>
</template>
