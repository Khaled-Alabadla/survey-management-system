<template>
  <div>
    <div>
    
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Register for free
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        {{ " " }}
        <router-link
          :to="{ name: 'Login' }"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          login to your account
        </router-link>
      </p>
    </div>

    <form class="mt-8 space-y-6" @submit="register">
      <Alert v-if="Object.keys(errors).length" class="flex-col items-stretch text-sm">
        <div v-for="(field, i) of Object.keys(errors)" :key="i">
          <div v-for="(error, ind) of errors[field] || []" :key="ind">
            * {{ error }}
          </div>
        </div>
      </Alert>

      <input type="hidden" name="remember" value="true" />
      <div class="rounded-md shadow-sm -space-y-px">
        <TInput
        style="margin-bottom: 10px;"
          name="name"
          v-model="user.name"
          :errors="errors"
          placeholder="Full Name"
          inputClass="rounded-t-md"
        />
        <TInput
        style="margin-bottom: 10px;"
          type="email"
          name="email"
          v-model="user.email"
          :errors="errors"
          placeholder="Email Address"
        />
        <TInput
        style="margin-bottom: 10px;"
          type="password"
          name="password"
          v-model="user.password"
          :errors="errors"
          placeholder="Password"
        />
        <TInput
          type="password"
          name="password_confirmation"
          v-model="user.password_confirmation"
          :errors="errors"
          placeholder="Confirm Password"
          inputClass="rounded-b-md"
        />
      </div>

      <div>
        <TButtonLoading :loading="loading" class="w-full relative justify-center">
          Sign up
        </TButtonLoading>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import store from "../store";
import { useRouter } from "vue-router";
import TButtonLoading from "../components/core/TButtonLoading.vue";
import TInput from "../components/core/TInput.vue";
import Alert from "../components/Alert.vue";

const router = useRouter();
const user = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});
const loading = ref(false);
const errors = ref({});

function register(ev) {
  ev.preventDefault();
  loading.value = true;
  errors.value = {}; // Clear previous errors

  store
    .dispatch("register", user.value)
    .then(() => {
      loading.value = false;
      router.push({ name: "Dashboard" });
    })
    .catch((error) => {
      loading.value = false;
      if (error.response && error.response.status === 422) {
        errors.value = error.response.data.errors;
      } else {
        console.error("Registration error:", error);
      }
    });
}
</script>
