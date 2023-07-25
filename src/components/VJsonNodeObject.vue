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
            <b v-if="node.unique">:</b>
            <v-icon v-else color="red" small right>mdi-alert</v-icon>
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
    const {value} = this;

    return {
      lastOutput: value,
      nodes: this.getNodes(value),
    };
  },

  methods: {
    appendValue($event) {
      // console.log("v-json-node-object.appendValue", $event);
      const key = "";

      this.nodes.push({
        key,
        path: `${this.path}."${key}"`,
        value: $event,
        unique: undefined, // to be calculated in onKeyChange()
      });

      this.onKeyChange(key);

      this.dispatchInput();
    },

    deleteIndex(index) {
      // console.log("v-json-node-object.deleteIndex", index);
      const [{key}] = this.nodes.splice(index, 1);

      this.onKeyChange(key);

      this.dispatchInput();
    },

    onKeyChange(newKey) {
      // console.log("v-json-node-object.onKeyChange", newKey);

      const {nodes} = this;

      const sameKey = [];

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (node.key === newKey) {
          sameKey.push(i);
        }
      }

      const isUnique = sameKey.length < 2;

      for (let s = 0; s < sameKey.length; s++) {
        const node = nodes[sameKey[s]];

        this.$set(node, "unique", isUnique);
      }
    },

    dispatchInput() {
      const output = this.getOutput();

      const {lastOutput, value} = this;

      // console.log("v-json-node-object.dispatchInput", output);

      if (typeof output === "undefined") {
        this.lastOutput = undefined;

      } else if (output !== lastOutput && output !== value) {
        this.lastOutput = output;

        this.$emit("input", output);
      }
    },

    getDecoded(value) {
      let object = null;

      try {
        object = JSON.parse(value);
      } catch (ignored) {
        // Ignore JSON error
      }

      if (typeof object === "object") return object;

      return null;
    },

    getNodes(value) {
      const {path} = this;

      const decoded = this.getDecoded(value);

      if (decoded != null) {
        return Object.keys(decoded).map(key => {
          const keyPath = /^\w+$/.test(key) ? key : JSON.stringify(key).replace(/\./g, "\\u002e").replace(/\[/g, "\\u005b");

          return {
            key,
            path: `${path}.${keyPath}`,
            value: JSON.stringify(decoded[key]),
            unique: true,
          };
        });
      } else {
        return [];
      }
    },

    getOutput() {
      const {nodes} = this;

      const objectMembers = [];

      let isValid = true;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        let {key, value, unique} = node;

        key = String(key);

        if (!unique) {
          isValid = false;
        } else if (isValid) {
          objectMembers.push(JSON.stringify(key) + ":" + value)
        }
      }

      if (isValid) {
        return `{${objectMembers.join(",")}}`;
      } else {
        return undefined;
      }
    },

    onValueChange(value) {
      this.lastOutput = value;

      this.nodes = this.getNodes(value);
    },

    setValue(index, $event) {
      // console.log("v-json-node-object.setValue", index, $event);
      this.$set(this.nodes[index], "value", String($event));

      this.dispatchInput();
    },

    setKey(index, $event) {
      // console.log("v-json-node-object.setKey", index, $event);
      const oldKey = this.nodes[index].key;

      const key = this.$set(this.nodes[index], "key", String($event));

      this.onKeyChange(oldKey);

      if (oldKey !== key) this.onKeyChange(key);

      this.dispatchInput();
    },
  },

  computed: {
    elevation() {
      return this.path.replace(/[^.]/g, "").length;
    },
  },

  watch: {
    value(value) {
      this.onValueChange(value);
    },
  },
}
</script>
