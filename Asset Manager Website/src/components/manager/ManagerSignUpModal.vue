<script setup>
import { Form, FormField } from "@primevue/forms";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import Message from "primevue/message";
import { useRouter } from "vue-router";

const emit = defineEmits(["register"]);

const onFormSubmit = (formData) => {
    emit("register", formData);
};
</script>

<template>
    <Form
        :resolver
        @submit="onFormSubmit"
        class="flex flex-col gap-4 w-full sm:w-56"
    >
        <h1 class="text-2xl font-bold text-center mb-6 text-black">
            Manager Sign Up
        </h1>
        <FormField
            v-slot="$field"
            as="section"
            name="email"
            initialValue=""
            class="flex flex-col gap-2"
        >
            <InputText type="text" placeholder="Email" />
            <Message
                v-if="$field?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $field.error?.message }}</Message
            >
        </FormField>
        <FormField
            v-slot="$field"
            as="section"
            name="fullName"
            initialValue=""
            class="flex flex-col gap-2"
        >
            <InputText type="text" placeholder="Full Name" />
            <Message
                v-if="$field?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $field.error?.message }}</Message
            >
        </FormField>
        <FormField v-slot="$field" asChild name="password" initialValue="">
            <section class="flex flex-col gap-2">
                <Password
                    type="text"
                    placeholder="Password"
                    :feedback="false"
                    toggleMask
                    fluid
                />
                <Message
                    v-if="$field?.invalid"
                    severity="error"
                    size="small"
                    variant="simple"
                    >{{ $field.error?.message }}</Message
                >
            </section>
        </FormField>
        <Button type="submit" severity="primary" label="Submit" />
    </Form>
</template>
