import { Fragment, useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { otpLogin, url, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} displayMessage={!messagesPerField.existsError("totp")} headerNode={msg("doLogIn")}>
            <form
                id="kc-otp-login-form"
                className="flex flex-col gap-5"
                action={url.loginAction}
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
                method="post"
            >
                {otpLogin.userOtpCredentials.length > 1 && (
                    <div className="flex flex-col gap-2">
                        {otpLogin.userOtpCredentials.map((otpCredential, index) => (
                            <Fragment key={index}>
                                <input
                                    id={`kc-otp-credential-${index}`}
                                    className="peer sr-only"
                                    type="radio"
                                    name="selectedCredentialId"
                                    value={otpCredential.id}
                                    defaultChecked={otpCredential.id === otpLogin.selectedCredentialId}
                                />
                                <label
                                    htmlFor={`kc-otp-credential-${index}`}
                                    tabIndex={index}
                                    className="block cursor-pointer rounded-md border border-input px-4 py-3 text-sm peer-checked:border-primary peer-checked:bg-accent"
                                >
                                    {otpCredential.userLabel}
                                </label>
                            </Fragment>
                        ))}
                    </div>
                )}

                <FormField
                    htmlFor="otp"
                    label={msg("loginOtpOneTime")}
                    errorHtml={messagesPerField.existsError("totp") ? kcSanitize(messagesPerField.get("totp")) : undefined}
                >
                    <Input
                        id="otp"
                        name="otp"
                        autoComplete="off"
                        type="text"
                        inputMode="numeric"
                        autoFocus
                        className="text-center font-mono text-lg tracking-[0.3em]"
                    />
                </FormField>

                <Button name="login" id="kc-login" type="submit" className="w-full" disabled={isSubmitting}>
                    {msgStr("doLogIn")}
                </Button>
            </form>
        </Template>
    );
}
