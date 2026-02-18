<script setup lang="ts">
	defineProps<{
		paid: number;
		total: number;
	}>();
</script>

<template>
	<span
		class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full"
		:class="
			paid === total
				? 'bg-green-100 text-green-800'
				: 'bg-amber-100 text-amber-800'
		"
	>
		<span>{{ paid }}/{{ total }}</span>
		<span>zapłaciło</span>
	</span>
</template>
