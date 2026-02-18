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
			<PlayerCheckbox
				:paid-c-m="player.paidCM"
				:paid-manual="player.paidManual"
				:disabled="!isUnlocked"
				@update:paid-manual="(val) => emit('update:paid', player.id, val)"
			/>
		</td>
	</tr>
</template>
