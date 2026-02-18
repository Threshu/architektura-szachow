<script setup lang="ts">
	import { computed } from "vue";

	const props = defineProps<{
		paidCM: boolean;
		paidManual: boolean;
		disabled?: boolean;
	}>();

	const emit = defineEmits<{
		"update:paidManual": [value: boolean];
	}>();

	const isPaid = computed(() => props.paidCM || props.paidManual);

	function toggle() {
		if (props.disabled) return;
		// If CM already paid, do nothing
		if (props.paidCM) return;
		emit("update:paidManual", !props.paidManual);
	}
</script>

<template>
	<div class="flex items-center gap-1">
		<button
			type="button"
			@click="toggle"
			:disabled="disabled || paidCM"
			class="w-6 h-6 rounded border-2 flex items-center justify-center transition-colors text-sm"
			:class="{
				'bg-green-500 border-green-500 text-white': isPaid,
				'border-gray-300 hover:border-gray-400': !isPaid && !disabled,
				'border-gray-200 cursor-not-allowed': disabled && !isPaid,
				'cursor-not-allowed': paidCM,
			}"
			:title="
				paidCM
					? 'Opłacone (ChessManager)'
					: paidManual
						? 'Opłacone (ręcznie)'
						: 'Nieopłacone'
			"
		>
			<span v-if="isPaid">✓</span>
		</button>
		<span
			v-if="paidCM"
			class="text-xs text-green-600"
			title="Status z ChessManager"
			>CM</span
		>
		<span
			v-else-if="paidManual"
			class="text-xs text-blue-600"
			title="Odhaczone ręcznie"
			>R</span
		>
	</div>
</template>
