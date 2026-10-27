import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/form-field";
import { PasswordInput } from "@/components/shared/password-input";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { msg, msgStr } = i18n;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayMessage={!messagesPerField.existsError("password", "password-confirm")}
            headerNode={msg("updatePasswordTitle")}
        >
            <form id="kc-passwd-update-form" className="flex flex-col gap-5" action={url.loginAction} method="post">
                <FormField
                    htmlFor="password-new"
                    label={msg("passwordNew")}
                    errorHtml={messagesPerField.existsError("password") ? kcSanitize(messagesPerField.get("password")) : undefined}
                >
                    <PasswordInput
                        labelShow={msgStr("showPassword")}
                        labelHide={msgStr("hidePassword")}
                        id="password-new"
                        name="password-new"
                        autoFocus
                        autoComplete="new-password"
                    />
                </FormField>

                <FormField
                    htmlFor="password-confirm"
                    label={msg("passwordConfirm")}
                    errorHtml={messagesPerField.existsError("password-confirm") ? kcSanitize(messagesPerField.get("password-confirm")) : undefined}
                >
                    <PasswordInput
                        labelShow={msgStr("showPassword")}
                        labelHide={msgStr("hidePassword")}
                        id="password-confirm"
                        name="password-confirm"
                        autoComplete="new-password"
                    />
                </FormField>

                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" className="size-4 rounded-[4px] border border-input accent-primary" />
                    {msg("logoutOtherSessions")}
                </label>

                <div className="flex flex-col gap-2.5">
                    <Button type="submit" className={isAppInitiatedAction ? undefined : "w-full"}>
                        {msgStr("doSubmit")}
                    </Button>
                    {isAppInitiatedAction && (
                        <Button type="submit" name="cancel-aia" value="true" variant="outline">
                            {msg("doCancel")}
                        </Button>
                    )}
                </div>
            </form>
        </Template>
    );
}
