import type { PageProps } from "keycloakify/account/pages/PageProps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function FederatedIdentity(props: PageProps<Extract<KcContext, { pageId: "federatedIdentity.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { url, federatedIdentity, stateChecker } = kcContext;
    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} active="social">
            <div className="mb-5">
                <h1 className="text-2xl font-semibold tracking-tight">{msg("federatedIdentitiesHtmlTitle")}</h1>
            </div>

            <Card>
                <CardContent className="flex flex-col divide-y" id="federated-identities">
                    {federatedIdentity.identities.map(identity => (
                        <div key={identity.providerId} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                            <div>
                                <label htmlFor={identity.providerId} className="text-sm font-semibold">
                                    {identity.displayName}
                                </label>
                                <p className="text-sm text-muted-foreground">{identity.userName}</p>
                            </div>
                            {identity.connected ? (
                                federatedIdentity.removeLinkPossible && (
                                    <form action={url.socialUrl} method="post">
                                        <input type="hidden" name="stateChecker" value={stateChecker} />
                                        <input type="hidden" name="action" value="remove" />
                                        <input type="hidden" name="providerId" value={identity.providerId} />
                                        <Button id={`remove-link-${identity.providerId}`} type="submit" variant="outline">
                                            {msg("doRemove")}
                                        </Button>
                                    </form>
                                )
                            ) : (
                                <form action={url.socialUrl} method="post">
                                    <input type="hidden" name="stateChecker" value={stateChecker} />
                                    <input type="hidden" name="action" value="add" />
                                    <input type="hidden" name="providerId" value={identity.providerId} />
                                    <Button id={`add-link-${identity.providerId}`} type="submit" variant="outline">
                                        {msg("doAdd")}
                                    </Button>
                                </form>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </Template>
    );
}
