import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";

export default function LoginIdpLinkConfirm(props: PageProps<Extract<KcContext, { pageId: "login-idp-link-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { url, idpAlias } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("confirmLinkIdpTitle")}>
            <form id="kc-register-form" className="flex flex-col gap-2.5" action={url.loginAction} method="post">
                <Button type="submit" variant="outline" className="w-full" name="submitAction" id="updateProfile" value="updateProfile">
                    {msg("confirmLinkIdpReviewProfile")}
                </Button>
                <Button type="submit" variant="outline" className="w-full" name="submitAction" id="linkAccount" value="linkAccount">
                    {msg("confirmLinkIdpContinue", idpAlias)}
                </Button>
            </form>
        </Template>
    );
}
