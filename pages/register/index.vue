<script lang="ts" setup>
import { z } from 'zod';
const isSecure = ref(true)
definePageMeta({
  layout: "auth"
})
const form = useForm({
  schema: z.object({
    name: z.string().min(6),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  onSubmit: async (event, d) => {
    await useAuth().register(event.data)
  },

})
</script>

<template>
  <div class="flex flex-col justify-center   h-full">
    <div class="  flex flex-col justify-end items-center">
      <vform :form="form" class="flex flex-col gap-4">
        <UFormGroup label="Name" name="name">
          <UInput placeholder="Full Name" v-model="form.state.name" />
        </UFormGroup>
        <UFormGroup label="Email" name="email">
          <UInput placeholder="Email" v-model="form.state.email" />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UButtonGroup size="sm" orientation="horizontal">
            <UInput placeholder="Password" :type="`${isSecure ? 'password' : 'text'}`" v-model="form.state.password" />
            <UButton :icon="isSecure ? `i-heroicons-eye` : `i-heroicons-eye-slash`" color="gray"
              @click="isSecure = !isSecure" />
          </UButtonGroup>
        </UFormGroup>
        <div class="flex flex-col items-end gap-4">
          <!-- <NuxtLink class="text-xs underline">Forgot Password?</NuxtLink> -->
          <UButton class="w-full justify-center" @click="form.submit.value">Register</UButton>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <hr class="grow">
          <div>or</div>
          <hr class="grow">
        </div>

        <div class="text-xs">Already have an account? click <NuxtLink to="/login" class="underline">here</NuxtLink> to
          login</div>

      </vform>

    </div>


  </div>
</template>

<style scoped></style>
