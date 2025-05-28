<template>
  <q-page padding class="flex flex-center">
    <q-card class="q-pa-md shadow-2" style="width: 400px; max-width: 90vw">
      <q-card-section>
        <div class="text-h5 text-center text-gold q-mb-md">Create Your LoreLight Account</div>
      </q-card-section>

      <q-form @submit.prevent="handleRegister">
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="formData.username"
            label="Username *"
            filled
            dark
            lazy-rules
            :rules="[(val) => !!val || 'Username is required']"
            hint="This will be public."
            prepend-icon="sym_o_person"
          />
          <q-input
            v-model="formData.email"
            label="Email Address *"
            type="email"
            filled
            dark
            lazy-rules
            :rules="[
              (val) => !!val || 'Email is required',
              (val) => /.+@.+\..+/.test(val) || 'Invalid email format',
            ]"
            prepend-icon="sym_o_email"
          />
          <q-input
            v-model="formData.password"
            label="Password *"
            type="password"
            filled
            dark
            lazy-rules
            :rules="[
              (val) => !!val || 'Password is required',
              (val) => val.length >= 6 || 'Password must be at least 6 characters',
            ]"
            hint="Minimum 6 characters."
            prepend-icon="sym_o_lock"
          />
          <q-input
            v-model="formData.confirmPassword"
            label="Confirm Password *"
            type="password"
            filled
            dark
            lazy-rules
            :rules="[
              (val) => !!val || 'Please confirm password',
              (val) => val === formData.password || 'Passwords do not match',
            ]"
            prepend-icon="sym_o_lock_reset"
          />
        </q-card-section>

        <q-card-section>
          <q-btn
            label="Register"
            type="submit"
            color="primary"
            class="full-width q-py-sm"
            :loading="loading"
            size="lg"
          />
        </q-card-section>
      </q-form>

      <q-card-section class="text-center">
        <div class="text-grey-6">
          Already have an account?
          <router-link to="/auth/login" class="text-primary text-weight-medium">
            Log In
          </router-link>
        </div>
      </q-card-section>

      <q-card-section v-if="errorMessage" class="q-pt-none">
        <q-banner inline-actions rounded class="text-white bg-red">
          <template v-slot:avatar>
            <q-icon name="sym_o_error" color="white" />
          </template>
          {{ errorMessage }}
          <template v-slot:action>
            <q-btn flat dense round icon="sym_o_close" @click="errorMessage = ''" />
          </template>
        </q-banner>
      </q-card-section>

      <q-card-section v-if="successMessage" class="q-pt-none">
        <q-banner inline-actions rounded class="text-white bg-green">
          <template v-slot:avatar>
            <q-icon name="sym_o_check_circle" color="white" />
          </template>
          {{ successMessage }}
          <template v-slot:action>
            <q-btn flat dense round icon="sym_o_login" label="Login" to="/auth/login" />
          </template>
        </q-banner>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signUpWithEmail } from '@/supabase/auth' // Assuming this path
import { Notify } from 'quasar'

const router = useRouter()
const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
})
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleRegister() {
  // Simple check (QForm rules handle most)
  if (formData.value.password !== formData.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // We need to update signUpWithEmail to pass username
    const { user } = await signUpWithEmail(
      formData.value.email,
      formData.value.password,
      formData.value.username, // Pass username
    )

    if (user) {
      successMessage.value =
        'Registration successful! Please check your email to confirm your account.'
      Notify.create({
        type: 'positive',
        message: 'Check your email for the confirmation link!',
        position: 'top',
        timeout: 5000,
      })
      // Optionally redirect or clear form
      // router.push('/auth/login')
    } else {
      throw new Error('Sign up failed, user data not returned.')
    }
  } catch (error) {
    console.error('Registration error:', error)
    errorMessage.value = error.message || 'An unknown error occurred during registration.'
    Notify.create({
      type: 'negative',
      message: errorMessage.value,
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.q-card {
  background-color: rgba(30, 30, 30, 0.85); /* Dark semi-transparent */
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.text-gold {
  color: #c49a43; /* Or your specific gold color */
}
a {
  text-decoration: none;
}
</style>
