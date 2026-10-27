import { Fragment } from "react";
import { KeyRound } from "lucide-react";
import { useScript } from "keycloakify/login/pages/WebauthnAuthenticate.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";

export default function WebauthnAuthenticate(props: PageProps<Extract<KcContext, { pageId: "webauthn-authenticate.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { url, realm, registrationDisabled, authenticators, shouldDisplayAuthenticators } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const authButtonId = "authenticateWebAuthnButton";

    useScript({ authButtonId, kcContext, i18n });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayInfo={realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration">
                    {msg("noAccount")} <a tabIndex={6} href={url.registrationUrl}>{msg("doRegister")}</a>
                </div>
            }
            headerNode={msg("webauthn-login-title")}
        >
            <div className="mb-5 flex items-start gap-3.5 rounded-xl border bg-card p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <KeyRound className="size-5" />
                </span>
                <p className="pt-1.5 text-[15px] text-foreground">{msg("passkeyAuthenticateIntro")}</p>
            </div>

            <form id="webauth" action={url.loginAction} method="post">
                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                <input type="hidden" id="authenticatorData" name="authenticatorData" />
                <input type="hidden" id="signature" name="signature" />
                <input type="hidden" id="credentialId" name="credentialId" />
                <input type="hidden" id="userHandle" name="userHandle" />
                <input type="hidden" id="error" name="error" />
            </form>

            {authenticators && (
                <>
                    <form id="authn_select">
                        {authenticators.authenticators.map(authenticator => (
                            <input key={authenticator.credentialId} type="hidden" name="authn_use_chk" value={authenticator.credentialId} />
                        ))}
                    </form>

                    {shouldDisplayAuthenticators && (
                        <div className="mb-5 flex flex-col gap-2.5">
                            {authenticators.authenticators.length > 1 && (
                                <p className="text-[13px] text-muted-foreground">{msg("webauthn-available-authenticators")}</p>
                            )}
                            {authenticators.authenticators.map((authenticator, i) => (
                                <div key={i} className="flex items-center gap-3.5 rounded-xl border bg-card p-3.5">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                                        <KeyRound className="size-5" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span id={`kc-webauthn-authenticator-label-${i}`} className="block text-sm font-semibold">
                                            {advancedMsg(authenticator.label)}
                                        </span>
                                        <span className="mt-0.5 block text-[13px] text-muted-foreground">
                                            {authenticator.transports.displayNameProperties?.length ? (
                                                <span id={`kc-webauthn-authenticator-transport-${i}`}>
                                                    {authenticator.transports.displayNameProperties
                                                        .map((displayNameProperty, i, arr) => ({ displayNameProperty, hasNext: i !== arr.length - 1 }))
                                                        .map(({ displayNameProperty, hasNext }) => (
                                                            <Fragment key={displayNameProperty}>
                                                                {advancedMsg(displayNameProperty)}
                                                                {hasNext && <span>, </span>}
                                                            </Fragment>
                                                        ))}
                                                    {" · "}
                                                </span>
                                            ) : null}
                                            <span id={`kc-webauthn-authenticator-createdlabel-${i}`}>{msg("webauthn-createdAt-label")}</span>{" "}
                                            <span id={`kc-webauthn-authenticator-created-${i}`}>{authenticator.createdAt}</span>
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            <Button id={authButtonId} type="button" autoFocus className="w-full">
                {msgStr("webauthn-doAuthenticate")}
            </Button>
        </Template>
    );
}
