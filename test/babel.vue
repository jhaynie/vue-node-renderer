<template>
	<div>{{msg}}</div>
</template>

<script>
import foo from './foo';
export default {
	computed: {
		msg () {
			return foo();
		}
	}
}
</script>
