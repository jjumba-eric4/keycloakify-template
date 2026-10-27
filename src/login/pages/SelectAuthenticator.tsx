import { ChevronRight, KeyRound } from "lucide-react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function SelectAuthenticator(props: PageProps<Extract<KcContext, { pageId: "select-authenticator.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;
    const { url, auth } = kcContext;

    const { msg, advancedMsg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} displayInfo={false} headerNode={msg("loginChooseAuthenticator")}>
            <form id="kc-select-credential-form" className="flex flex-col gap-2.5" action={url.loginAction} method="post">
                {auth.authenticationSelections.map((authenticationSelection, i) => (
                    <button
                        key={i}
                        type="submit"
                        name="authenticationExecution"
                        value={authenticationSelection.authExecId}
                        className="flex w-full items-center gap-3.5 rounded-xl border bg-card p-3.5 text-left hover:bg-accent"
                    >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                            <KeyRound className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold">{advancedMsg(authenticationSelection.displayName)}</span>
                            <span className="mt-0.5 block text-[13px] text-muted-foreground">{advancedMsg(authenticationSelection.helpText)}</span>
                        </span>
                        <ChevronRight className="size-[18px] shrink-0 text-muted-foreground" />
                    </button>
                ))}
            </form>
        </Template>
    );
}
