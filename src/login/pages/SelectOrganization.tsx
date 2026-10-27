import { MouseEvent, useRef, useState } from "react";
import { Building2 } from "lucide-react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function SelectOrganization(props: PageProps<Extract<KcContext, { pageId: "select-organization.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { url, user } = kcContext;

    const { msg } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const organizationInputRef = useRef<HTMLInputElement>(null);

    const onOrganizationClick = (organizationAlias: string) => (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (!organizationInputRef.current || !formRef.current) {
            return;
        }

        organizationInputRef.current.value = organizationAlias;
        setIsSubmitting(true);

        if (typeof formRef.current.requestSubmit === "function") {
            formRef.current.requestSubmit();
            return;
        }

        formRef.current.submit();
    };

    const organizations = user.organizations ?? [];

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} headerNode={msg("organization.select")}>
            <form ref={formRef} action={url.loginAction} method="post">
                <div id="kc-user-organizations" className="flex flex-col gap-2.5">
                    {organizations.map(({ alias, name }) => (
                        <button
                            key={alias}
                            id={`organization-${alias}`}
                            type="button"
                            onClick={onOrganizationClick(alias)}
                            disabled={isSubmitting}
                            className="flex w-full items-center gap-3.5 rounded-xl border bg-card p-3.5 text-left hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
                        >
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                                <Building2 className="size-5" />
                            </span>
                            <span className="text-sm font-semibold">{name ?? alias}</span>
                        </button>
                    ))}
                </div>
                <input ref={organizationInputRef} type="hidden" name="kc.org" />
            </form>
        </Template>
    );
}
