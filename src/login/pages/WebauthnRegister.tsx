import { KeyRound } from "lucide-react";
import { useScript } from "keycloakify/login/pages/WebauthnRegister.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";

export default function WebauthnRegister(props: PageProps<Extract<KcContext, { pageId: "webauthn-register.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { url, isSetRetry, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = i18n;

    const authButtonId = "authenticateWebAuthnButton";

    useScript({ authButtonId, kcContext, i18n });

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("webauthn-registration-title")}>
            <div className="mb-6 flex items-start gap-3.5 rounded-xl border bg-card p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <KeyRound className="size-5" />
                </span>
                <p className="pt-1.5 text-[15px] text-foreground">{msg("passkeyRegisterIntro")}</p>
            </div>

            <form id="register" className="flex flex-col gap-5" action={url.loginAction} method="post">
                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                <input type="hidden" id="attestationObject" name="attestationObject" />
                <input type="hidden" id="publicKeyCredentialId" name="publicKeyCredentialId" />
                <input type="hidden" id="authenticatorLabel" name="authenticatorLabel" />
                <input type="hidden" id="transports" name="transports" />
                <input type="hidden" id="authenticatorAttachment" name="authenticatorAttachment" />
                <input type="hidden" id="error" name="error" />

                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" className="size-4 rounded-[4px] border border-input accent-primary" />
                    {msg("logoutOtherSessions")}
                </label>
            </form>

            {/* Not nested in the form above: the WebAuthn script intercepts this click, runs the
                async navigator.credentials.create() ceremony, fills the hidden fields, then submits
                the form itself. Being outside the <form> keeps a stray native submit from firing
                before that ceremony resolves. */}
            <Button type="button" id={authButtonId} className="mt-5 w-full">
                {msgStr("doRegisterSecurityKey")}
            </Button>

            {!isSetRetry && isAppInitiatedAction && (
                <form action={url.loginAction} id="kc-webauthn-settings-form" method="post" className="mt-2.5">
                    <Button type="submit" id="cancelWebAuthnAIA" name="cancel-aia" value="true" variant="outline" className="w-full">
                        {msg("doCancel")}
                    </Button>
                </form>
            )}
        </Template>
    );
}
