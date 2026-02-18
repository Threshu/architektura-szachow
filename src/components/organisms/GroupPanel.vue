<script setup lang="ts">
	import { ref, computed } from "vue";
	import type { GroupConfig, Player } from "../../types";
	import { isPlayerPaid } from "../../types";
	import GroupHeader from "../molecules/GroupHeader.vue";
	import PlayerRow from "../molecules/PlayerRow.vue";
	import PrizeSection from "../molecules/PrizeSection.vue";

	const props = defineProps<{
		config: GroupConfig;
		players: Player[];
	}>();

	const emit = defineEmits<{
		"update:paid": [playerId: string, paidManual: boolean];
		"update:prizes": [prizes: GroupConfig["prizes"]];
		"update:specialPrizes": [prizes: GroupConfig["specialPrizes"]];
		"update:autoClassification": [auto: boolean];
	}>();

	const expanded = ref(false);
	const showPrizes = ref(false);

	const paidCount = computed(() => props.players.filter(isPlayerPaid).length);
</script>

<template>
	<div
		class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
	>
		<GroupHeader
			:name="config.name"
			:player-count="players.length"
			:paid-count="paidCount"
			@toggle-expand="expanded = !expanded"
		/>

		<div v-if="expanded" class="p-3">
			<!-- Players table -->
			<div class="overflow-x-auto">
				<table class="w-full text-left">
					<thead>
						<tr class="border-b-2 border-gray-200">
							<th class="px-2 py-1.5 text-xs font-semibold text-gray-500 w-8">
								#
							</th>
							<th class="px-2 py-1.5 text-xs font-semibold text-gray-500">
								Nazwisko, Imię
							</th>
							<th
								class="px-2 py-1.5 text-xs font-semibold text-gray-500 hidden sm:table-cell"
							>
								Klub
							</th>
							<th
								class="px-2 py-1.5 text-xs font-semibold text-gray-500 text-center"
							>
								Ranking
							</th>
							<th
								class="px-2 py-1.5 text-xs font-semibold text-gray-500 text-center hidden md:table-cell"
							>
								Rok ur.
							</th>
							<th
								class="px-2 py-1.5 text-xs font-semibold text-gray-500 text-center hidden md:table-cell"
							>
								Kat.
							</th>
							<th
								class="px-2 py-1.5 text-xs font-semibold text-gray-500 text-center"
							>
								Opł.
							</th>
						</tr>
					</thead>
					<tbody>
						<PlayerRow
							v-for="(player, i) in players"
							:key="player.id"
							:player="player"
							:index="i + 1"
							@update:paid="(id, val) => emit('update:paid', id, val)"
						/>
					</tbody>
				</table>
			</div>

			<!-- Prizes toggle -->
			<div class="mt-3 border-t border-gray-200 pt-3">
				<button
					@click="showPrizes = !showPrizes"
					class="text-sm text-blue-600 hover:text-blue-800 font-medium"
				>
					{{ showPrizes ? "▼ Ukryj nagrody" : "▶ Pokaż nagrody" }}
				</button>

				<div v-if="showPrizes" class="mt-3">
					<PrizeSection
						:config="config"
						:players="players"
						@update:prizes="(p) => emit('update:prizes', p)"
						@update:special-prizes="(p) => emit('update:specialPrizes', p)"
						@update:auto-classification="
							(a) => emit('update:autoClassification', a)
						"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
