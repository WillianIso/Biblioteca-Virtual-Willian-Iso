<template>
  <v-main>
    <v-container>
      <v-row class="d-flex justify-space-between align-center mb-4">
        <h2>Gerenciar Livros</h2>
        <v-btn color="primary" @click="abrirModal()">Novo Livro</v-btn>
      </v-row>

      <v-data-table :headers="headers" :items="livros" class="elevation-1">
        <template v-slot:[`item.acoes`]="{ item }">
          <v-icon small color="green" @click="baixarPDF(item.pdf)">
            mdi-download
          </v-icon>
          <v-icon small color="red" @click="excluirLivro(item.id)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>

      <v-dialog v-model="dialog" max-width="700px">
        <v-card>
          <v-card-title>
            <span class="headline">{{
              livro.id ? "Editar Livro" : "Novo Livro"
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="formValido">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      label="Título"
                      v-model="livro.titulo"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      label="Autor"
                      v-model="livro.autor"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      label="Editora"
                      v-model="livro.editora"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-file-input
                      label="Capa do Livro"
                      v-model="livro.imagem"
                      accept="image/*"
                    />
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-file-input
                      label="Arquivo PDF"
                      v-model="livro.pdf"
                      accept="application/pdf"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn text @click="fecharModal">Cancelar</v-btn>
            <v-btn color="primary" @click="salvarLivro">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script>
import api from "@/api";

export default {
  data() {
    return {
      headers: [
        { title: "Título", value: "titulo" },
        { title: "Autor", value: "autor" },
        { title: "Editora", value: "editora" },
        { title: "Ações", value: "acoes", sortable: false },
      ],
      livros: [],
      dialog: false,
      formValido: false,
      livro: this.resetLivro(),
    };
  },
  methods: {
    resetLivro() {
      return {
        titulo: "",
        autor: "",
        editora: "",
        imagem: null,
        pdf: null,
      };
    },
    abrirModal(item = null) {
      this.livro = item ? JSON.parse(JSON.stringify(item)) : this.resetLivro();
      this.dialog = true;
    },
    fecharModal() {
      this.dialog = false;
    },
    async carregarLivros() {
      const { data } = await api.get("/livros");
      this.livros = data;
    },
    async salvarLivro() {
      const formData = new FormData();
      formData.append("titulo", this.livro.titulo);
      formData.append("autor", this.livro.autor);
      formData.append("editora", this.livro.editora);
      if (this.livro.imagem instanceof File)
        formData.append("imagem", this.livro.imagem);
      if (this.livro.pdf instanceof File)
        formData.append("pdf", this.livro.pdf);

      if (this.livro.id) {
        await api.put(`/livros/${this.livro.id}`, formData);
      } else {
        const { data } = await api.post("/livros/cadastrar", formData);
        this.livros.push(data);
      }

      this.carregarLivros();
      this.fecharModal();
    },
    async excluirLivro(id) {
      await api.delete(`/livros/${id}`);
      this.livros = this.livros.filter((l) => l.id !== id);
    },
    baixarPDF(nomeArquivo) {
      if (!nomeArquivo) return;
      const url = `http://localhost:3000/uploads/${nomeArquivo}`;
      window.open(url, "_blank");
    },
  },
  mounted() {
    this.carregarLivros();
  },
};
</script>

<style scoped>
.v-row {
  padding: 10px;
  margin-right: 10px;
}
</style>
