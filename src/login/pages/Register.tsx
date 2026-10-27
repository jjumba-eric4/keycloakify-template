import type { JSX } from "keycloakify/tools/JSX";
import { useState, useLayoutEffect } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { cn } from "cn";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import UserProfileFormFields from "../UserProfileFormFields";

export default function Register(props: PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { messageHeader, url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } =
        kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const { kcClsx } = getKcClsx({ doUseDefaultCss: false, classes: undefined });

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    useLayoutEffect(() => {
        (window as any)["onSubmitRecaptcha"] = () => {
            // @ts-expect-error
            document.getElementById("kc-register-form").requestSubmit();
        };

        return () => {
            delete (window as any)["onSubmitRecaptcha"];
        };
    }, []);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields
        >
            <form id="kc-register-form" className="flex flex-col gap-5" action={url.registrationAction} method="post">
                <UserProfileFormFields
                    kcContext={kcContext}
                    i18n={i18n}
                    kcClsx={kcClsx}
                    onIsFormSubmittableValueChange={setIsFormSubmittable}
                    doMakeUserConfirmPassword
                />
                {termsAcceptanceRequired && (
                    <TermsAcceptance
                        i18n={i18n}
                        messagesPerField={messagesPerField}
                        areTermsAccepted={areTermsAccepted}
                        onAreTermsAcceptedValueChange={setAreTermsAccepted}
                    />
                )}
                {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                    <div className="my-2">
                        <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction}></div>
                    </div>
                )}
                <div className="flex items-center justify-center text-sm font-medium">
                    <a href={url.loginUrl}>{msg("backToLogin")}</a>
                </div>

                {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                    <button
                        className={cn(
                            "g-recaptcha inline-flex h-9 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        )}
                        data-sitekey={recaptchaSiteKey}
                        data-callback="onSubmitRecaptcha"
                        data-action={recaptchaAction}
                        type="submit"
                    >
                        {msg("doRegister")}
                    </button>
                ) : (
                    <Button disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)} className="w-full" type="submit">
                        {msgStr("doRegister")}
                    </Button>
                )}
            </form>
        </Template>
    );
}

function TermsAcceptance(props: {
    i18n: I18n;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}): JSX.Element {
    const { i18n, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;

    const { msg } = i18n;

    return (
        <div className="flex flex-col gap-2.5 rounded-lg border bg-card p-4">
            <div className="max-h-40 overflow-auto text-sm">
                <strong>{msg("termsTitle")}</strong>
                <div id="kc-registration-terms-text">{msg("termsText")}</div>
            </div>
            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={areTermsAccepted}
                    onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                    aria-invalid={messagesPerField.existsError("termsAccepted")}
                    className="size-4 rounded-[4px] border border-input accent-primary"
                />
                {msg("acceptTerms")}
            </label>
            {messagesPerField.existsError("termsAccepted") && (
                <span
                    id="input-error-terms-accepted"
                    className="text-sm text-destructive"
                    aria-live="polite"
                    dangerouslySetInnerHTML={{
                        __html: kcSanitize(messagesPerField.get("termsAccepted"))
                    }}
                />
            )}
        </div>
    );
}
