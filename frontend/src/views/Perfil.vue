<template>
  <v-main>
    <v-container class="py-10" max-width="600px">
      <v-card class="pa-6">
        <v-card-title class="text-h5 d-flex align-center justify-center"
          >Editar Perfil</v-card-title
        >

        <div class="d-flex justify-center mb-4">
          <v-avatar size="120">
            <v-img :src="fotoPreview" alt="Foto de perfil" />
          </v-avatar>
        </div>

        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-container>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-text-field label="Nome" v-model="perfil.nome" required />
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    label="CPF"
                    v-model="perfil.cpf"
                    v-mask="'###.###.###-##'"
                    required
                  />
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    label="Email"
                    v-model="perfil.email"
                    type="email"
                    required
                  />
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    label="Telefone"
                    v-model="perfil.telefone"
                    v-mask="'(##) #####-####'"
                  />
                </v-col>
                <v-col v-if="perfil.turma" cols="12" sm="12">
                  <v-text-field
                    label="Turma"
                    disabled
                    v-model="perfil.turma.descricao"
                    required
                  />
                </v-col>
              </v-row>

              <h4 class="mt-4">Endereço</h4>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field
                    label="CEP"
                    v-model="perfil.endereco.cep"
                    v-mask="'#####-###'"
                  />
                </v-col>
                <v-col cols="12" sm="8">
                  <v-text-field
                    label="Logradouro"
                    v-model="perfil.endereco.logradouro"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    label="Número"
                    v-model="perfil.endereco.numero"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    label="Bairro"
                    v-model="perfil.endereco.bairro"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    label="Complemento"
                    v-model="perfil.endereco.complemento"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    label="Cidade"
                    v-model="perfil.endereco.cidade"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    label="UF"
                    v-model="perfil.endereco.uf"
                    maxlength="2"
                  />
                </v-col>
              </v-row>
            </v-container>

            <v-btn
              class="mt-4"
              block
              color="primary"
              @click="salvar"
              :disabled="!formValid"
            >
              Salvar
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>
  
  <script>
import api from "@/api";
import { mapGetters } from "vuex";

export default {
  name: "PerfilPage",
  components: {},
  data() {
    return {
      formValid: false,
      perfil: {
        nome: "",
        email: "",
        endereco: "",
        telefone: "",
        turma: "",
        foto: "",
      },
      fotoPreview: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rules: {
        required: (v) => !!v || "Campo obrigatório",
        email: (v) => /.+@.+\..+/.test(v) || "E-mail inválido",
      },
    };
  },
  mounted() {
    this.perfil = this.currentUser();
  },
  methods: {
    ...mapGetters(["currentUser"]),

    async salvar() {
      if (this.$refs.form.validate()) {

        await api.put(`/usuarios/${this.perfil.id}`, this.perfil);
        alert("Dados salvos com sucesso.");
      }
    },
    handleFileChange(file) {
      if (file && file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.fotoPreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>
  