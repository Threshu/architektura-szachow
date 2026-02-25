<script setup lang="ts">
	import type { Player } from "../../types";
	import { useLock } from "../../composables/useLock";
	import PlayerCheckbox from "../atoms/PlayerCheckbox.vue";

	defineProps<{
		player: Player;
		index: number;
	}>();

	const emit = defineEmits<{
		"update:paid": [playerId: string, paidManual: boolean];
		"update:studentPP": [playerId: string, studentPP: boolean];
	}>();

	const { isUnlocked } = useLock();
</script>

<template>
	<tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
		<td class="px-2 py-1.5 text-sm text-gray-500 text-center">{{ index }}</td>
		<td class="px-2 py-1.5 text-sm font-medium text-gray-900">
			{{ player.name }}
		</td>
		<td class="px-2 py-1.5 text-sm text-gray-600 hidden sm:table-cell">
			{{ player.club || "—" }}
		</td>
		<td class="px-2 py-1.5 text-sm text-gray-600 text-center">
			{{ player.ranking }}
		</td>
		<td
			class="px-2 py-1.5 text-sm text-gray-600 text-center hidden md:table-cell"
		>
			{{ player.birthYear ?? "—" }}
		</td>
		<td
			class="px-2 py-1.5 text-sm text-gray-600 text-center hidden md:table-cell"
		>
			{{ player.category || "—" }}
		</td>
		<td class="px-2 py-1.5 text-center">
			<button
				type="button"
				@click="
					isUnlocked && emit('update:studentPP', player.id, !player.studentPP)
				"
				:disabled="!isUnlocked"
				class="w-6 h-6 rounded border-2 flex items-center justify-center transition-colors text-[10px] font-bold mx-auto"
				:class="{
					'bg-purple-500 border-purple-500 text-white': player.studentPP,
					'border-gray-300 hover:border-purple-400':
						!player.studentPP && isUnlocked,
					'border-gray-200 cursor-not-allowed':
						!isUnlocked && !player.studentPP,
				}"
				:title="
					player.studentPP
						? 'Student PP (zwolniony z opłaty)'
						: 'Oznacz jako studenta PP'
				"
			>
				<span v-if="player.studentPP">PP</span>
			</button>
		</td>
		<td class="px-2 py-1.5 text-center">
			<PlayerCheckbox
				:paid-c-m="player.paidCM"
				:paid-manual="player.paidManual"
				:disabled="!isUnlocked || player.studentPP"
				@update:paid-manual="(val) => emit('update:paid', player.id, val)"
			/>
			<span
				v-if="player.studentPP"
				class="text-[10px] text-purple-600 block"
				title="Student PP — zwolniony z opłaty"
				>zwolniony</span
			>
		</td>
	</tr>
</template>
