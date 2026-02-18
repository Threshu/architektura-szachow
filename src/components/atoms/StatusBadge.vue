<script setup lang="ts">
	defineProps<{
		amount: number;
		label?: string;
	}>();
</script>

<template>
	<span
		class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
		:class="
			amount >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
		"
	>
		<span v-if="label" class="mr-1">{{ label }}</span>
		{{ amount >= 0 ? "+" : "" }}{{ amount }} zł
	</span>
</template>
