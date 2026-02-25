<script setup lang="ts">
	import StatusBadge from "../atoms/StatusBadge.vue";

	defineProps<{
		groupName: string;
		playerCount: number;
		paidCount: number;
		studentPPCount: number;
		revenue: number;
		pzszachCost: number;
		prizesTotal: number;
		specialPrizesTotal: number;
		totalCosts: number;
		balance: number;
	}>();
</script>

<template>
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
		<div class="flex items-center justify-between mb-3">
			<h3 class="text-sm font-bold text-gray-800">{{ groupName }}</h3>
			<StatusBadge :amount="balance" />
		</div>

		<div class="space-y-1 text-sm">
			<div class="flex justify-between text-gray-600">
				<span>Zawodnicy</span>
				<span class="font-medium"
					>{{ playerCount }} ({{ paidCount }} opł.)</span
				>
			</div>
			<div
				v-if="studentPPCount > 0"
				class="flex justify-between text-purple-600"
			>
				<span>🎓 Studenci PP</span>
				<span class="font-medium">{{ studentPPCount }} (zwolnieni)</span>
			</div>
			<div class="flex justify-between text-green-700">
				<span>Przychód (wpisowe)</span>
				<span class="font-medium">{{ revenue }} zł</span>
			</div>
			<div class="border-t border-gray-100 my-1"></div>
			<div v-if="pzszachCost > 0" class="flex justify-between text-red-600">
				<span>Opłata PZSzach</span>
				<span class="font-medium">-{{ pzszachCost }} zł</span>
			</div>
			<div class="flex justify-between text-red-600">
				<span>Nagrody główne</span>
				<span class="font-medium">-{{ prizesTotal }} zł</span>
			</div>
			<div
				v-if="specialPrizesTotal > 0"
				class="flex justify-between text-red-600"
			>
				<span>Nagrody specjalne</span>
				<span class="font-medium">-{{ specialPrizesTotal }} zł</span>
			</div>
			<div class="border-t border-gray-200 my-1"></div>
			<div
				class="flex justify-between font-bold"
				:class="balance >= 0 ? 'text-green-700' : 'text-red-700'"
			>
				<span>Bilans</span>
				<span>{{ balance >= 0 ? "+" : "" }}{{ balance }} zł</span>
			</div>
		</div>
	</div>
</template>
