import { useEffect, type ReactNode } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useInitialize } from "keycloakify/account/Template.useInitialize";
import type { TemplateProps } from "keycloakify/account/TemplateProps";
import {
    CreditCard,
    History,
    KeyRound,
    LayoutGrid,
    LogOut,
    Monitor,
    ShieldCheck,
    User
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/shared/notice";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import "../styles/shadcn.css";

type NavItem = {
    key: string;
    href: string;
    label: ReactNode;
    icon: typeof User;
};

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, active, children } = props;

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { url, features, message, referrer } = kcContext;

    useEffect(() => {
        document.title = msgStr("accountManagementTitle");
    }, []);

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    const navItems: NavItem[] = [
        { key: "account", href: url.accountUrl, label: msg("account"), icon: User },
        ...(features.passwordUpdateSupported
            ? [{ key: "password", href: url.passwordUrl, label: msg("password"), icon: KeyRound }]
            : []),
        { key: "totp", href: url.totpUrl, label: msg("authenticator"), icon: ShieldCheck },
        ...(features.identityFederation
            ? [{ key: "social", href: url.socialUrl, label: msg("federatedIdentity"), icon: CreditCard }]
            : []),
        { key: "sessions", href: url.sessionsUrl, label: msg("sessions"), icon: Monitor },
        { key: "applications", href: url.applicationsUrl, label: msg("applications"), icon: LayoutGrid },
        ...(features.log ? [{ key: "log", href: url.logUrl, label: msg("log"), icon: History }] : [])
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <header className="flex h-14 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
                <span className="text-sm font-semibold tracking-tight">{msgStr("accountManagementTitle")}</span>
                <div className="flex items-center gap-4 text-sm">
                    {enabledLanguages.length > 1 && (
                        <details className="relative">
                            <summary className="cursor-pointer text-muted-foreground" id="kc-current-locale-link">
                                {currentLanguage.label}
                            </summary>
                            <ul className="absolute right-0 z-10 mt-1 w-max overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                                {enabledLanguages.map(({ languageTag, label, href }) => (
                                    <li key={languageTag}>
                                        <a href={href} className="block rounded-sm px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    )}
                    {referrer?.url && (
                        <a href={referrer.url} id="referrer" className="text-muted-foreground hover:text-foreground">
                            {msg("backTo", referrer.name)}
                        </a>
                    )}
                    <Button asChild variant="ghost" size="sm">
                        <a href={url.getLogoutUrl()}>
                            <LogOut className="size-4" />
                            {msg("doSignOut")}
                        </a>
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 flex-wrap gap-6 p-4 sm:p-6">
                <nav className="flex-1 basis-[240px] rounded-xl border bg-sidebar p-2 text-sidebar-foreground sm:max-w-[240px]">
                    <ul className="flex flex-col gap-1">
                        {navItems.map(({ key, href, label, icon: Icon }) => (
                            <li key={key}>
                                <a
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium",
                                        active === key
                                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                            : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                                    )}
                                >
                                    <Icon className="size-4" />
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <main className="flex-[999] basis-[480px]">
                    {message !== undefined && (
                        <div className="mb-4">
                            <Notice variant={message.type === "success" || message.type === "error" ? message.type : "info"}>
                                <span dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                            </Notice>
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
