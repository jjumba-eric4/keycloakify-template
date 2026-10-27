import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { msg } = i18n;

    const { url, user } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            displayInfo
            headerNode={msg("emailVerifyTitle")}
            infoNode={
                <p className="text-[15px] leading-relaxed text-foreground">
                    {msg("emailVerifyInstruction2")} <a href={url.loginAction}>{msg("doClickHere")}</a> {msg("emailVerifyInstruction3")}
                </p>
            }
        >
            <p className="text-[15px] leading-relaxed text-foreground">{msg("emailVerifyInstruction1", user?.email ?? "")}</p>
        </Template>
    );
}
