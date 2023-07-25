<template>
  <v-menu bottom :nudge-bottom="36" v-model="isOpen">
    <template #activator="{attrs, on}">
      <v-btn icon tile
             color="primary"
             class="v-json-type-select--activator"
             v-bind="attrs" v-on="on"
             @keydown="activatorKeyDown"
             @keypress="activatorKeyPress"
      >
        <v-icon style="font-style: normal">{{ getActivatorIcon(value) }}</v-icon>
      </v-btn>
    </template>

    <div style="width: calc(3 * 36px)">
      <v-sheet elevation="24" color="primary" class="v-json-type-select--menu">
        <template v-for="type in types">
          <v-btn icon tile
                 :outlined="!closeButton && value === type"
                 :key="type"
                 @click="create(getDefault(type))">
            <v-icon>{{ getIcon(type) }}</v-icon>
          </v-btn>
        </template>

        <v-btn v-if="canPaste"
               icon tile
               @click="clipboardPaste"
        >
          <v-icon>mdi-content-paste</v-icon>
        </v-btn>

        <v-text-field
            v-else
            dense
            hide-details
            prepend-inner-icon="mdi-content-paste"
            style="width: 36px"
            :value="pasteValue"
            @input="textFieldPaste"
            @click.stop
        />

        <v-btn icon tile
               @click="close('copy')"
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>

        <v-btn v-if="canDelete"
               icon tile
               color="red"
               @click="close('cut')"
        >
          <v-icon>mdi-content-cut</v-icon>
        </v-btn>

        <v-btn v-if="canDelete"
               icon tile
               color="red"
               @click="close('delete')"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-sheet>
    </div>
  </v-menu>
</template>

<script>
export default {
  name: 'v-json-type-select',

  props: {
    canDelete: Boolean,
    closeButton: Boolean,
    value: {},
  },

  data() {
    return {
      isOpen: false,
      pasteValue: "",
    };
  },

  computed: {
    canPaste() {
      try {
        return typeof window.navigator.clipboard.readText === "function";
      } catch (e) {
        // Ignored
      }
      return false;
    },

    types() {
      return ['string', 'number', 'boolean', 'Array', 'object', 'null'];
    },
  },

  methods: {
    activatorKeyDown($event) {
      const keyCode = $event.keyCode;

      if (37 <= keyCode && keyCode <= 40) {
        //left = 37; up = 38; right = 39; down = 40
        $event.stopPropagation();
        $event.preventDefault();
      }
    },

    activatorKeyPress($event) {
      const charCode = $event.charCode;

      if (0x30 <= charCode && charCode <= 0x39) {
        // U+0030 DIGIT ZERO
        // U+0039 DIGIT NINE
        $event.stopPropagation();
        $event.preventDefault();

        this.create(String.fromCharCode(charCode));

      } else if (charCode === 0x08 && charCode === 0x2E) {
        // BACKSPACE 0x08
        // DELETE 0x2E
        $event.stopPropagation();
        $event.preventDefault();

        this.canDelete && this.close("delete");

      } else if (charCode === 0x22) {
        // U+0022 QUOTATION MARK
        $event.stopPropagation();
        $event.preventDefault();
        this.create('""');

      } else if (charCode === 0x5B) {
        // U+005B LEFT SQUARE BRACKET
        $event.stopPropagation();
        $event.preventDefault();
        this.create('[]');

      } else if (charCode === 0x7B) {
        // U+007B LEFT CURLY BRACKET
        $event.stopPropagation();
        $event.preventDefault();
        this.create('{}');

      } else if (charCode === 0x74) {
        // U+0054 LATIN LOWER CASE LETTER T
        $event.stopPropagation();
        $event.preventDefault();
        this.create('true');

      } else if (charCode === 0x66) {
        // U+0046 LATIN LOWER CASE LETTER F
        $event.stopPropagation();
        $event.preventDefault();
        this.create('false');

      } else if (charCode === 0x6E) {
        // U+0046 LATIN LOWER CASE LETTER N
        $event.stopPropagation();
        $event.preventDefault();
        this.create('null');
      }
    },

    async clipboardPaste() {
      return window.navigator.clipboard.readText();
    },

    close(event, eventParam) {
      this.isOpen = false;

      if (event != null) this.$emit(event, eventParam);
    },

    create(json) {
      this.close('create', json);
    },

    getActivatorIcon(type) {
      const {closeButton} = this;

      return type === 'Array' ? (!closeButton ? "[" : "]")
          : type === 'object' ? (!closeButton ? "{" : "}")
              : this.getIcon(type);
    },

    getDefault(type) {
      return type === 'string' ? '""'
          : type === 'number' ? '0'
              : type === 'boolean'? 'true'
                  : type === 'Array'? '[]'
                      : type === 'object'? '{}'
                          : type === 'null' ? 'null'
                              : type;
    },

    getIcon(type) {
      return type === 'string' ? "mdi-format-quote-open"
          : type === 'number' ? "mdi-numeric-0"
              : type === 'boolean'? "mdi-check"
                  : type === 'Array'? "mdi-code-brackets"
                      : type === 'object'? "mdi-code-braces"
                          : type === 'null' ? "mdi-null"
                              : "mdi-alert-box";
    },

    textFieldPaste(value) {
      this.close("create", value);

      this.pasteValue = value;

      this.$nextTick(() => {
        this.pasteValue = "";
      });
    },
  },
}
</script>

<style>
.v-json-type-select--activator.theme--light:not(:focus) {
  color: rgba(0, 0, 0, 0.54) !important;
}

.v-json-type-select--activator.theme--dark:not(:focus) {
  color: white !important;
}

.v-json-type-select--menu {
  display: flex;
  flex-flow: row wrap;
  width: calc(36px * 3);
  justify-items: flex-end;
}
</style>
