/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            brandHeadline_login: "Welcome back",
            brandSubtext_login: "Sign in to continue to {0}.",
            brandHeadline_register: "Create your account",
            brandSubtext_register: "Join {0} in a couple of minutes.",
            brandHeadline_loginResetPassword: "Reset your password",
            brandSubtext_loginResetPassword: "Enter your email and we'll send you a reset link.",
            brandHeadline_loginUpdatePassword: "Set a new password",
            brandSubtext_loginUpdatePassword: "Choose something strong you haven't used before.",
            brandHeadline_loginOtp: "Verify it's you",
            brandSubtext_loginOtp: "Enter the code from your authenticator app.",
            brandHeadline_loginVerifyEmail: "Check your inbox",
            brandSubtext_loginVerifyEmail: "Confirm your email to finish setting up your account.",
            brandHeadline_loginConfigTotp: "Set up two-factor authentication",
            brandSubtext_loginConfigTotp: "Add an extra layer of security to your account.",
            brandHeadline_selectAuthenticator: "Choose a sign-in method",
            brandSubtext_selectAuthenticator: "Pick how you'd like to verify it's you.",
            brandHeadline_webauthnAuthenticate: "Use your security key",
            brandSubtext_webauthnAuthenticate: "Verify it's you with a passkey or security key.",
            brandHeadline_webauthnRegister: "Set up a passkey",
            brandSubtext_webauthnRegister: "Sign in faster next time without a password.",
            brandHeadline_webauthnError: "We hit a snag",
            brandSubtext_webauthnError: "That security key request didn't go through.",
            brandHeadline_loginUpdateProfile: "Update your profile",
            brandSubtext_loginUpdateProfile: "Keep your account details up to date.",
            brandHeadline_loginIdpLinkConfirm: "Link your account",
            brandSubtext_loginIdpLinkConfirm: "Connect this sign-in method to your existing account.",
            brandHeadline_terms: "Terms of service",
            brandSubtext_terms: "Please review and accept to continue.",
            brandHeadline_logoutConfirm: "Sign out",
            brandSubtext_logoutConfirm: "You're about to sign out of your account.",
            brandHeadline_loginPageExpired: "This link expired",
            brandSubtext_loginPageExpired: "Start over to continue where you left off.",
            brandHeadline_loginUsername: "Sign in to your organization",
            brandSubtext_loginUsername: "Enter your username to continue.",
            brandHeadline_selectOrganization: "Choose your organization",
            brandSubtext_selectOrganization: "Select which workspace you'd like to continue to.",
            brandHeadline_default: "Welcome to {0}",
            brandFooter: "© {0} All rights reserved.",
            passkeyRegisterIntro: "Create a passkey to sign in next time with your fingerprint, face, or device PIN instead of a password.",
            passkeyAuthenticateIntro: "Use your fingerprint, face, or security key to verify it's you."
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
