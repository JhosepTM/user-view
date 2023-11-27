<template>
  <v-data-table-server
    :headers="headers"
    :items="users"
    
    :loading="isLoading"
    loading-text="Loading... Please wait"
  >
    <template v-slot:top>
      <v-toolbar
        color="primary"
        flat
      >
        <v-toolbar-title>Users</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-btn 
          text
          color="white"
          dark
          size="large"
          variant="outlined"
          to="/users/create"
        >Add User</v-btn>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this User?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">

      <v-btn text :to="`/users/edit/${item.id}`" prepend-icon="mdi-pencil" color="warning">
        <template v-slot:prepend>
          <v-icon color="white"></v-icon>
        </template>
        Edit
      </v-btn>
      <v-btn @click="deleteItem(item)" text prepend-icon="mdi-delete" color="red" class="ml-5">
        <template v-slot:prepend>
          <v-icon color="white"></v-icon>
        </template>
        Delete
      </v-btn>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table-server>
</template>

<script>
  import axios from 'axios';
  export default {
    data: () => ({
      isLoading: true,
      dialog: false,
      dialogDelete: false,
      headers: [
        { title: 'First Name', sortable: false, key: 'firstName' },
        { title: 'Last Name', sortable: false, key: 'lastName' },
        {
          title: 'User Name',
          align: 'start',
          sortable: false,
          key: 'userName',
        },
        { title: 'Password', sortable: false, key: 'password' },
        { title: 'Email', sortable: false, key: 'email' },
        { title: 'Age', key: 'age' },
        { title: 'Birth Day', key: 'birthDay' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      users: [],
      editedIndex: -1,
      editedItem: {
        userName: '',
        password: 0,
        email: 0,
        firstName: 0,
        lastName: 0,
        age: 0,
        birthDay: 0,
      },
      defaultItem: {
        userName: '',
        password: 0,
        email: 0,
        firstName: 0,
        lastName: 0,
        age: 0,
        birthDay: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      
      this.initialize();
      this.isLoading = false;
    },

    methods: {
      initialize () {
        axios.get('http://localhost:8080/v1/users?detailed=true')
        .then( response => {
          const lista = [];
          response.data.forEach(userDB => {
            let birthDay = "0 / 0 / 0000";
            if (userDB.userDetail) {
              const date = new Date(userDB.userDetail.birthDay);
              const month = date.getMonth() + 1;
              let monthString = month.toString().padStart(2, '0'); 
              birthDay = `${date.getFullYear()}-${monthString}-${date.getDate().toString().padStart(2, '0')}`;
            }
            const user = 
              {
                "id": userDB.id,
                "userName": userDB.userName,
                "password": userDB.password,
                "email": userDB.email,
                "firstName": userDB.userDetail?userDB.userDetail.firstName:"",
                "lastName": userDB.userDetail?userDB.userDetail.lastName:"",
                "age": userDB.userDetail?userDB.userDetail.age:"",
                "birthDay": birthDay,
              }
            lista.push(user);
          });
          this.users = lista;
        })
        .catch(function (error) {
          console.error(error);
        });
      },

      editItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        const deltedItem = await axios.delete(`http://localhost:8080/v1/users/${this.editedItem.id}`);
        if (deltedItem.status == 204) {
          this.users.splice(this.editedIndex, 1)
        this.closeDelete()
        } else {
          alert("Can't delete the user, try again later")
        }
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.users[this.editedIndex], this.editedItem)
        } else {
          this.users.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>

<style scoped>
  .v-data-table th {
    font-size: 32px; 
  }
</style>