import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";

export default function Terms(props: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { msg, msgStr } = i18n;

    const { url } = kcContext;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} displayMessage={false} headerNode={msg("termsTitle")}>
            <div id="kc-terms-text" className="mb-5 max-h-80 overflow-auto rounded-lg border bg-card p-4 text-sm leading-relaxed">
                {msg("termsText")}
            </div>
            <form className="flex flex-col gap-2.5" action={url.loginAction} method="POST">
                <Button name="accept" id="kc-accept" type="submit" className="w-full">
                    {msgStr("doAccept")}
                </Button>
                <Button name="cancel" id="kc-decline" type="submit" variant="outline" className="w-full">
                    {msgStr("doDecline")}
                </Button>
            </form>
        </Template>
    );
}
