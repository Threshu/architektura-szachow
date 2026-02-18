<script setup lang="ts">
	const model = defineModel<number>({ required: true });

	defineProps<{
		label: string;
		disabled?: boolean;
		suffix?: string;
	}>();
</script>

<template>
	<div class="flex items-center gap-2">
		<label class="text-sm text-gray-600 whitespace-nowrap">{{ label }}</label>
		<div class="relative">
			<input
				type="number"
				:value="model"
				@input="model = Number(($event.target as HTMLInputElement).value)"
				:disabled="disabled"
				min="0"
				class="w-24 px-2 py-1 text-sm border rounded-md text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
			/>
			<span
				v-if="suffix"
				class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none"
			>
				{{ suffix }}
			</span>
		</div>
	</div>
</template>
