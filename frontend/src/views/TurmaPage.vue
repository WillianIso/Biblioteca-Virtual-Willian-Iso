<template>
  <v-main>
    <v-container>
      <v-row class="d-flex justify-space-between align-center mb-4">
        <h2>Gerenciar Turmas</h2>
        <v-btn color="primary" @click="abrirModal()">Nova Turma</v-btn>
      </v-row>

      <!-- Tabela de turmas -->
      <v-data-table :headers="headers" :items="turmas" class="elevation-1">
        <template v-slot:[`item.acoes`]="{ item }">
          <v-icon small class="mr-2" color="blue" @click="abrirModal(item)">
            mdi-pencil
          </v-icon>
          <v-icon small color="red" @click="excluirTurma(item.id)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>

      <!-- Modal -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{
              turma.id ? "Editar Turma" : "Nova Turma"
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="formValido">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Número"
                      v-model="turma.numero"
                      type="number"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Descrição"
                      v-model="turma.descricao"
                      required
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn text @click="fecharModal">Cancelar</v-btn>
            <v-btn color="primary" @click="salvarTurma">Salvar</v-btn>
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
        { title: "Número", value: "numero" },
        { title: "Descrição", value: "descricao" },
        { title: "Ações", value: "acoes", sortable: false },
      ],
      turmas: [],
      dialog: false,
      formValido: false,
      turma: this.resetTurma(),
    };
  },
  methods: {
    resetTurma() {
      return {
        numero: "",
        descricao: "",
      };
    },
    abrirModal(item = null) {
      this.turma = item
        ? JSON.parse(JSON.stringify(item))
        : this.resetTurma();
      this.dialog = true;
    },
    fecharModal() {
      this.dialog = false;
    },
    async carregarTurmas() {
      const { data } = await api.get("/turmas");
      this.turmas = data;
    },
    async salvarTurma() {
      if (this.turma.id) {
        await api.put(`/turmas/${this.turma.id}`, this.turma);
      } else {
        const { data } = await api.post("/turmas", this.turma);
        this.turmas.push(data);
      }
      this.carregarTurmas();
      this.fecharModal();
    },
    async excluirTurma(id) {
      await api.delete(`/turmas/${id}`);
      this.turmas = this.turmas.filter((t) => t.id !== id);
    },
  },
  mounted() {
    this.carregarTurmas();
  },
};
</script>

<style scoped>
.v-row {
  padding: 10px;
  margin-right: 10px;
}
</style>
