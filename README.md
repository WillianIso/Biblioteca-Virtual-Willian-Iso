# 📌 Projeto Frontend + Backend com Firebase

Este projeto é composto por duas partes principais:  

- **Frontend**: Construído em Vue.js, responsável pela interface do usuário.  
- **Backend**: Construído em Node.js com Express, responsável pela API e integração com o Firebase.  

---

## 🚀 Tecnologias utilizadas

- **Frontend**: Vue.js, Node.js + NPM  
- **Backend**: Node.js, Express, Firebase  

---

## 📂 Estrutura do projeto

```
/frontend   -> Código do Vue.js
/backend    -> Código do Node.js + Express + Firebase
```

---

## ⚙️ Pré-requisitos

- Node.js
- NPM  

---

## ▶️ Como rodar o projeto localmente

### Frontend (Vue.js)

```bash
cd frontend
npm install
npm run serve
```

O frontend ficará disponível em `http://localhost:8080`.

---

### Backend (Node.js + Express + Firebase)

```bash
cd backend
npm install
node serve.js
```

O backend ficará disponível em `http://localhost:3000`.

---

## 🔥 Firebase

O **Firebase** é usado como banco de dados em nuvem:  

- **Armazenamento de dados**: Realtime Database (JSON hierárquico).  
- **Integração**: o backend usa as credenciais do Firebase (`serviceAccountKey.json`) para criar, ler, atualizar e excluir dados (CRUD).  
- **Fluxo**:  
  - Usuário interage com o frontend  
  - Frontend chama o backend  
  - Backend acessa o Firebase e retorna os dados  
