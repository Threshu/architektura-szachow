<script setup lang="ts">
	import type { GroupId, GroupConfig, Player } from "../../types";
	import GroupPanel from "./GroupPanel.vue";

	defineProps<{
		groups: Record<GroupId, GroupConfig>;
		players: Record<GroupId, Player[]>;
	}>();

	const emit = defineEmits<{
		"update:paid": [groupId: GroupId, playerId: string, paidManual: boolean];
		"update:prizes": [groupId: GroupId, prizes: GroupConfig["prizes"]];
		"update:specialPrizes": [
			groupId: GroupId,
			prizes: GroupConfig["specialPrizes"],
		];
		"update:autoClassification": [groupId: GroupId, auto: boolean];
	}>();

	const groupIds: GroupId[] = ["A", "B", "C", "D"];
</script>

<template>
	<div class="space-y-4">
		<GroupPanel
			v-for="gid in groupIds"
			:key="gid"
			:config="groups[gid]"
			:players="players[gid]"
			@update:paid="(playerId, val) => emit('update:paid', gid, playerId, val)"
			@update:prizes="(p) => emit('update:prizes', gid, p)"
			@update:special-prizes="(p) => emit('update:specialPrizes', gid, p)"
			@update:auto-classification="
				(a) => emit('update:autoClassification', gid, a)
			"
		/>
	</div>
</template>
