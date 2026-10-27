import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";

export default function WebauthnError(props: PageProps<Extract<KcContext, { pageId: "webauthn-error.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { url, isAppInitiatedAction, execution } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} displayMessage headerNode={msg("webauthn-error-title")}>
            <form id="kc-error-credential-form" action={url.loginAction} method="post">
                <input type="hidden" id="executionValue" name="authenticationExecution" />
                <input type="hidden" id="isSetRetry" name="isSetRetry" />
            </form>
            <div className="flex flex-col gap-2.5">
                <Button
                    tabIndex={4}
                    onClick={() => {
                        (document.getElementById("isSetRetry") as HTMLInputElement).value = "retry";
                        (document.getElementById("executionValue") as HTMLInputElement).value = execution;
                        (document.getElementById("kc-error-credential-form") as HTMLFormElement).requestSubmit();
                    }}
                    type="button"
                    className="w-full"
                    name="try-again"
                    id="kc-try-again"
                >
                    {msgStr("doTryAgain")}
                </Button>
                {isAppInitiatedAction && (
                    <form action={url.loginAction} id="kc-webauthn-settings-form" method="post">
                        <Button type="submit" id="cancelWebAuthnAIA" name="cancel-aia" value="true" variant="outline" className="w-full">
                            {msgStr("doCancel")}
                        </Button>
                    </form>
                )}
            </div>
        </Template>
    );
}
