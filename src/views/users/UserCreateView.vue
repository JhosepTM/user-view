<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elev-3">
          <v-card-title>Create a new User</v-card-title>
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
  import { reactive } from 'vue'
  import { useVuelidate } from '@vuelidate/core'
  import { email, required } from '@vuelidate/validators'

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

  function submit(){
    v$.value.$validate();
    if (v$.value.$invalid) {
      return;
    }
    const user = 
      {
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
  }
</script>
