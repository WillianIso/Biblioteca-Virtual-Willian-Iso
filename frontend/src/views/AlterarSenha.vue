<template>
  <v-main>
    <v-container fluid>
      <v-row class="d-flex justify-center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="pa-6">
            <v-card-title class="text-h5 d-flex align-center justify-center"
              >Alterar Senha</v-card-title
            >
            <v-card-text class="mt-5">
              <v-form ref="form">
                <v-text-field
                  v-model="novaSenha"
                  label="Nova Senha"
                  type="password"
                  outlined
                  required
                />
                <v-text-field
                  v-model="confirmarSenha"
                  label="Confirmar Nova Senha"
                  type="password"
                  outlined
                  required
                />
              </v-form>
            </v-card-text>
            <v-card-actions class="d-flex justify-end">
              <v-btn class="mt-4" block color="primary" @click="alterarSenha">
                Salvar
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
import { mapGetters } from "vuex";

export default {
  name: "AlterarSenha",
  data() {
    return {
      novaSenha: "",
      confirmarSenha: "",
    };
  },
  methods: {
    ...mapGetters(["currentUser"]),

    async alterarSenha() {
      if (!this.novaSenha || !this.confirmarSenha) {
        return alert("Preencha todos os campos!");
      }

      if (this.novaSenha !== this.confirmarSenha) {
        return alert("A nova senha e a confirmação não coincidem!");
      }

      try {
        await api.put(`/usuarios/${this.currentUser().id}`, {
          senha: this.novaSenha,
        });

        alert("Senha alterada com sucesso!");
        this.novaSenha = "";
        this.confirmarSenha = "";
      } catch (err) {
        console.error(err);
        alert("Erro ao alterar senha!");
      }
    },
  },
};
</script>
