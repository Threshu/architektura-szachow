<script setup lang="ts">
	const model = defineModel<boolean>({ required: true });

	defineProps<{
		label: string;
		disabled?: boolean;
	}>();
</script>

<template>
	<label
		class="inline-flex items-center gap-2 cursor-pointer"
		:class="{ 'opacity-50 cursor-not-allowed': disabled }"
	>
		<button
			type="button"
			role="switch"
			:aria-checked="model"
			:disabled="disabled"
			@click="!disabled && (model = !model)"
			class="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			:class="model ? 'bg-blue-600' : 'bg-gray-300'"
		>
			<span
				class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
				:class="model ? 'translate-x-4' : 'translate-x-0'"
			/>
		</button>
		<span class="text-sm text-gray-700">{{ label }}</span>
	</label>
</template>
