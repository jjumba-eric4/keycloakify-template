import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Account(props: PageProps<Extract<KcContext, { pageId: "account.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { url, realm, messagesPerField, stateChecker, account, referrer } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} active="account">
            <div className="mb-5">
                <h1 className="text-2xl font-semibold tracking-tight">{msg("editAccountHtmlTitle")}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    <span className="text-destructive">*</span> {msg("requiredFields")}
                </p>
            </div>

            <Card>
                <CardContent>
                    <form action={url.accountUrl} className="flex flex-col gap-5" method="post">
                        <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />

                        {!realm.registrationEmailAsUsername && (
                            <FormField
                                htmlFor="username"
                                label={msg("username")}
                                required={realm.editUsernameAllowed}
                                errorHtml={
                                    messagesPerField.existsError("username") ? kcSanitize(messagesPerField.get("username")) : undefined
                                }
                            >
                                <Input type="text" id="username" name="username" disabled={!realm.editUsernameAllowed} defaultValue={account.username ?? ""} />
                            </FormField>
                        )}

                        <FormField
                            htmlFor="email"
                            label={msg("email")}
                            required
                            errorHtml={messagesPerField.existsError("email") ? kcSanitize(messagesPerField.get("email")) : undefined}
                        >
                            <Input type="text" id="email" name="email" autoFocus defaultValue={account.email ?? ""} />
                        </FormField>

                        <FormField
                            htmlFor="firstName"
                            label={msg("firstName")}
                            required
                            errorHtml={messagesPerField.existsError("firstName") ? kcSanitize(messagesPerField.get("firstName")) : undefined}
                        >
                            <Input type="text" id="firstName" name="firstName" defaultValue={account.firstName ?? ""} />
                        </FormField>

                        <FormField
                            htmlFor="lastName"
                            label={msg("lastName")}
                            required
                            errorHtml={messagesPerField.existsError("lastName") ? kcSanitize(messagesPerField.get("lastName")) : undefined}
                        >
                            <Input type="text" id="lastName" name="lastName" defaultValue={account.lastName ?? ""} />
                        </FormField>

                        <div className="flex items-center justify-end gap-3">
                            {referrer !== undefined && (
                                <a href={referrer?.url} className="text-sm font-medium">
                                    {msg("backToApplication")}
                                </a>
                            )}
                            <Button type="submit" name="submitAction" value="Cancel" variant="outline">
                                {msg("doCancel")}
                            </Button>
                            <Button type="submit" name="submitAction" value="Save">
                                {msg("doSave")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </Template>
    );
}
