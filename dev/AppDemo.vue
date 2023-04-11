<template>
  <v-sheet class="AppDemo"
           elevation="6"
           rounded
  >
    <div class="AppDemo--input">
      <v-json-editor
          label="v-json-editor"
          v-model="json"
      />
    </div>
    <div class="AppDemo--input">
      <v-textarea
          label="v-textarea"
          v-model="json"
      />
    </div>
    <div class="AppDemo--footer">
      <v-btn block @click="reset(value)">Reset</v-btn>
    </div>
  </v-sheet>
</template>

<script>
import VJsonEditor from "../src/components/VJsonEditor.vue"

export default {
  name: 'AppDemo',

  components: {VJsonEditor},

  data() {
    return {
      json: JSON.stringify(this.value),
    };
  },

  props: {
    value: {},
  },

  methods: {
    reset(value) {
      try {
        this.json = JSON.stringify(value);
      } catch (e) {
        this.json = 'null';
      }
    },
  },

  watch: {
    value(value) {
      this.reset(value);
    },
  },
}
</script>

<style>
div.AppDemo {
  width: 100%;

  display: flex;
  align-items: stretch;
  flex-flow: row wrap;
  padding: 0.5rem 0.5rem 0 0.5rem;

}

div.AppDemo--input {
  flex: 1 1 60%;
  min-width: 30em;
  padding: 0 0.5rem;
}
div.AppDemo--input:nth-child(2) {
  flex: 1 1 40%;
}

div.AppDemo--footer {
  flex: 1 1 100%;
  padding: 1rem;
}

div.AppDemo--input .v-sheet {
  height: 100%;
}

div.AppDemo--input .v-text-field,
div.AppDemo--input .v-text-field textarea {
  font-family: monospace;
}
</style>
