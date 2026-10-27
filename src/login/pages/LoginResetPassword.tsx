import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { url, realm, auth, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayMessage={!messagesPerField.existsError("username")}
            headerNode={msg("emailForgotTitle")}
        >
            <form id="kc-reset-password-form" className="flex flex-col gap-5" action={url.loginAction} method="post">
                <FormField
                    htmlFor="username"
                    label={
                        !realm.loginWithEmailAllowed ? msg("username") : !realm.registrationEmailAsUsername ? msg("usernameOrEmail") : msg("email")
                    }
                    errorHtml={messagesPerField.existsError("username") ? kcSanitize(messagesPerField.get("username")) : undefined}
                >
                    <Input
                        type="text"
                        id="username"
                        name="username"
                        autoFocus
                        defaultValue={auth.attemptedUsername ?? ""}
                        aria-invalid={messagesPerField.existsError("username")}
                    />
                </FormField>

                <div className="flex items-center justify-center text-sm font-medium">
                    <a href={url.loginUrl}>{msg("backToLogin")}</a>
                </div>

                <Button type="submit" className="w-full">
                    {msgStr("doSubmit")}
                </Button>
            </form>
        </Template>
    );
}
