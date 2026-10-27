import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { message, client, skipLink } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} displayMessage={false} headerNode={msg("errorTitle")}>
            <div id="kc-error-message">
                <p className="text-[15px] text-foreground" dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                {!skipLink && !!client?.baseUrl && (
                    <p className="mt-4 text-sm">
                        <a id="backToApplication" href={client.baseUrl}>
                            {msg("backToApplication")}
                        </a>
                    </p>
                )}
            </div>
        </Template>
    );
}
