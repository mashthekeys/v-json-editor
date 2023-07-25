<template>
  <v-card :elevation="elevation" width="100%" :color="color">
    <template v-for="(node, index) in nodes">
      <div class="v-json-editor--row" :key="index">

        <v-text-field
            style="flex: 0.25 1 8em"
            dense
            hide-details
            :value="node.key"
            @input="setKey(index, $event)"
        >
          <template #append>
            <b>:</b>
          </template>
        </v-text-field>

        <v-json-node
            :color="color"
            can-delete
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
         :style="{left: !noNudge && nodes.length ? '-36px' : 0}"
    >
      <v-json-type-select
          close-button
          value="object"
          @create="appendValue"
      />
    </div>
  </v-card>
</template>

<script>
import VJsonTypeSelect from "./VJsonTypeSelect.vue";

export default {
  name: 'v-json-node-object',
  components: {
    // Dynamic dependency to avoid circular import
    VJsonNode: () => import("./VJsonNode.vue"),
    VJsonTypeSelect,
  },

  props: {
    "color": {},
    noNudge: Boolean,
    "path": {},
    "value": {},
  },

  data() {
    return {
      lastOutput: this.value,
    };
  },

  methods: {
    appendValue($event) {
      // console.log("v-json-node-object.appendValue", $event);
      const length = this.nodes.length;

      const key = "key" + length;

      this.nodes.push({
        key,
        path: `${this.path}."${key}"`,
        value: $event,
      });

      this.dispatchInput();
    },

    deleteIndex(index) {
      // console.log("v-json-node-object.deleteIndex", index);
      this.nodes.splice(index, 1);

      this.dispatchInput();
    },

    dispatchInput() {
      const output = this.getOutput();

      if (typeof output === "undefined") {
        this.lastOutput = output;
        return;
      }

      const old = this.lastOutput;
      // console.log("v-json-node-object.dispatchInput", output, old);
      if (output !== old && output !== this.value) {
        // console.log("v-json-node-object.dispatchInput >> input");
        this.lastOutput = output;
        this.$emit("input", output);
      }
    },

    getOutput() {
      const objectMembers = [];

      const uniqueKeys = [];

      let isValid = true;

      for (let i = 0; i < this.nodes.length; i++) {
        let {key, value} = this.nodes[i];

        key = String(key);

        if (uniqueKeys.includes(key)) {
          isValid = false;
          // Access all array members, even if not valid
        }

        uniqueKeys.push(key);

        objectMembers.push(JSON.stringify(key) + ":" + value)
      }

      const output = !isValid ? undefined : `{${objectMembers.join(",")}}`;

      // console.log("v-json-node-object.getOutput", output);

      return output;
    },

    setValue(index, $event) {
      // console.log("v-json-node-object.setValue", index, $event);
      this.nodes[index].value = String($event);

      this.dispatchInput();
    },

    setKey(index, $event) {
      // console.log("v-json-node-object.setKey", index, $event);
      this.nodes[index].key = String($event);

      this.dispatchInput();
    },
  },

  computed: {
    elevation() {
      return this.path.replace(/[^.]/g, "").length;
    },

    decoded() {
      const {value} = this;

      let object = null;

      try {
        object = JSON.parse(value);
      } catch (ignored) {
        // Ignore JSON error
      }

      if (typeof object === "object") return object;

      return null;
    },

    nodes() {
      const {decoded, path} = this;

      if (decoded == null) return [];

      return Object.keys(decoded).map(key => {
        const keyPath = /^\w+$/.test(key) ? key : JSON.stringify(key).replace(/\./g, "\\u002e").replace(/\[/g, "\\u005b");

        return {
          key,
          path: `${path}.${keyPath}`,
          value: JSON.stringify(decoded[key]),
        };
      });
    },
  },

  watch: {
    value(value) {
      this.lastOutput = value;
    },
  },
}
</script>
