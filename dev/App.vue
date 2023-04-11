<template>
  <v-app>
    <main class="App">
      <v-card elevation="6">
        <v-card-title style="flex-flow: row wrap">
          <h1 class="App">{{ packageDescriptor.name }}</h1>

          <v-spacer />

          <v-btn-toggle v-model="$vuetify.theme.dark">
            <v-btn :value="false">
              <v-icon>mdi-weather-sunny</v-icon>
              &nbsp;
              <span>Light Mode</span>
            </v-btn>
            <v-btn :value="true">
              <v-icon>mdi-weather-night</v-icon>
              &nbsp;
              <span>Dark Mode</span>
            </v-btn>
          </v-btn-toggle>
        </v-card-title>
      </v-card>

      <p>{{ packageDescriptor.description }}</p>

      <AppDemo :value="packageDescriptor" />

      <h2>Supporting all JSON types</h2>

      <h3>String</h3>
      <p>String-type data will be displayed as a text area:</p>
      <AppDemo :value="types.string" />

      <h3>Number</h3>
      <p>Numeric data will be displayed as a number input:</p>
      <AppDemo :value="types.number" />

      <h3>Boolean</h3>
      <p>Booleans are displayed as checkboxes:</p>
      <AppDemo :value="types.boolean" />

      <h3>Array</h3>
      <p>Arrays allow for each member to be edited, and for members to be added and deleted.</p>
      <AppDemo :value="types.array" />

      <h3>Null</h3>
      <p>The <code>null</code> value is supported.  Null values can be changed to another type with the type selector.</p>
      <AppDemo :value="types.null" />

      <h3>Object</h3>
      <p>Objects allow each key and value to be edited.  Any JSON value type is allowed, including nested objects and arrays.</p>
      <AppDemo :value="types" />

    </main>
  </v-app>
</template>

<script>
import $package from "../package.json";
import AppDemo from "./AppDemo.vue";

export default {
  name: "App",

  components: {AppDemo},

  data() {
    return {
      packageDescriptor: {
        "name": $package.name,
        "description": $package.description,
        "version": $package.version,
        "keywords": $package.keywords,
        "dependencies": $package.dependencies,
      },
      types: {
        "boolean": {
          "on": true,
          "off": false,
        },
        "number": 1.23,
        "string": "JSON value",
        "array": ["List", "of", "values", "...", 1, 2, 3],
        "null": null,
        "nestedObject": {
          "key": "value"
        }
      },
    };
  },
}
</script>

<style>
@import url(https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css);

.v-application {
  padding: 1rem;
}

.v-application.theme--light {
  background: #f0f0f0;
}

.v-application.theme--dark {
  background: #222;
}

main.App {
  padding: 1rem 2rem;
}

h1.App {
  padding: 1rem 0;
  flex: 0 0 auto;
}

.theme--light h1 {
  color: #4CAF50;
  text-decoration: 3px underline #8BC34A;
}

.theme--dark h1 {
  color: #8BC34A;
  text-decoration: 3px underline #4CAF50;
}

.v-app-bar {
  height: auto;
}

.v-app-bar > .v-toolbar__content {
  flex-flow: row wrap;
  height: auto !important;
}

main.App > p {
  padding: 0.3rem 0 0.3rem;
}

main.App > .v-sheet {
  margin: -0.6rem -1rem 1.2rem -1rem;
}
</style>
