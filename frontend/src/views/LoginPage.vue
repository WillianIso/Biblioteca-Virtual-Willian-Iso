<template>
  <v-main>
    <v-container
      class="d-flex align-center justify-center"
      style="height: 100vh"
    >
      <v-card class="pa-6" width="500">
        <v-card-title class="text-h5 d-flex align-center justify-center"
          >Login</v-card-title
        >

        <v-card-text>
          <!-- Adicione @submit.prevent -->
          <v-form ref="form" @submit.prevent="fazerLogin">
            <v-text-field
              v-model="email"
              label="E-mail"
              type="email"
              required
              prepend-icon="mdi-email"
            />

            <v-text-field
              v-model="senha"
              label="Senha"
              type="password"
              required
              prepend-icon="mdi-lock"
            />

            <v-btn
              type="submit"
              color="primary"
              class="mt-4"
              block
              :loading="loading"
            >
              Entrar
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import api from "@/api";
import { mapActions } from 'vuex';

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      senha: "",
      loading: false
    };
  },
  methods: {
    ...mapActions(['login']),

    async fazerLogin() {
      this.loading = true;
      
      try {
        const res = await api.post("/login", {
          email: this.email,
          senha: this.senha,
        });
        
        if (res.data && res.data.token) {
          localStorage.setItem("token", res.data.token);
          this.login(res.data.token); 
          this.$router.push("/");
        } else {
          console.error("Token não veio na resposta");
        }
        
      } catch (err) {
        console.error("ERRO COMPLETO:", err);
        console.error("Resposta de erro:", err.response);
        
        if (err.response) {
          console.error("Status do erro:", err.response.status);
          console.error("Dados do erro:", err.response.data);
          alert(`Erro: ${err.response.data?.message || err.response.status}`);
        } else {
          alert("Erro de conexão com o servidor");
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>