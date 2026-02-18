<script setup lang="ts">
	import CounterBadge from "../atoms/CounterBadge.vue";

	defineProps<{
		name: string;
		playerCount: number;
		paidCount: number;
	}>();

	const emit = defineEmits<{
		toggleExpand: [];
	}>();
</script>

<template>
	<div
		class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
		@click="emit('toggleExpand')"
	>
		<div class="flex items-center gap-3">
			<h3 class="text-base font-bold text-gray-800">{{ name }}</h3>
			<span class="text-sm text-gray-500">{{ playerCount }} zawodników</span>
		</div>
		<CounterBadge :paid="paidCount" :total="playerCount" />
	</div>
</template>
