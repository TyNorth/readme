<template>
  <q-page class="flex flex-center text-white">
    <transition appear name="fade-slide">
      <q-card
        v-show="loaded"
        flat
        class="q-pa-xl text-white auth-card"
        :class="$q.dark.isActive ? 'bg-1e text-white' : 'bg-1c text-black'"
      >
        <div class="text-h5 text-gold text-center q-mb-sm">Request a Lorelight Account</div>
        <div class="text-caption text-center q-mb-lg">
          Fill out the form below. If approved, your account will be created with the password you
          provide.
        </div>

        <q-form @submit.prevent="handleRequestAccount">
          <q-input
            v-model="formData.username"
            label="Desired Username *"
            filled
            dense
            class="q-mb-md"
            color="primary"
            :dark="$q.dark.isActive"
            lazy-rules
            :rules="[(val) => !!val || 'Username is required']"
            prepend-icon="sym_o_person"
          />
          <q-input
            v-model="formData.email"
            label="Your Email Address *"
            type="email"
            filled
            dense
            class="q-mb-md"
            color="primary"
            :dark="$q.dark.isActive"
            lazy-rules
            :rules="[
              (val) => !!val || 'Email is required',
              (val) => /.+@.+\..+/.test(val) || 'Invalid email format',
            ]"
            prepend-icon="sym_o_email"
          />
          <q-input
            v-model="formData.password"
            label="Desired Password *"
            type="password"
            filled
            dense
            class="q-mb-md"
            color="primary"
            :dark="$q.dark.isActive"
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
            dense
            class="q-mb-md"
            color="primary"
            :dark="$q.dark.isActive"
            lazy-rules
            :rules="[
              (val) => !!val || 'Please confirm password',
              (val) => val === formData.password || 'Passwords do not match',
            ]"
            prepend-icon="sym_o_lock_reset"
          />
          <q-input
            v-model="formData.reason"
            label="Reason for Request (Optional)"
            type="textarea"
            filled
            dense
            autogrow
            class="q-mb-md"
            color="primary"
            :dark="$q.dark.isActive"
            prepend-icon="sym_o_help_outline"
          />

          <q-btn
            label="Submit Request"
            type="submit"
            color="primary"
            icon="sym_o_send"
            class="full-width q-mb-sm q-mt-md"
            :loading="loading"
            unelevated
            size="md"
          />
        </q-form>

        <q-banner
          v-if="message"
          dense
          :class="isError ? 'bg-red-5 text-white' : 'bg-green-5 text-white'"
          class="q-mt-md rounded-borders"
        >
          <template v-slot:avatar>
            <q-icon :name="isError ? 'sym_o_error_outline' : 'sym_o_check_circle_outline'" />
          </template>
          {{ message }}
          <template v-slot:action v-if="isError">
            <q-btn flat dense round icon="sym_o_close" @click="message = ''" />
          </template>
        </q-banner>

        <div class="text-caption text-grey-9 text-center q-mt-md">
          Already have an account?
          <q-btn flat dense size="sm" to="/auth/login" label="Login Here" color="primary" />
        </div>
      </q-card>
    </transition>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/boot/supabase'
import { Notify } from 'quasar'

const formData = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  reason: '',
})
const loading = ref(false)
const message = ref('')
const isError = ref(false)
const loaded = ref(false)

async function handleRequestAccount() {
  if (formData.value.password !== formData.value.confirmPassword) {
    message.value = 'Passwords do not match.'
    isError.value = true
    Notify.create({ type: 'negative', message: 'Passwords do not match.' })
    return
  }

  loading.value = true
  message.value = ''
  isError.value = false

  try {
    const { error } = await supabase.from('account_requests').insert([
      {
        email: formData.value.email,
        username: formData.value.username,
        proposed_password: formData.value.password, // Store the proposed password
        reason: formData.value.reason,
      },
    ])

    if (error) {
      if (error.code === '23505') {
        if (error.message.includes('account_requests_email_key')) {
          throw new Error('This email has already been used to request an account.')
        } else if (error.message.includes('account_requests_username_key')) {
          throw new Error('This username has already been used to request an account.')
        }
      }
      throw error
    }

    message.value =
      'Account request submitted! If approved, your account will be created with the password you provided. You will not receive an email notification for approval. Please try logging in later.'
    isError.value = false
    Notify.create({
      type: 'positive',
      message: 'Your request has been submitted successfully!',
      position: 'top',
      timeout: 5000, // Longer timeout for this message
    })
    formData.value = { email: '', username: '', password: '', confirmPassword: '', reason: '' }
  } catch (error) {
    console.error('Account request error:', error)
    message.value = error.message || 'An unknown error occurred while submitting your request.'
    isError.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loaded.value = true
})
</script>

<style scoped>
/* ... (styles remain the same) ... */
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
  max-width: 420px;
  border-radius: 12px;
}
.text-gold {
  color: #c49a43;
}
a {
  text-decoration: none;
}
.text-grey-9 {
  color: #757575;
}
.q-banner .q-icon {
  color: white;
}
</style>
