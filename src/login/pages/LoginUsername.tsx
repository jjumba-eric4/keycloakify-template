import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/LoginUsername.useScript";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/shared/form-field";

export default function LoginUsername(props: PageProps<Extract<KcContext, { pageId: "login-username.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { social, realm, url, usernameHidden, login, registrationDisabled, messagesPerField, enableWebAuthnConditionalUI, authenticators } =
        kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const webAuthnButtonId = "authenticateWebAuthnButton";

    useScript({ webAuthnButtonId, kcContext, i18n });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayMessage={!messagesPerField.existsError("username")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration">
                    {msg("noAccount")} <a tabIndex={6} href={url.registrationUrl}>{msg("doRegister")}</a>
                </div>
            }
            headerNode={msg("doLogIn")}
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div id="kc-social-providers" className="mt-6">
                            <Separator className="mb-4" />
                            <p className="mb-3 text-center text-sm text-muted-foreground">{msg("identity-provider-login-label")}</p>
                            <ul className="flex flex-col gap-2.5">
                                {social.providers.map(p => (
                                    <li key={p.alias}>
                                        <a
                                            id={`social-${p.alias}`}
                                            href={p.loginUrl}
                                            className="flex h-9 items-center justify-center gap-2.5 rounded-md border border-input text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                                        >
                                            {p.iconClasses && <i className={p.iconClasses} aria-hidden="true"></i>}
                                            <span dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}></span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            }
        >
            {realm.password && (
                <form
                    id="kc-form-login"
                    className="flex flex-col gap-5"
                    onSubmit={() => {
                        setIsLoginButtonDisabled(true);
                        return true;
                    }}
                    action={url.loginAction}
                    method="post"
                >
                    {!usernameHidden && (
                        <FormField
                            htmlFor="username"
                            label={
                                !realm.loginWithEmailAllowed
                                    ? msg("username")
                                    : !realm.registrationEmailAsUsername
                                      ? msg("usernameOrEmail")
                                      : msg("email")
                            }
                            errorHtml={messagesPerField.existsError("username") ? kcSanitize(messagesPerField.getFirstError("username")) : undefined}
                        >
                            <Input
                                tabIndex={2}
                                id="username"
                                name="username"
                                defaultValue={login.username ?? ""}
                                type="text"
                                autoFocus
                                autoComplete={enableWebAuthnConditionalUI ? "username webauthn" : "username"}
                                aria-invalid={messagesPerField.existsError("username")}
                            />
                        </FormField>
                    )}

                    {realm.rememberMe && !usernameHidden && (
                        <label className="-mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <input
                                tabIndex={3}
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                defaultChecked={!!login.rememberMe}
                                className="size-4 rounded-[4px] border border-input accent-primary"
                            />
                            {msg("rememberMe")}
                        </label>
                    )}

                    <Button tabIndex={4} disabled={isLoginButtonDisabled} className="w-full" name="login" id="kc-login" type="submit">
                        {msgStr("doLogIn")}
                    </Button>
                </form>
            )}

            {enableWebAuthnConditionalUI && (
                <>
                    <form id="webauth" action={url.loginAction} method="post">
                        <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                        <input type="hidden" id="authenticatorData" name="authenticatorData" />
                        <input type="hidden" id="signature" name="signature" />
                        <input type="hidden" id="credentialId" name="credentialId" />
                        <input type="hidden" id="userHandle" name="userHandle" />
                        <input type="hidden" id="error" name="error" />
                    </form>

                    {authenticators !== undefined && authenticators.authenticators.length !== 0 && (
                        <form id="authn_select">
                            {authenticators.authenticators.map((authenticator, i) => (
                                <input key={i} type="hidden" name="authn_use_chk" readOnly value={authenticator.credentialId} />
                            ))}
                        </form>
                    )}

                    <Button id={webAuthnButtonId} type="button" variant="outline" className="mt-4 w-full">
                        {msgStr("passkey-doAuthenticate")}
                    </Button>
                </>
            )}
        </Template>
    );
}
