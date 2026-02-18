<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import type { GroupId } from "./types";
	import { useFirestore } from "./composables/useFirestore";
	import LockButton from "./components/atoms/LockButton.vue";
	import RefreshButton from "./components/atoms/RefreshButton.vue";
	import DashboardView from "./components/organisms/DashboardView.vue";
	import PlayersView from "./components/organisms/PlayersView.vue";

	const {
		groups,
		players,
		lastScrape,
		initializeData,
		subscribeToGroups,
		updatePlayerPaid,
		updatePrizes,
		updateSpecialPrizes,
		updateAutoClassification,
	} = useFirestore();

	const activeTab = ref<"dashboard" | "players">("dashboard");
	const loading = ref(true);

	onMounted(async () => {
		try {
			await initializeData();
			subscribeToGroups();
		} catch (err) {
			console.error("Błąd inicjalizacji:", err);
		} finally {
			loading.value = false;
		}
	});

	function handleUpdatePaid(
		groupId: GroupId,
		playerId: string,
		paidManual: boolean,
	) {
		updatePlayerPaid(groupId, playerId, paidManual);
	}

	function handleUpdatePrizes(
		groupId: GroupId,
		prizes: typeof groups.value.A.prizes,
	) {
		updatePrizes(groupId, prizes);
	}

	function handleUpdateSpecialPrizes(
		groupId: GroupId,
		prizes: typeof groups.value.A.specialPrizes,
	) {
		updateSpecialPrizes(groupId, prizes);
	}

	function handleUpdateAutoClassification(groupId: GroupId, auto: boolean) {
		updateAutoClassification(groupId, auto);
	}
</script>

<template>
	<div class="min-h-screen bg-gray-100">
		<LockButton />

		<!-- Header -->
		<header class="bg-white shadow-sm border-b border-gray-200">
			<div class="max-w-7xl mx-auto px-4 py-4">
				<div
					class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
				>
					<div>
						<h1 class="text-xl font-bold text-gray-900">
							♟ Architektura Szachów
						</h1>
						<p class="text-sm text-gray-500">
							Kalkulator opłacalności turnieju · 20-24.02.2026 · Poznań
						</p>
					</div>
					<RefreshButton :last-scrape="lastScrape" />
				</div>

				<!-- Tabs -->
				<div class="flex gap-1 mt-4">
					<button
						@click="activeTab = 'dashboard'"
						class="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
						:class="
							activeTab === 'dashboard'
								? 'bg-gray-100 text-blue-700 border-b-2 border-blue-600'
								: 'text-gray-500 hover:text-gray-700'
						"
					>
						📊 Kalkulator
					</button>
					<button
						@click="activeTab = 'players'"
						class="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
						:class="
							activeTab === 'players'
								? 'bg-gray-100 text-blue-700 border-b-2 border-blue-600'
								: 'text-gray-500 hover:text-gray-700'
						"
					>
						👥 Zawodnicy
					</button>
				</div>
			</div>
		</header>

		<!-- Content -->
		<main class="max-w-7xl mx-auto px-4 py-6">
			<div v-if="loading" class="flex items-center justify-center py-20">
				<div class="text-gray-500">Ładowanie danych...</div>
			</div>

			<template v-else>
				<DashboardView
					v-if="activeTab === 'dashboard'"
					:groups="groups"
					:players="players"
				/>

				<PlayersView
					v-if="activeTab === 'players'"
					:groups="groups"
					:players="players"
					@update:paid="handleUpdatePaid"
					@update:prizes="handleUpdatePrizes"
					@update:special-prizes="handleUpdateSpecialPrizes"
					@update:auto-classification="handleUpdateAutoClassification"
				/>
			</template>
		</main>
	</div>
</template>
