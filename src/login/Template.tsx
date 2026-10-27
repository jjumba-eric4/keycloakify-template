import { useEffect, type ReactNode } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { cn } from "cn";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { Notice } from "@/components/shared/notice";
import "../styles/shadcn.css";

/** The brand panel headline/subtext changes per page — add a case here as each page is restyled. */
function getBrandCopy(pageId: KcContext["pageId"], i18n: I18n, appName: string) {
    const { msg } = i18n;

    switch (pageId) {
        case "login.ftl":
            return { headline: msg("brandHeadline_login"), subtext: msg("brandSubtext_login", appName) };
        case "register.ftl":
            return { headline: msg("brandHeadline_register"), subtext: msg("brandSubtext_register", appName) };
        case "login-reset-password.ftl":
            return { headline: msg("brandHeadline_loginResetPassword"), subtext: msg("brandSubtext_loginResetPassword") };
        case "login-update-password.ftl":
            return { headline: msg("brandHeadline_loginUpdatePassword"), subtext: msg("brandSubtext_loginUpdatePassword") };
        case "login-otp.ftl":
            return { headline: msg("brandHeadline_loginOtp"), subtext: msg("brandSubtext_loginOtp") };
        case "login-verify-email.ftl":
            return { headline: msg("brandHeadline_loginVerifyEmail"), subtext: msg("brandSubtext_loginVerifyEmail") };
        case "login-config-totp.ftl":
            return { headline: msg("brandHeadline_loginConfigTotp"), subtext: msg("brandSubtext_loginConfigTotp") };
        case "select-authenticator.ftl":
            return { headline: msg("brandHeadline_selectAuthenticator"), subtext: msg("brandSubtext_selectAuthenticator") };
        case "webauthn-authenticate.ftl":
            return { headline: msg("brandHeadline_webauthnAuthenticate"), subtext: msg("brandSubtext_webauthnAuthenticate") };
        case "webauthn-register.ftl":
            return { headline: msg("brandHeadline_webauthnRegister"), subtext: msg("brandSubtext_webauthnRegister") };
        case "webauthn-error.ftl":
            return { headline: msg("brandHeadline_webauthnError"), subtext: msg("brandSubtext_webauthnError") };
        case "login-update-profile.ftl":
            return { headline: msg("brandHeadline_loginUpdateProfile"), subtext: msg("brandSubtext_loginUpdateProfile") };
        case "login-idp-link-confirm.ftl":
            return { headline: msg("brandHeadline_loginIdpLinkConfirm"), subtext: msg("brandSubtext_loginIdpLinkConfirm") };
        case "terms.ftl":
            return { headline: msg("brandHeadline_terms"), subtext: msg("brandSubtext_terms") };
        case "logout-confirm.ftl":
            return { headline: msg("brandHeadline_logoutConfirm"), subtext: msg("brandSubtext_logoutConfirm") };
        case "login-page-expired.ftl":
            return { headline: msg("brandHeadline_loginPageExpired"), subtext: msg("brandSubtext_loginPageExpired") };
        case "login-username.ftl":
            return { headline: msg("brandHeadline_loginUsername"), subtext: msg("brandSubtext_loginUsername") };
        case "select-organization.ftl":
            return { headline: msg("brandHeadline_selectOrganization"), subtext: msg("brandSubtext_selectOrganization") };
        default:
            // error.ftl, info.ftl, and any stock/unejected page: content is too
            // variable (server-driven message) for one fixed headline, so just
            // avoid repeating the wordmark text verbatim above it.
            return { headline: msg("brandHeadline_default", appName), subtext: undefined };
    }
}

/** One-line muted instruction shown under the h1. Add a case per page as needed. */
function getPageSubtitle(kcContext: KcContext, i18n: I18n): ReactNode | undefined {
    const { msg } = i18n;

    switch (kcContext.pageId) {
        case "login-reset-password.ftl":
            return kcContext.realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction");
        default:
            return undefined;
    }
}

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        kcContext,
        i18n,
        doUseDefaultCss,
        children
    } = props;

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction, pageId } = kcContext;

    const appName = realm.displayName || realm.name;

    const { headline: brandHeadline, subtext: brandSubtext } = getBrandCopy(pageId, i18n, appName);
    const pageSubtitle = getPageSubtitle(kcContext, i18n);

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", appName);
    }, []);

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-wrap items-stretch gap-4 bg-background p-4">
            <aside className="relative flex min-h-[260px] flex-[1_1_480px] items-end overflow-hidden rounded-3xl bg-panel text-panel-foreground">
                <svg
                    className="pointer-events-none absolute -top-10 -right-10 opacity-60"
                    width="320"
                    height="320"
                    viewBox="0 0 320 320"
                    fill="none"
                    aria-hidden="true"
                >
                    <circle cx="200" cy="120" r="140" stroke="var(--panel-accent)" strokeOpacity="0.18" strokeWidth="1" />
                    <circle cx="200" cy="120" r="100" stroke="var(--panel-accent)" strokeOpacity="0.18" strokeWidth="1" />
                    <circle cx="200" cy="120" r="60" stroke="var(--panel-accent)" strokeOpacity="0.18" strokeWidth="1" />
                </svg>
                <div className="relative z-10 flex w-full flex-col gap-5 p-12">
                    <div className="inline-flex items-center gap-2.5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 font-mono text-[15px] font-semibold">
                            {appName.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-base font-semibold tracking-tight">{appName}</span>
                    </div>
                    <h2 className="text-[clamp(28px,4vw,40px)] leading-[1.1] font-semibold tracking-tight">{brandHeadline ?? appName}</h2>
                    {brandSubtext && <p className="max-w-[36ch] text-[15px] text-panel-muted-foreground">{brandSubtext}</p>}
                    <div className="mt-3 text-sm text-panel-muted-foreground">{msg("brandFooter", String(new Date().getFullYear()))}</div>
                </div>
            </aside>
            <main className="flex flex-[999_1_400px] items-center justify-center px-4 py-8">
                <div className="w-full min-w-0 max-w-[420px]">
                    {enabledLanguages.length > 1 && (
                        <div className="mb-4 flex justify-end">
                            <details id="kc-locale" className="relative">
                                <summary
                                    id="kc-current-locale-link"
                                    className="cursor-pointer rounded-full border border-input px-3.5 py-1.5 text-sm text-muted-foreground"
                                    aria-label={msgStr("languages")}
                                >
                                    {currentLanguage.label}
                                </summary>
                                <ul
                                    role="menu"
                                    id="language-switch1"
                                    className="absolute right-0 z-10 mt-1 max-h-60 w-max overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                                    aria-labelledby="kc-current-locale-link"
                                >
                                    {enabledLanguages.map(({ languageTag, label, href }, i) => (
                                        <li key={languageTag} role="none">
                                            <a
                                                role="menuitem"
                                                id={`language-${i + 1}`}
                                                href={href}
                                                className="block rounded-sm px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                                            >
                                                {label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </div>
                    )}

                    {auth !== undefined && auth.showUsername && !auth.showResetCredentials ? (
                        <div className="mb-2 flex items-center justify-between gap-3 text-[15px]">
                            <span id="kc-attempted-username">{auth.attemptedUsername}</span>
                            <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                {msg("restartLoginTooltip")}
                            </a>
                        </div>
                    ) : (
                        <header className="mb-2">
                            <h1 id="kc-page-title" className="text-3xl font-semibold tracking-tight text-foreground">
                                {headerNode}
                            </h1>
                            {pageSubtitle && <p className="mt-1 text-[15px] text-muted-foreground">{pageSubtitle}</p>}
                            {displayRequiredFields && (
                                <p className="mt-1 text-[15px] text-muted-foreground">
                                    <span aria-hidden="true">*</span> {msg("requiredFields")}
                                </p>
                            )}
                        </header>
                    )}

                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                        <div className="my-4">
                            <Notice variant={message.type}>
                                <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                            </Notice>
                        </div>
                    )}

                    {children}

                    {auth !== undefined && auth.showTryAnotherWayLink && (
                        <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                            <input type="hidden" name="tryAnotherWay" value="on" />
                            <a
                                href="#"
                                id="try-another-way"
                                onClick={event => {
                                    document.forms["kc-select-try-another-way-form" as never].requestSubmit();
                                    event.preventDefault();
                                    return false;
                                }}
                            >
                                {msg("doTryAnotherWay")}
                            </a>
                        </form>
                    )}

                    {socialProvidersNode}

                    {displayInfo && <div className={cn("mt-5 text-center text-sm text-muted-foreground")}>{infoNode}</div>}
                </div>
            </main>
        </div>
    );
}
