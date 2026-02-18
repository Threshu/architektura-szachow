<script setup lang="ts">
	import { useScraper } from "../../composables/useScraper";

	defineProps<{
		lastScrape: number | null;
	}>();

	const { scrapeStatus, triggerScrape } = useScraper();

	function formatDate(ts: number | null): string {
		if (!ts) return "nigdy";
		return new Date(ts).toLocaleString("pl-PL");
	}
</script>

<template>
	<div class="flex items-center gap-3">
		<button
			@click="triggerScrape"
			:disabled="scrapeStatus.loading"
			class="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
		>
			<svg
				class="w-4 h-4"
				:class="{ 'animate-spin': scrapeStatus.loading }"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
				/>
			</svg>
			{{ scrapeStatus.loading ? "Odświeżam..." : "Odśwież dane" }}
		</button>
		<span class="text-xs text-gray-500">
			Ostatnia aktualizacja: {{ formatDate(lastScrape) }}
		</span>
		<span v-if="scrapeStatus.error" class="text-xs text-red-500">
			{{ scrapeStatus.error }}
		</span>
		<span
			v-else-if="scrapeStatus.newPlayers > 0 || scrapeStatus.updatedPlayers > 0"
			class="text-xs text-green-600"
		>
			+{{ scrapeStatus.newPlayers }} nowych,
			{{ scrapeStatus.updatedPlayers }} zaktualizowanych
		</span>
	</div>
</template>
