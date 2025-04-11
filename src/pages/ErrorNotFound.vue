<template>
  <q-page class="flex flex-center bg-grey-10 text-white">
    <div class="text-center q-pa-md">
      <q-icon name="sym_o_sentiment_dissatisfied" color="primary" size="64px" />
      <div class="text-h4 text-gold q-mt-md">404 - Page Not Found</div>
      <div class="text-body2 text-grey-4 q-mt-sm">This realm may be lost… or never existed.</div>

      <div class="q-mt-lg">
        <q-btn color="primary" icon="sym_o_home" label="Return Home" to="/" unelevated no-caps />
        <q-btn
          flat
          color="grey-4"
          label="Login"
          to="/auth/login"
          icon="sym_o_login"
          class="q-ml-sm"
          no-caps
        />
      </div>
    </div>
  </q-page>
</template>
