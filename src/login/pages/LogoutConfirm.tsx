import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";

export default function LogoutConfirm(props: PageProps<Extract<KcContext, { pageId: "logout-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { url, client, logoutConfirm } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("logoutConfirmTitle")}>
            <p className="mb-5 text-[15px] text-foreground">{msg("logoutConfirmHeader")}</p>
            <form action={url.logoutConfirmAction} method="POST">
                <input type="hidden" name="session_code" value={logoutConfirm.code} />
                <Button tabIndex={4} name="confirmLogout" id="kc-logout" type="submit" className="w-full">
                    {msgStr("doLogout")}
                </Button>
            </form>
            {!logoutConfirm.skipLink && client.baseUrl && (
                <p className="mt-4 text-center text-sm">
                    <a href={client.baseUrl}>{msg("backToApplication")}</a>
                </p>
            )}
        </Template>
    );
}
