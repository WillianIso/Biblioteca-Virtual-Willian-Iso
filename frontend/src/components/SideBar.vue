<template>
  <v-navigation-drawer app permanent color="#2e2e2e" dark>
    <v-list-item class="text-white" to="/">
      <v-img :src="bookImage" max-width="100" class="mx-auto" />
      <v-list-item-title
        class="text-h5 d-flex align-center justify-center font-weight-bold"
        >Biblioteca Virtual</v-list-item-title
      >
    </v-list-item>

    <v-divider class="mb-2"></v-divider>

    <v-list nav dense>
      <v-list-item
        v-for="item in menus"
        :key="item.text"
        :to="item.route"
        :active="$route.path === item.route"
        active-class="active-link"
        link
      >
        <v-list-item-title
          class="text-subtitle-1 text-white font-weight-medium"
        >
          <v-icon size="24" color="white">{{ item.icon }}</v-icon>
          {{ item.text }}
        </v-list-item-title>
      </v-list-item>

      <v-list-item
      class="logout-item"
        v-for="item in menuItensPerfil"
        :key="item.text"
        :to="item.route"
        :active="$route.path === item.route"
        active-class="active-link"
        link
      >
        <v-list-item-title
          class="text-subtitle-1 text-white font-weight-medium"
        >
          <v-icon size="24" color="white">{{ item.icon }}</v-icon>
          {{ item.text }}
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="fazerLogout" class="logout-item">
        <v-list-item-title class="text-subtitle-1 font-weight-medium">
          <v-icon size="24" color="#f44336">mdi-logout</v-icon>
          <span style="color: #f44336">Sair</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import bookImage from "@/assets/book.png";
import { mapGetters } from "vuex";

export default {
  name: "SideBar",
  data() {
    return {
      bookImage,
      menuItensNormais: [
        {
          text: "Livros",
          icon: "mdi-book-open-page-variant",
          route: "/",
          admin: false,
        },
        {
          text: "Meus Livros",
          icon: "mdi-book-check",
          route: "/meuslivros",
          admin: false,
        },
        {
          text: "Gerenciar Livros",
          icon: "mdi-book-edit",
          route: "/cadastrarlivro",
          admin: true,
        },
        {
          text: "Usuários",
          icon: "mdi-account-group",
          route: "/usuarios",
          admin: true,
        },
        {
          text: "Permissão",
          icon: "mdi-check",
          route: "/permissao",
          admin: true,
        },
        {
          text: "Turmas",
          icon: "mdi-home-group",
          route: "/turmas",
          admin: true,
        },
      ],
      menuItensPerfil: [
        { text: "Perfil", icon: "mdi-account", route: "/perfil", admin: false },
        {
          text: "Alterar Senha",
          icon: "mdi-account",
          route: "/alterarSenha",
          admin: false,
        },
      ],
    };
  },
  methods: {
    ...mapGetters(["currentUser"]),

    fazerLogout() {
      localStorage.removeItem("token");

      if (this.$store && this.$store.dispatch) {
        this.$store.dispatch("logout");
      }

      this.$router.push("/login");
      console.log("Logout realizado com sucesso!");
    },
  },
  computed: {
    mostrarMenuAdmin() {
      if (this.currentUser()?.permissoes?.length > 0) {
        const temPermissaoAdmin = this.currentUser().permissoes.some(
          (elem) => elem.nome == "admin"
        );
        if (temPermissaoAdmin) return true;
      }
      return false;
    },
    menus() {
      if (this.mostrarMenuAdmin) {
        return this.menuItensNormais;
      }
      return this.menuItensNormais.filter((elem) => !elem.admin);
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.active-link {
  background-color: rgba(255, 255, 255, 0.15) !important;
  border-left: 4px solid #fff;
}

/* Estilo para o item de logout */
.logout-item {
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
  cursor: pointer;
}

.logout-item:hover {
  background-color: rgba(244, 67, 54, 0.1) !important;
}
</style>