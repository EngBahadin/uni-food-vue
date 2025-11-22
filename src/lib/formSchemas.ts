import { z } from 'zod'
import type { ComposerTranslation } from 'vue-i18n'

type TFunction = ComposerTranslation

// Helper function to get validation messages
function getValidationMessages(t: TFunction) {
  return {
    required: t('validation.required'),
    email: t('validation.emailInvalid'),
    passwordMin: t('validation.passwordMin'),
    usernameMin: t('validation.usernameMin'),
    passwordsMatch: t('validation.passwordsMatch'),
    confirmPasswordRequired: t('validation.confirmPasswordRequired'),
    currentPasswordRequired: t('validation.currentPasswordRequired'),
    passwordRequired: t('validation.passwordRequired'),
    newEmailRequired: t('validation.newEmailRequired'),
    newEmailDifferent: t('validation.newEmailDifferent'),
    usernameRequired: t('validation.usernameRequired'),
    usernameDifferent: t('validation.usernameDifferent'),
  }
}

// Sign In Schema
export function createSignInSchema(t: TFunction) {
  const messages = getValidationMessages(t)
  return z.object({
    email: z.string().min(1, messages.required).email(messages.email),
    password: z.string().min(1, messages.required).min(8, messages.passwordMin),
  })
}

// Sign Up Schema
export function createSignUpSchema(t: TFunction) {
  const messages = getValidationMessages(t)
  return z
    .object({
      username: z.string().min(1, messages.usernameRequired).trim().min(4, messages.usernameMin),
      email: z.string().min(1, messages.required).email(messages.email),
      password: z.string().min(1, messages.required).trim().min(8, messages.passwordMin),
      re_password: z.string().min(1, messages.confirmPasswordRequired).min(8, messages.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.re_password, {
      message: messages.passwordsMatch,
      path: ['re_password'],
    })
}

// Edit Profile Schema (username only)
export function createEditProfileSchema(t: TFunction, currentUsername: string) {
  const messages = getValidationMessages(t)
  return z
    .object({
      username: z.string().min(1, messages.usernameRequired).trim().min(4, messages.usernameMin),
    })
    .refine(
      (data) => data.username !== currentUsername,
      {
        message: messages.usernameDifferent,
        path: ['username'],
      },
    )
}

// Change Email Schema
export function createChangeEmailSchema(t: TFunction, currentEmail: string) {
  const messages = getValidationMessages(t)
  return z
    .object({
      email: z.string().min(1, messages.newEmailRequired).email(messages.email),
    })
    .refine(
      (data) => data.email !== currentEmail,
      {
        message: messages.newEmailDifferent,
        path: ['email'],
      },
    )
}

// Change Password Schema
export function createChangePasswordSchema(t: TFunction) {
  const messages = getValidationMessages(t)
  return z
    .object({
      current_password: z.string().min(1, messages.currentPasswordRequired).trim().min(8, messages.passwordMin),
      password: z.string().min(1, messages.required).trim().min(8, messages.passwordMin),
      re_password: z.string().min(1, messages.confirmPasswordRequired).min(8, messages.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.re_password, {
      message: messages.passwordsMatch,
      path: ['re_password'],
    })
}

// Forgot Password Schema
export function createForgotPasswordSchema(t: TFunction) {
  const messages = getValidationMessages(t)
  return z.object({
    email: z.string().min(1, messages.required).email(messages.email),
  })
}

// Reset Password Schema
export function createResetPasswordSchema(t: TFunction) {
  const messages = getValidationMessages(t)
  return z
    .object({
      password: z.string().min(1, messages.required).trim().min(8, messages.passwordMin),
      re_password: z.string().min(1, messages.confirmPasswordRequired).min(8, messages.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.re_password, {
      message: messages.passwordsMatch,
      path: ['re_password'],
    })
}

// Delete Account Schema
export function createDeleteAccountSchema(t: TFunction) {
  const messages = getValidationMessages(t)
  return z.object({
    password: z.string().min(1, messages.passwordRequired).trim().min(8, messages.passwordMin),
  })
}

