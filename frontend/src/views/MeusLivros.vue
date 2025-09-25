<template>
  <v-main>
    <v-container fluid>
      <v-row class="d-flex justify-space-between align-center mb-4">
        <h2>Livros Emprestados</h2>
        <v-text-field
          v-model="filtroTitulo"
          label="Buscar por título"
          dense
          outlined
          clearable
          style="max-width: 300px"
        />
      </v-row>

      <v-row v-if="livros.length > 0">
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
              <v-row>
                <v-col lg="12">
                  <v-btn color="primary" @click="abrirPDF(livro)">
                    Visualizar PDF
                  </v-btn>
                </v-col>
                <v-col lg="12">
                  <v-btn color="primary" @click="devolver(livro)">
                    Devolver
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-alert
          text="Este usuário não possui livros emprestados."
          type="info"
    density="compact"
        ></v-alert>
      </v-row>

      <!-- Modal para visualizar PDF -->
      <v-dialog v-model="modalPDF" max-width="1200px">
        <v-card>
          <v-card-title>{{ livroSelecionado?.titulo }}</v-card-title>
          <v-card-text>
            <PDFViewer :pdfUrlReal="livroSelecionadoPdf" />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="red" @click="modalPDF = false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script>
import api from "@/api";
import { mapGetters } from "vuex";
import PDFViewer from "@/components/PDF.vue";

export default {
  name: "MeusLivros",
  components: { PDFViewer },
  data() {
    return {
      livros: [],
      modalPDF: false,
      livroSelecionado: null,
      livroSelecionadoPdf: "",
      filtroTitulo: null,
    };
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
    ...mapGetters(["currentUser"]),

    async devolver(livro) {
      const livros = this.currentUser().livros;
      if (!livros || livros.length === 0) return;

      this.currentUser().livros = livros.filter(
        (elem) => elem.titulo !== livro.titulo
      );

      await api.put(`/usuarios/${this.currentUser().id}`, this.currentUser());
      alert(`Você devolveu o livro: "${livro.titulo}"!`);
      this.livros = this.currentUser().livros;
    },

    abrirPDF(livro) {
      this.livroSelecionado = livro;
      this.livroSelecionadoPdf = `http://localhost:3000/uploads/${livro.pdf}`;
      this.modalPDF = true;
    },
  },
  mounted() {
    this.livros = this.currentUser().livros;
  },
};
</script>

<style scoped>
.v-row {
  padding: 10px;
  margin-right: 10px;
}
</style>
