<template>
	<div>Hello {{msg}}</div>
</template>

<script>
export default {
	computed: {
		msg () {
			return new Date();
		}
	}
};
</script>
