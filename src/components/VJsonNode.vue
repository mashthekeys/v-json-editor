<template>
  <div class="v-json-node">
    <v-json-type-select
        :can-delete="canDelete"
        :value="type"
        @create="$emit('input', $event)"
        @delete="canDelete && $emit('delete')"
    />

    <template v-if="type === 'string'">
      <v-textarea
          dense
          hide-details
          :rows="String(decoded).replace(/[^\n]/g, '').length + 1"
          style="padding: 0 0 1px 0;"
          :value="decoded"
          @input="$emit('input', JSON.stringify(String($event)))"
      />
    </template>

    <template v-else-if="type === 'number'">
      <v-text-field
          dense
          hide-details
          :rules="[isFinite]"
          :value="trimmed"
          @input="$emit('input', JSON.stringify(Number($event)))"
      />
    </template>

    <template v-else-if="type === 'boolean'">
      <v-checkbox
        dense
        hide-details
        :label="trimmed"
        :input-value="trimmed === 'true'"
        @change="$emit('input', JSON.stringify(Boolean($event)))"
      />
    </template>

    <template v-else-if="type === 'Array'">
      <v-json-node-array
          :color="color"
          :path="path"
          :value="trimmed"
          @input="$emit('input', $event)"
      />
    </template>

    <template v-else-if="type === 'object'">
      <v-json-node-object
          :color="color"
          :path="path"
          :value="trimmed"
          @input="$emit('input', $event)"
      />
    </template>

    <template v-else-if="type === 'null'">
      <var class="v-json-editor--key text--disabled">null</var>
    </template>

    <template v-else>
      <v-json-node-fallback
        :label="path + ' := ' + type"
        :value="trimmed"
        @input="$emit('input', $event)"
    />
    </template>
  </div>
</template>

<script>
import VJsonNodeArray from "./VJsonNodeArray.vue";
import VJsonNodeFallback from "./VJsonNodeFallback.vue";
import VJsonNodeObject from "./VJsonNodeObject.vue";
import VJsonTypeSelect from "./VJsonTypeSelect.vue";

export default {
  name: 'v-json-node',
  components: {VJsonNodeArray, VJsonNodeObject, VJsonNodeFallback, VJsonTypeSelect},

  props: {
    canDelete: Boolean,
    "color": {},
    path: {},
    value: {},
  },

  computed: {
    internal() {
      const json = this.trimmed;

      let value = undefined, valid;
      try {
        value = JSON.parse(json);
        valid = true;
      } catch (error) {
        valid = false;
      }
      return Object.freeze({json, value, valid});
    },

    decoded: {
      lazy: true,
      get() {
        try {
          return JSON.parse(this.trimmed);
        } catch (e) {
          return undefined;
        }
      },
    },

    trimmed() {
      return String(this.value).trim();
    },

    type() {
      const {internal, trimmed} = this;

      const {valid} = internal;

      const firstChar = trimmed.charAt(0);

      if (valid) {
        if (firstChar === '"') {
          return "string";

        } else if (firstChar === '[') {
          return "Array";

        } else if (firstChar === '{') {
          return "object";

        } else if (/[-0-9]/.test(firstChar)) {
          return "number";

        } else if (trimmed === "true" || trimmed === "false") {
          return "boolean";

        } else if (trimmed === "null") {
          return "null";
        }
      }
      return "___invalid___"
    },
  },
}
</script>

<style>
.v-json-node {
  flex: 1 1 100%;
  width: 100%;
  display: flex;
  flex-flow: row;
}

div.v-json-editor--row {
  display: flex;
  flex-flow: row wrap;
}

.v-json-editor--key {
  display: inline-block;
  min-width: 36px;
  height: 36px;
  padding: 6px 0 4px 0;
  text-align: right;
}

</style>
