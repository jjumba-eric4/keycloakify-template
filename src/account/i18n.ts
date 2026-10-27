/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/account";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            // Not part of the account message set (only login's) — the password
            // reveal toggle on the change-password page needs the same labels.
            showPassword: "Show password",
            hidePassword: "Hide password",
            // Shown on the Applications page when Keycloak returns a consent/grant
            // entry whose client was since deleted from the realm (client comes
            // back null even though kcContext's type claims it's always present).
            unknownApplication: "Unknown application"
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
