<template>
  <div class="v-json-editor v-input v-text-field v-input--is-label-active v-input--is-dirty" :class="themeClass">
    <div class="v-input__control">
      <div class="v-input__slot">
        <v-label absolute :value="true" style="min-width: 100%; position:absolute;">{{label}}</v-label>

        <v-json-node
            path="$"
            :value="value"
            @input="$emit('input', $event)"
        />
      </div>

      <div class="v-messages" :class="themeClass"><div class="v-messages__wrapper"></div></div>
    </div>
  </div>
</template>

<script>
import {VLabel} from "vuetify/lib/components";
import VJsonNode from "./VJsonNode.vue";
import VJsonNodeFallback from "./VJsonNodeFallback.vue";

export default {
  name: "v-json-editor",

  components: {VJsonNodeFallback, VJsonNode, "v-label": VLabel},

  props: ["label", "value"],

  computed: {
    themeClass() {
      return this.$vuetify.theme.dark ? "theme--dark" : "theme--light";
    },
  },
}
</script>

<style>
.v-json-editor .v-input {
  font-family: monospace;
}
</style>