<template>
  <q-page class="flex flex-center bg-grey-10 text-white">
    <q-card class="q-pa-lg bg-grey-9 text-white" style="min-width: 300px; max-width: 400px">
      <div class="text-h6 q-mb-md text-center">Login to Mythmaker</div>

      <q-input v-model="email" label="Email" filled dense />
      <q-input v-model="password" label="Password" filled dense type="password" class="q-mt-sm" />

      <q-btn
        label="Login"
        color="primary"
        icon="sym_o_login"
        class="q-mt-md full-width"
        :loading="loading"
        @click="login"
      />

      <q-banner v-if="error" dense class="bg-red-5 text-white q-mt-md">
        {{ error }}
      </q-banner>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useUserStore } from '@/stores/user-store'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()
const { login: authLogin } = useAuth()
const userStore = useUserStore()

async function login() {
  loading.value = true
  error.value = ''
  try {
    const session = await authLogin(email.value, password.value)
    await userStore.fetchProfile(session.user.id)
    router.push('/') // redirect post-login
  } catch (err) {
    error.value = err.message || 'Login failed.'
  } finally {
    loading.value = false
  }
}
</script>
