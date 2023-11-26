<template>
  <v-data-table
    :headers="headers"
    :items="users"
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
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
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

      <v-btn text to="/users" prepend-icon="mdi-pencil" color="warning">
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
  </v-data-table>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          title: 'User Name',
          align: 'start',
          sortable: false,
          key: 'userName',
        },
        { title: 'Password', sortable: false, key: 'password' },
        { title: 'Email', sortable: false, key: 'email' },
        { title: 'First Name', sortable: false, key: 'firstName' },
        { title: 'Last Name', sortable: false, key: 'lastName' },
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
      this.initialize()
    },

    methods: {
      initialize () {
        this.users = [
          {
            userName: 'Frozen Yogurt',
            password: 159,
            email: 6.0,
            firstName: 24,
            lastName: 4.0,
            age: 0,
            birthDay: 0,
          },
          {
            userName: 'Ice cream sandwich',
            password: 237,
            email: 9.0,
            firstName: 37,
            lastName: 4.3,
            age: 0,
            birthDay: 0,
          },
          {
            userName: 'Eclair',
            password: 262,
            email: 16.0,
            firstName: 23,
            lastName: 6.0,
            age: 0,
            birthDay: 0,
          },
          {
            userName: 'Cupcake',
            password: 305,
            email: 3.7,
            firstName: 67,
            lastName: 4.3,
            age: 0,
            birthDay: 0,
          },
          {
            userName: 'Gingerbread',
            password: 356,
            email: 16.0,
            firstName: 49,
            lastName: 3.9,
            age: 0,
            birthDay: 0,
          },
        ]
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

      deleteItemConfirm () {
        this.users.splice(this.editedIndex, 1)
        this.closeDelete()
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