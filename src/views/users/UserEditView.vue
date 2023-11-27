<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elev-3">
          <v-card-title>Edit User</v-card-title>
          <v-card-subtitle>* required fields</v-card-subtitle>
          <v-card-text>
            <form>
              <v-text-field
                v-model="state.firstName"
                :error-messages="v$.firstName.$errors.map(e => e.$message)"
                :counter="50"
                label="First Name *"
                required
                @input="v$.firstName.$touch"
                @blur="v$.firstName.$touch"
              ></v-text-field>

              <v-text-field
                v-model="state.lastName"
                :error-messages="v$.lastName.$errors.map(e => e.$message)"
                :counter="50"
                label="Last Name *"
                required
                @input="v$.lastName.$touch"
                @blur="v$.lastName.$touch"
              ></v-text-field>

              <v-text-field
                v-model="state.birthDay"
                :error-messages="v$.birthDay.$errors.map(e => e.$message)"
                :counter="50"
                label="Birth Day *"
                required
                @input="v$.birthDay.$touch"
                @blur="v$.birthDay.$touch"
                type="date"
              ></v-text-field>

              <v-text-field
                v-model="state.userName"
                :error-messages="v$.userName.$errors.map(e => e.$message)"
                :counter="50"
                label="User Name *"
                required
                @input="v$.userName.$touch"
                @blur="v$.userName.$touch"
              ></v-text-field>

              <v-text-field
                v-model="state.password"
                :error-messages="v$.password.$errors.map(e => e.$message)"
                :counter="50"
                label="Password*"
                required
                @input="v$.password.$touch"
                @blur="v$.password.$touch"
                type="password"
              ></v-text-field>

              <v-text-field
                v-model="state.email"
                :error-messages="v$.email.$errors.map(e => e.$message)"
                label="E-mail *"
                required
                @input="v$.email.$touch"
                @blur="v$.email.$touch"
                type="email"
                class="mb-5"
              ></v-text-field>

              <v-btn
                class="me-4"
                @click="submit"
                color="primary"
              >
                submit
              </v-btn>
              <v-btn to="/users">
                back
              </v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue'
  import { useVuelidate } from '@vuelidate/core'
  import { email, required } from '@vuelidate/validators'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'

  const route = useRoute();
  const router = useRouter();

  console.log("asssss", route.params.id)

  const initialState = {
    firstName: '',
    lastName: '',
    birthDay: '',
    userName: '',
    password: '',
    email: '',
  }

  const state = reactive({
    ...initialState,
  })

  const rules = {
    firstName: { required },
    lastName: { required },
    birthDay: { required },
    userName: { required },
    email: { required, email },
    password: { required },
  }

  const v$ = useVuelidate(rules, state)

  onMounted(async () => {
    const id = route.params.id
    
    const response = await axios.get(`http://localhost:8080/v1/users/${id}`);
    let birthDay = "2023-07-04";
    if (response.data.userDetail) {
      const date = new Date(response.data.userDetail.birthDay);
      const month = date.getMonth() + 1;
      let monthString = month.toString().padStart(2, '0'); 
      birthDay = `${date.getFullYear()}-${monthString}-${date.getDate().toString().padStart(2, '0')}`;
    }
    const user = {
        "userName": response.data.userName,
        "password": response.data.password,
        "email": response.data.email,
        "firstName": response.data.userDetail?response.data.userDetail.firstName:"",
        "lastName": response.data.userDetail?response.data.userDetail.lastName:"",
        "birthDay": birthDay,
      };
    for (const key in user) {
      if (state[key] !== undefined) {
        state[key] = user[key]
      }
    }
  })

  function calculateAge(fechaNacimiento: string) {
    var hoy = new Date();
    var cumpleanos = new Date(fechaNacimiento);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }

    return edad;
  }

  async function submit(){
    const id = route.params.id
    v$.value.$validate();
    if (v$.value.$invalid) {
      return;
    }
    const user = 
      {
        "id": id,
        "userName": v$.value.userName.$model,
        "password": v$.value.password.$model,
        "email": v$.value.email.$model,
        "userDetail": {
          "firstName": v$.value.firstName.$model,
          "lastName": v$.value.lastName.$model,
          "age": calculateAge(v$.value.birthDay.$model),
          "birthDay": v$.value.birthDay.$model
        }
      }

      const response = await axios.patch(`http://localhost:8080/v1/users/${id}`, user)
      if (response != null) {
        router.push('/users')
      }
  }
</script>

