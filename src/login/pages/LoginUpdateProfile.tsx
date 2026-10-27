import { useState } from "react";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import UserProfileFormFields from "../UserProfileFormFields";

export default function LoginUpdateProfile(props: PageProps<Extract<KcContext, { pageId: "login-update-profile.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss: false, classes: undefined });

    const { messagesPerField, url, isAppInitiatedAction } = kcContext;

    const { msg, msgStr } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayRequiredFields
            headerNode={msg("loginProfileTitle")}
            displayMessage={messagesPerField.exists("global")}
        >
            <form id="kc-update-profile-form" className="flex flex-col gap-5" action={url.loginAction} method="post">
                <UserProfileFormFields
                    kcContext={kcContext}
                    i18n={i18n}
                    kcClsx={kcClsx}
                    onIsFormSubmittableValueChange={setIsFormSubmittable}
                    doMakeUserConfirmPassword={false}
                />
                <div className="flex gap-2.5">
                    <Button disabled={!isFormSubmittable} className={isAppInitiatedAction ? undefined : "w-full"} type="submit">
                        {msgStr("doSubmit")}
                    </Button>
                    {isAppInitiatedAction && (
                        <Button type="submit" name="cancel-aia" value="true" variant="outline" formNoValidate>
                            {msg("doCancel")}
                        </Button>
                    )}
                </div>
            </form>
        </Template>
    );
}
