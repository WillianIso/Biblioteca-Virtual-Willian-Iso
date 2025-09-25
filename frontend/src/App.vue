<template>
  <v-app>
    <!-- Sidebar importada -->
    <SideBar v-if="$route.path != '/login'"/>
    <router-view />
  </v-app>
</template>


<script>
import SideBar from "@/components/SideBar.vue";

export default {
  name: "App",

  components: {
    SideBar,
  },
};
</script>
