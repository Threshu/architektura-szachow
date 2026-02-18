<script setup lang="ts">
	import { ref } from "vue";
	import { useLock } from "../../composables/useLock";

	const { isUnlocked, unlock, lock } = useLock();
	const showModal = ref(false);
	const password = ref("");
	const error = ref(false);

	function handleClick() {
		if (isUnlocked.value) {
			lock();
		} else {
			showModal.value = true;
			password.value = "";
			error.value = false;
		}
	}

	function handleSubmit() {
		if (unlock(password.value)) {
			showModal.value = false;
			error.value = false;
		} else {
			error.value = true;
		}
	}

	function handleCancel() {
		showModal.value = false;
		error.value = false;
	}
</script>

<template>
	<button
		@click="handleClick"
		class="fixed top-4 right-4 z-50 p-2 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors text-2xl"
		:title="isUnlocked ? 'Zablokuj edycję' : 'Odblokuj edycję'"
	>
		{{ isUnlocked ? "🔓" : "🔒" }}
	</button>

	<Teleport to="body">
		<div
			v-if="showModal"
			class="fixed inset-0 z-100 flex items-center justify-center bg-black/50"
			@click.self="handleCancel"
		>
			<div class="bg-white rounded-xl shadow-2xl p-6 w-80 mx-4">
				<h3 class="text-lg font-semibold text-gray-800 mb-4">Podaj hasło</h3>
				<form @submit.prevent="handleSubmit">
					<input
						v-model="password"
						type="password"
						placeholder="Hasło..."
						autofocus
						class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						:class="{ 'border-red-500': error }"
					/>
					<p v-if="error" class="text-red-500 text-sm mt-1">
						Nieprawidłowe hasło
					</p>
					<div class="flex gap-2 mt-4">
						<button
							type="button"
							@click="handleCancel"
							class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
						>
							Anuluj
						</button>
						<button
							type="submit"
							class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Odblokuj
						</button>
					</div>
				</form>
			</div>
		</div>
	</Teleport>
</template>
