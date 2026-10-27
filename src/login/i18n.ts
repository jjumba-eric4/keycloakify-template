/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            footerCopyright: "© {0} All rights reserved.",
            passkeyRegisterIntro: "Create a passkey to sign in next time with your fingerprint, face, or device PIN instead of a password.",
            passkeyAuthenticateIntro: "Use your fingerprint, face, or security key to verify it's you."
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
