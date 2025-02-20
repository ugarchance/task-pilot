import * as z from 'zod';

const urlSchema = z.string().url('Geçerli bir URL giriniz').optional().or(z.literal(''));

export const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'İsim en az 2 karakter olmalıdır')
    .max(50, 'İsim en fazla 50 karakter olabilir'),
  bio: z
    .string()
    .max(500, 'Biyografi en fazla 500 karakter olabilir')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .max(100, 'Konum en fazla 100 karakter olabilir')
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .max(100, 'Şirket adı en fazla 100 karakter olabilir')
    .optional()
    .or(z.literal('')),
  website: urlSchema,
  socialLinks: z.object({
    github: urlSchema,
    twitter: urlSchema,
    linkedin: urlSchema,
  }).optional(),
});

export const profilePreferencesSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string(),
});

export const profileSecuritySchema = z.object({
  currentPassword: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  newPassword: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  confirmNewPassword: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmNewPassword"],
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type ProfilePreferencesFormValues = z.infer<typeof profilePreferencesSchema>;
export type ProfileSecurityFormValues = z.infer<typeof profileSecuritySchema>;
