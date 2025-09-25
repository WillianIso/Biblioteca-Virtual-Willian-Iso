<template>
  <v-main>
    <v-container class="pa-5">
      <!-- Título e botão novo -->
      <v-row class="d-flex justify-space-between align-center mb-4">
        <h2>Gerenciar Permissões</h2>
        <v-btn color="primary" @click="abrirModal()">Nova Permissão</v-btn>
      </v-row>

      <v-row>
        <!-- Tabela -->
        <v-data-table
          :headers="headers"
          :items="permissoes"
          class="elevation-1"
          dense
        >
          <template v-slot:[`item.acoes`]="{ item }">
            <v-icon small class="mr-2" color="grey" @click="abrirModal(item)">mdi-pencil</v-icon>
            <v-icon small color="grey" @click="excluirPermissao(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-row>

      <!-- Modal -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ editar ? 'Editar Permissão' : 'Nova Permissão' }}</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="formPermissao" v-model="formValido">
              <v-text-field
                v-model="permissao.nome"
                label="Nome da Permissão"
                :rules="[v => !!v || 'Campo obrigatório']"
                required
              />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="fecharModal">Cancelar</v-btn>
            <v-btn color="primary" @click="salvarPermissao">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script>
import api from "@/api";

export default {
  name: "PermissaoPage",
  data() {
    return {
      dialog: false,
      editar: false,
      formValido: false,
      permissoes: [],

      permissao: {
        nome: "",
      },

      headers: [
        { title: "ID", key: "id" },
        { title: "Nome", key: "nome" },
        { title: "Ações", key: "acoes", sortable: false },
      ],
    };
  },
  mounted() {
    this.carregarPermissoes();
  },
  methods: {
    async carregarPermissoes() {
      try {
        const response = await api.get("/permissoes");
        this.permissoes = response.data;
      } catch (err) {
        console.error("Erro ao carregar permissões:", err);
        alert("Erro ao carregar permissões!");
      }
    },
    abrirModal(item = null) {
      if (item) {
        this.editar = true;
        this.permissao = { ...item };
      } else {
        this.editar = false;
        this.permissao = { nome: "" };
      }
      this.dialog = true;
    },
    fecharModal() {
      this.dialog = false;
    },
    async salvarPermissao() {
      if (this.$refs.formPermissao.validate()) {
        try {
          if (this.editar) {
            const response = await api.put(`/permissoes/${this.permissao.id}`, this.permissao);

            const index = this.permissoes.findIndex(p => p.id === this.permissao.id);
            if (index !== -1) this.permissoes.splice(index, 1, response.data);

            alert("Permissão atualizada com sucesso!");
          } else {
            const response = await api.post("/permissoes", this.permissao);

            this.permissoes.push(response.data);
            alert("Permissão cadastrada com sucesso!");
          }
          this.fecharModal();
        } catch (err) {
          console.error("Erro ao salvar:", err);
          alert("Erro ao salvar permissão!");
        }
      }
    },
    async excluirPermissao(id) {
      if (!confirm("Deseja realmente excluir esta permissão?")) return;

      try {
        await api.delete(`/permissoes/${id}`);
        this.permissoes = this.permissoes.filter(p => p.id !== id);
        alert("Permissão excluída com sucesso!");
      } catch (err) {
        console.error("Erro ao excluir:", err);
        alert("Erro ao excluir permissão!");
      }
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
