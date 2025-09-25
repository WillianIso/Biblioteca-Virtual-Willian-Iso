<template>
  <v-main>
    <v-container fluid>
      <v-row class="d-flex justify-space-between align-center mb-4">
        <h2>Livros Disponíveis</h2>
        <v-text-field
          v-model="filtroTitulo"
          label="Buscar por título"
          dense
          outlined
          clearable
          style="max-width: 300px"
        />
      </v-row>
      <v-row>
        <v-col
          v-for="(livro, index) in livrosFiltrados"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card class="pa-2" :title="livro.titulo" :subtitle="livro.autor">
            <v-img
              :src="`http://localhost:3000/uploads/${livro.imagem}`"
              height="400px"
              cover
            ></v-img>
            <v-card-actions>
              <v-btn
                v-if="!livroEstaNaBiblioteca(livro)"
                color="primary"
                @click="pegarEmprestado(livro)"
              >
                Pegar Emprestado
              </v-btn>
              <v-btn
                v-if="livroEstaNaBiblioteca(livro)"
                color="primary"
                @click="devolver(livro)"
              >
                Devolver
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import api from "@/api";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "HomePage",
  data() {
    return {
      livros: [],
      user: null,
      filtroTitulo: null,
    };
  },
  mounted() {
    this.listarLivros();
  },
  async created() {
    api
      .get("/login/me")
      .then((res) => {
        this.setUser(res.data.user);
        this.user = res.data.user;
      })
      .catch((err) => {
        console.error("Não autenticado", err);
        this.$router.push("/login"); 
      });
  },
  computed: {
    livrosFiltrados() {
      if (!this.filtroTitulo) return this.livros;
      return this.livros.filter((livro) =>
        livro.titulo.toLowerCase().includes(this.filtroTitulo.toLowerCase())
      );
    },
  },
  methods: {
    ...mapActions(["setUser"]),
    ...mapGetters(["currentUser"]),

    async pegarEmprestado(livro) {
      const livros = this.user.livros;
      if (!livros || livros.length === 0) this.user.livros = [];
      this.user.livros.push(livro);

      await api.put(`/usuarios/${this.user.id}`, this.user);
      alert(`Você pegou emprestado o livro: "${livro.titulo}"!`);
      this.listarLivros();
    },

    async devolver(livro) {
      const livros = this.currentUser().livros;
      if (!livros || livros.length === 0) return;

      this.currentUser().livros = livros.filter(
        (elem) => elem.titulo !== livro.titulo
      );

      await api.put(`/usuarios/${this.currentUser().id}`, this.currentUser());
      alert(`Você devolveu o livro: "${livro.titulo}"!`);
      this.listarLivros();
    },

    listarLivros() {
      this.livros = [];
      api
        .get("/livros")
        .then((response) => {
          this.livros = response.data;
        })
        .catch((err) => {
          console.error("Erro ao listar:", err);
        });
    },

    livroEstaNaBiblioteca(livro) {
      if (this.currentUser() && this.currentUser().livros) {
        return this.currentUser().livros.some((elem) => elem.id === livro.id);
      }
      return false;
    },
  },
};
</script>

<style scoped>
.v-row {
  padding: 10px;
  margin-right: 10px;
}
</style>
