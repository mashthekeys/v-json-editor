#   @mashthekeys/v-json-editor

A visual editor for JSON data input, based on Vue and Vuetify.

```vue
<v-json-editor
    label="JSON Editor"
    :value="JSON.stringify(data)"
    @input="data = JSON.parse($event)"
/>
```

```vue
<template>
  <v-json-editor v-model="jsonData"/>
</template>

<script>
import VJsonEditor from "@mashthekeys/v-json-editor";

export default {
  components: {VJsonEditor},
  data() {
    return {
      jsonData: '"..."'
    };
  },
}
</script>
```

##  Supports all JSON types

### String
String-type data will be displayed as a text area:
```json
"JSON value"
```

### Number
Numeric data will be displayed as a number input:
```json
1.23
```

### Boolean
Booleans are displayed as checkboxes:
```json
true
```
```json
false
```

### Array
Arrays allow for each member to be edited, and for members to be added and 
deleted.
```json
[
  "List",
  "of", 
  "values", 
  "...", 
  1,
  2,
  3
]
```

### Null
The `null` value is supported.  Null values can be changed to another type with
the type selector.
```json
null
```

### Object
Objects allow each key and value to be edited.  Any JSON value type is allowed,
including nested objects and arrays.

```json
{
  "string": "JSON value",
  "number": 1.23,
  "boolean": true,
  "array": [
    "List",
    "of",
    "values",
    "...",
    1,
    2,
    3
  ],
  "nestedObject": {
    "key": "value"
  }
}
```

