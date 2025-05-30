<template>
  <q-page class="flex flex-center text-white">
    <transition appear name="fade-slide">
      <q-card
        v-show="loaded"
        flat
        class="q-pa-xl text-white auth-card"
        :class="$q.dark.isActive ? 'bg-1e text-white' : 'bg-1c text-black'"
      >
        <div class="text-h5 text-gold text-center q-mb-sm">Welcome Back</div>
        <div class="text-caption text-center q-mb-lg">Sign in to continue your journey</div>

        <q-input
          v-model="email"
          label="Email"
          type="email"
          filled
          dense
          class="q-mb-md"
          color="primary"
        />
        <q-input
          v-model="password"
          label="Password"
          type="password"
          filled
          dense
          class="q-mb-md"
          color="primary"
        />

        <q-btn
          label="Login"
          color="primary"
          icon="sym_o_login"
          class="full-width q-mb-sm"
          :loading="loading"
          unelevated
          @click="login"
        />

        <q-banner v-if="error" dense class="bg-red-5 text-white q-mt-md rounded-borders">
          {{ error }}
        </q-banner>

        <div class="text-caption text-grey-9 text-center q-mt-md">
          Don’t have an account?
          <q-btn flat dense size="sm" to="/auth/register" label="Register" color="primary" />
        </div>
      </q-card>
    </transition>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useUserStore } from '@/stores/user-store'
import { notifySuccess } from 'src/utils/notify'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const router = useRouter()
const { login: authLogin } = useAuth()
const userStore = useUserStore()
const loaded = ref(false)

async function login() {
  loading.value = true
  error.value = ''
  try {
    const session = await authLogin(email.value, password.value)
    if (session) console.info(`Session successfully started!`)
    await userStore.fetchProfile(session.user.id)
    notifySuccess('Login successful. Redirecting...')
    router.push('/explore')
  } catch (err) {
    error.value = err.message || 'Login failed.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loaded.value = true
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.auth-card {
  min-width: 300px;
  max-width: 400px;
  border-radius: 12px;
}
</style>
