<template>
	<img :src="img"></img>
</template>

<script>
import circle from './circle.png';
export default {
	computed: {
		img() {
			return circle;
		}
	}
};
</script>
