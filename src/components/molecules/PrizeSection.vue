<script setup lang="ts">
	import { computed } from "vue";
	import type { GroupConfig, Player } from "../../types";
	import { useLock } from "../../composables/useLock";
	import PrizeInput from "../atoms/PrizeInput.vue";
	import ToggleSwitch from "../atoms/ToggleSwitch.vue";

	const props = defineProps<{
		config: GroupConfig;
		players: Player[];
	}>();

	const emit = defineEmits<{
		"update:prizes": [prizes: GroupConfig["prizes"]];
		"update:specialPrizes": [prizes: GroupConfig["specialPrizes"]];
		"update:autoClassification": [auto: boolean];
	}>();

	const { isUnlocked } = useLock();

	const CURRENT_YEAR = 2026;

	function countInCategory(category: string): number {
		return props.players.filter((p) => {
			if (p.withdrawn) return false;
			switch (category) {
				case "kobieta":
					return p.isFemale;
				case "u18":
					return p.birthYear !== null && p.birthYear >= CURRENT_YEAR - 18;
				case "u14":
					return p.birthYear !== null && p.birthYear >= CURRENT_YEAR - 14;
				case "u12":
					return p.birthYear !== null && p.birthYear >= CURRENT_YEAR - 12;
				default:
					return false;
			}
		}).length;
	}

	function updatePrizeAmount(index: number, amount: number) {
		const updated = props.config.prizes.map((p, i) =>
			i === index ? { ...p, amount } : p,
		);
		emit("update:prizes", updated);
	}

	function updatePrizeEnabled(index: number, enabled: boolean) {
		const updated = props.config.prizes.map((p, i) =>
			i === index ? { ...p, enabled } : p,
		);
		emit("update:prizes", updated);
	}

	function updateSpecialPrizeAmount(index: number, amount: number) {
		const updated = props.config.specialPrizes.map((p, i) =>
			i === index ? { ...p, amount } : p,
		);
		emit("update:specialPrizes", updated);
	}

	function updateSpecialPrizeEnabled(index: number, enabled: boolean) {
		const updated = props.config.specialPrizes.map((p, i) =>
			i === index ? { ...p, enabled } : p,
		);
		emit("update:specialPrizes", updated);
	}

	const autoClass = computed({
		get: () => props.config.autoClassification,
		set: (val: boolean) => emit("update:autoClassification", val),
	});
</script>

<template>
	<div class="space-y-4">
		<!-- Main prizes -->
		<div>
			<h4 class="text-sm font-semibold text-gray-700 mb-2">Nagrody główne</h4>
			<div class="space-y-2">
				<div
					v-for="(prize, i) in config.prizes"
					:key="prize.place"
					class="flex items-center gap-3"
				>
					<ToggleSwitch
						:model-value="prize.enabled"
						@update:model-value="(val) => updatePrizeEnabled(i, val)"
						:label="prize.place"
						:disabled="!isUnlocked"
					/>
					<PrizeInput
						:model-value="prize.amount"
						@update:model-value="(val) => updatePrizeAmount(i, val)"
						label=""
						suffix="zł"
						:disabled="!isUnlocked"
					/>
				</div>
			</div>
		</div>

		<!-- Special prizes -->
		<div>
			<div class="flex items-center gap-3 mb-2">
				<h4 class="text-sm font-semibold text-gray-700">Nagrody specjalne</h4>
				<ToggleSwitch
					v-model="autoClass"
					label="Auto"
					:disabled="!isUnlocked"
				/>
			</div>
			<div class="space-y-2">
				<div
					v-for="(sp, i) in config.specialPrizes"
					:key="sp.category"
					class="flex items-center gap-3"
				>
					<ToggleSwitch
						:model-value="sp.enabled"
						@update:model-value="(val) => updateSpecialPrizeEnabled(i, val)"
						:label="sp.label"
						:disabled="!isUnlocked"
					/>
					<PrizeInput
						:model-value="sp.amount"
						@update:model-value="(val) => updateSpecialPrizeAmount(i, val)"
						label=""
						suffix="zł"
						:disabled="!isUnlocked"
					/>
					<span
						v-if="config.autoClassification"
						class="text-xs"
						:class="
							countInCategory(sp.category) >= sp.minPlayers
								? 'text-green-600'
								: 'text-red-500'
						"
					>
						{{ countInCategory(sp.category) }}/{{ sp.minPlayers }} os.
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
