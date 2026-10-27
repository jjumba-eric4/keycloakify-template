import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/Login.useScript";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/shared/form-field";
import { PasswordInput } from "@/components/shared/password-input";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField, enableWebAuthnConditionalUI, authenticators } =
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
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration-container">
                    <div id="kc-registration">
                        {msg("noAccount")}{" "}
                        <a tabIndex={8} href={url.registrationUrl}>
                            {msg("doRegister")}
                        </a>
                    </div>
                </div>
            }
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
                            errorHtml={
                                messagesPerField.existsError("username", "password")
                                    ? kcSanitize(messagesPerField.getFirstError("username", "password"))
                                    : undefined
                            }
                        >
                            <Input
                                tabIndex={2}
                                id="username"
                                name="username"
                                defaultValue={login.username ?? ""}
                                type="text"
                                autoFocus
                                autoComplete={enableWebAuthnConditionalUI ? "username webauthn" : "username"}
                                aria-invalid={messagesPerField.existsError("username", "password")}
                            />
                        </FormField>
                    )}

                    <FormField
                        htmlFor="password"
                        label={msg("password")}
                        errorHtml={
                            usernameHidden && messagesPerField.existsError("username", "password")
                                ? kcSanitize(messagesPerField.getFirstError("username", "password"))
                                : undefined
                        }
                    >
                        <PasswordInput
                            labelShow={msgStr("showPassword")}
                            labelHide={msgStr("hidePassword")}
                            tabIndex={3}
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            aria-invalid={messagesPerField.existsError("username", "password")}
                        />
                    </FormField>

                    <div className="flex items-center justify-between gap-3 -mt-1">
                        {realm.rememberMe && !usernameHidden && (
                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <input
                                    tabIndex={5}
                                    id="rememberMe"
                                    name="rememberMe"
                                    type="checkbox"
                                    defaultChecked={!!login.rememberMe}
                                    className="size-4 rounded-[4px] border border-input accent-primary"
                                />
                                {msg("rememberMe")}
                            </label>
                        )}
                        {realm.resetPasswordAllowed && (
                            <a tabIndex={6} href={url.loginResetCredentialsUrl} className="text-sm font-medium">
                                {msg("doForgotPassword")}
                            </a>
                        )}
                    </div>

                    <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                    <Button tabIndex={7} disabled={isLoginButtonDisabled} className="w-full" type="submit" name="login" id="kc-login">
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
