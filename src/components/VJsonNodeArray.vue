<template>
  <v-card :elevation="elevation" width="100%" :color="color">
    <template v-for="(node, index) in nodes">
      <div class="v-json-editor--row" :key="index">

        <var class="v-json-editor--key text--disabled">{{node.key}}:</var>

        <v-json-node
            can-delete
            :color="color"
            :path="node.path"
            :value="node.value"
            style="flex: 1 0.25 50%"
            @input="setValue(index, $event)"
            @delete="deleteIndex(index)"
        />

      </div>
    </template>

    <div class="v-json-editor--row" :key="'create'"
          style="position:relative;"
          :style="{left: nodes.length ? '-36px' : 0}"
    >
      <v-json-type-select
          close-button
          value="Array"
          @create="appendValue"
      />
    </div>
  </v-card>
</template>

<script>
import VJsonTypeSelect from "./VJsonTypeSelect.vue";

export default {
  name: 'v-json-node-array',
  components: {
    // Dynamic dependency to avoid circular import
    VJsonNode: () => import("./VJsonNode.vue"),
    VJsonTypeSelect,
  },

  props: {
    "color": {},
    "path": {},
    "value": {},
  },

  data() {
    return {
      lastOutput: this.value,
    };
  },

  computed: {
    elevation() {
      return this.path.replace(/[^.]/g, "").length;
    },

    decoded() {
      const {value} = this;

      let array;

      try {
        array = JSON.parse(value);
      } catch (ignored) {
      }

      if (Array.isArray(array)) return array;

      return null;
    },

    nodes() {
      const {decoded, path} = this;

      if (decoded == null) return [];

      return decoded.map((value, index) => {
        return {
          key: index,
          path: `${path}[${index}]`,
          value: JSON.stringify(value),
        };
      });
    },

    output() {
      // console.log("v-json-node-array.output");
      return `[${this.nodes.map(
          ({value}) => value
      ).join(",")}]`
    },
  },

  methods: {
    appendValue($event) {
      // console.log("v-json-node-array.appendValue", $event);
      const length = this.nodes.length;

      this.nodes.push({
        key: length,
        path: `${this.path}[${length}]`,
        value: $event,
      });

      this.dispatchInput();
    },

    deleteIndex(index) {
      // console.log("v-json-node-array.deleteIndex", index);
      this.nodes.splice(index, 1);

      this.dispatchInput();
    },

    dispatchInput() {
      const output = this.output;
      const old = this.lastOutput;
      console.log("v-json-node-array.dispatchInput", output, old);
      if (output !== old && output !== this.value) {
        console.log("v-json-node-array.dispatchInput >> input");
        this.lastOutput = output;
        this.$emit("input", output);
      }
    },

    setValue(index, $event) {
      console.log("v-json-node-array.setValue", index, $event);
      this.nodes[index].value = String($event);

      this.dispatchInput();
    },
  },

  watch: {
    value(value) {
      this.lastOutput = value;
    },
  },
}
</script>
