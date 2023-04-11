<template>
  <v-card :elevation="0" width="100%">
    <v-textarea
        hide-details
        label="Invalid JSON"
        v-model="internalValue"
    />
    <v-card-actions>
      <v-btn
        @click="$emit('input', internalValue)"
      >
        Update
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'v-json-node-fallback',
  props: {
    value: {}
  },

  data() {
    return {
      internalValue: this.value,
    };
  },

  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(value) {
        if (value) {
          this.internalValue = value;
        }
      },
    },
  },
}
</script>
