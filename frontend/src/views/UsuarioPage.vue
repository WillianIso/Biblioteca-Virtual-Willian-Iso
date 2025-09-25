<template>
  <v-main>
    <v-container>
      <v-row class="d-flex justify-space-between align-center mb-4">
        <h2>Gerenciar Usuários</h2>
        <v-btn color="primary" @click="abrirModal()">Novo Usuário</v-btn>
      </v-row>

      <!-- Tabela de usuários -->
      <v-data-table :headers="headers" :items="usuarios" class="elevation-1">
        <template v-slot:[`item.acoes`]="{ item }">
          <v-icon small class="mr-2" color="blue" @click="abrirModal(item)"
            >mdi-pencil</v-icon
          >
          <v-icon small color="red" @click="excluirUsuario(item.id)"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>

      <!-- Modal -->
      <v-dialog v-model="dialog" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="headline">{{
              usuario.id ? "Editar Usuário" : "Novo Usuário"
            }}</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="formValido">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Nome"
                      v-model="usuario.nome"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="CPF"
                      v-model="usuario.cpf"
                      v-mask="'###.###.###-##'"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Email"
                      v-model="usuario.email"
                      type="email"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Telefone"
                      v-model="usuario.telefone"
                      v-mask="'(##) #####-####'"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      label="Senha"
                      v-model="usuario.senha"
                      type="password"
                      required
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <!-- Turma -->
                    <v-select
                      label="Turma"
                      v-model="usuario.turma"
                      :items="turmas"
                      item-title="descricao"
                      item-value="id"
                      return-object
                      outlined
                    />
                  </v-col>

                  <v-col cols="12">
                    <!-- Permissões -->
                    <v-select
                      v-model="usuario.permissoes"
                      :items="permissoes"
                      item-title="nome"
                      item-value="id"
                      label="Permissões"
                      multiple
                      chips
                      return-object
                      deletable-chips
                      outlined
                    />
                  </v-col>
                </v-row>

                <h4 class="mt-4">Endereço</h4>
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      label="CEP"
                      v-model="usuario.endereco.cep"
                      v-mask="'#####-###'"
                    />
                  </v-col>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      label="Logradouro"
                      v-model="usuario.endereco.logradouro"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      label="Número"
                      v-model="usuario.endereco.numero"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      label="Bairro"
                      v-model="usuario.endereco.bairro"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      label="Complemento"
                      v-model="usuario.endereco.complemento"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      label="Cidade"
                      v-model="usuario.endereco.cidade"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      label="UF"
                      v-model="usuario.endereco.uf"
                      maxlength="2"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn text @click="fecharModal">Cancelar</v-btn>
            <v-btn color="primary" @click="salvarUsuario">Salvar</v-btn>
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
        { title: "Nome", value: "nome" },
        { title: "CPF", value: "cpf" },
        { title: "Email", value: "email" },
        { title: "Telefone", value: "telefone" },
        { title: "Turma", value: "turma.descricao" },
        { title: "Ações", value: "acoes", sortable: false },
      ],
      usuarios: [],
      turmas: [],
      permissoes: [],
      dialog: false,
      formValido: false,
      usuario: this.resetUsuario(),
    };
  },
  methods: {
    resetUsuario() {
      return {
        nome: "",
        cpf: "",
        email: "",
        telefone: "",
        senha: "",
        turma: null,
        permissoes: null, 
        endereco: {
          cep: "",
          logradouro: "",
          bairro: "",
          uf: "",
          cidade: "",
          numero: "",
          complemento: "",
        },
      };
    },
    abrirModal(item = null) {
      this.usuario = item
        ? JSON.parse(JSON.stringify(item))
        : this.resetUsuario();
      this.dialog = true;
    },
    fecharModal() {
      this.dialog = false;
    },
    async carregarUsuarios() {
      const { data } = await api.get("/usuarios");
      this.usuarios = data;
    },
    async carregarTurmas() {
      const { data } = await api.get("/turmas");
      this.turmas = data;
    },
    async carregarPermissoes() {
      const { data } = await api.get("/permissoes");
      this.permissoes = data;
    },
    async salvarUsuario() {
      const payload = {
        ...this.usuario,
      };

      if (this.usuario.id) {
        await api.put(`/usuarios/${this.usuario.id}`, payload);
      } else {
        const { data } = await api.post("/usuarios", payload);
        this.usuarios.push(data);
      }
      this.carregarUsuarios();
      this.fecharModal();
    },
    async excluirUsuario(id) {
      await api.delete(`/usuarios/${id}`);
      this.usuarios = this.usuarios.filter((u) => u.id !== id);
    },
  },
  mounted() {
    this.carregarUsuarios();
    this.carregarTurmas();
    this.carregarPermissoes();
  },
};
</script>
