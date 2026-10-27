import { useEffect, type ReactNode } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { cn } from "cn";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { Notice } from "@/components/shared/notice";
import "../styles/shadcn.css";

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

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    const appName = realm.displayName || realm.name;

    const pageSubtitle = getPageSubtitle(kcContext, i18n);

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", appName);
    }, []);

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-background px-4 py-10">
            {/* Soft gradient band, ClickUp-style — purely decorative, fades into the page. */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-72"
                style={{
                    background:
                        "radial-gradient(60% 120% at 15% 0%, color-mix(in oklch, var(--destructive) 18%, transparent) 0%, transparent 60%)," +
                        "radial-gradient(50% 120% at 50% 0%, color-mix(in oklch, var(--primary) 20%, transparent) 0%, transparent 60%)," +
                        "radial-gradient(60% 120% at 90% 0%, color-mix(in oklch, var(--ring) 16%, transparent) 0%, transparent 60%)",
                    maskImage: "linear-gradient(black, transparent)",
                    WebkitMaskImage: "linear-gradient(black, transparent)"
                }}
            />

            {enabledLanguages.length > 1 && (
                <div className="relative z-10 flex w-full max-w-[400px] justify-end">
                    <details id="kc-locale" className="relative">
                        <summary
                            id="kc-current-locale-link"
                            className="cursor-pointer rounded-full border border-input bg-background px-3.5 py-1.5 text-sm text-muted-foreground"
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

            <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center">
                <div className="w-full max-w-[380px]">
                    <div className="mb-7 flex flex-col items-center gap-2.5 text-center">
                        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary font-mono text-base font-semibold text-primary-foreground">
                            {appName.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-lg font-semibold tracking-tight text-foreground">{appName}</span>
                    </div>

                    {auth !== undefined && auth.showUsername && !auth.showResetCredentials ? (
                        <div className="mb-2 flex items-center justify-between gap-3 text-[15px]">
                            <span id="kc-attempted-username">{auth.attemptedUsername}</span>
                            <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                {msg("restartLoginTooltip")}
                            </a>
                        </div>
                    ) : (
                        <header className="mb-6 text-center">
                            <h1 id="kc-page-title" className="text-2xl font-semibold tracking-tight text-foreground">
                                {headerNode}
                            </h1>
                            {pageSubtitle && <p className="mt-1.5 text-sm text-muted-foreground">{pageSubtitle}</p>}
                            {displayRequiredFields && (
                                <p className="mt-1.5 text-sm text-muted-foreground">
                                    <span aria-hidden="true">*</span> {msg("requiredFields")}
                                </p>
                            )}
                        </header>
                    )}

                    {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                        <div className="mb-5">
                            <Notice variant={message.type}>
                                <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                            </Notice>
                        </div>
                    )}

                    {children}

                    {auth !== undefined && auth.showTryAnotherWayLink && (
                        <form id="kc-select-try-another-way-form" action={url.loginAction} method="post" className="mt-4 text-center text-sm">
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
            </div>

            <footer className="relative z-10 mt-10 text-xs text-muted-foreground">
                {msg("footerCopyright", String(new Date().getFullYear()))}
            </footer>
        </div>
    );
}
