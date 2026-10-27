import type { PageProps } from "keycloakify/account/pages/PageProps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Applications(props: PageProps<Extract<KcContext, { pageId: "applications.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const {
        url,
        applications: { applications },
        stateChecker
    } = kcContext;

    const { msg, advancedMsg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} active="applications">
            <div className="mb-5">
                <h1 className="text-2xl font-semibold tracking-tight">{msg("applicationsHtmlTitle")}</h1>
            </div>

            <Card>
                <CardContent>
                    <form action={url.applicationsUrl} method="post">
                        <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />
                        <input type="hidden" id="referrer" name="referrer" value={stateChecker} />

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{msg("application")}</TableHead>
                                    <TableHead>{msg("availableRoles")}</TableHead>
                                    <TableHead>{msg("grantedPermissions")}</TableHead>
                                    <TableHead>{msg("additionalGrants")}</TableHead>
                                    <TableHead>{msg("action")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map((application, index) => {
                                    // Keycloak can hand back an application/consent entry whose client was
                                    // since deleted from the realm — kcContext's type claims `client` is
                                    // always present, but real servers can send it as null/undefined here.
                                    const client = application.client as (typeof application)["client"] | undefined;
                                    const displayName = client?.name ? advancedMsg(client.name) : (client?.clientId ?? msg("unknownApplication"));

                                    return (
                                        <TableRow key={client?.clientId ?? index}>
                                            <TableCell>
                                                {application.effectiveUrl ? <a href={application.effectiveUrl}>{displayName}</a> : displayName}
                                            </TableCell>

                                            <TableCell>
                                                {!isArrayWithEmptyObject(application.realmRolesAvailable) &&
                                                    application.realmRolesAvailable.map((role, index) => (
                                                        <span key={role.name}>
                                                            {role.description ? advancedMsg(role.description) : advancedMsg(role.name)}
                                                            {index < application.realmRolesAvailable.length - 1 && ", "}
                                                        </span>
                                                    ))}
                                                {application.resourceRolesAvailable &&
                                                    Object.keys(application.resourceRolesAvailable).map(resource => (
                                                        <span key={resource}>
                                                            {!isArrayWithEmptyObject(application.realmRolesAvailable) && ", "}
                                                            {application.resourceRolesAvailable[resource].map(clientRole => (
                                                                <span key={clientRole.roleName}>
                                                                    {clientRole.roleDescription
                                                                        ? advancedMsg(clientRole.roleDescription)
                                                                        : advancedMsg(clientRole.roleName)}{" "}
                                                                    {msg("inResource")}{" "}
                                                                    <strong>
                                                                        {clientRole.clientName
                                                                            ? advancedMsg(clientRole.clientName)
                                                                            : clientRole.clientId}
                                                                    </strong>
                                                                    {clientRole !==
                                                                        application.resourceRolesAvailable[resource][
                                                                            application.resourceRolesAvailable[resource].length - 1
                                                                        ] && ", "}
                                                                </span>
                                                            ))}
                                                        </span>
                                                    ))}
                                            </TableCell>

                                            <TableCell>
                                                {client?.consentRequired ? (
                                                    application.clientScopesGranted.map(claim => (
                                                        <span key={claim}>
                                                            {advancedMsg(claim)}
                                                            {claim !== application.clientScopesGranted[application.clientScopesGranted.length - 1] &&
                                                                ", "}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <strong>{msg("fullAccess")}</strong>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {application.additionalGrants.map(grant => (
                                                    <span key={grant}>
                                                        {advancedMsg(grant)}
                                                        {grant !== application.additionalGrants[application.additionalGrants.length - 1] && ", "}
                                                    </span>
                                                ))}
                                            </TableCell>

                                            <TableCell>
                                                {client !== undefined &&
                                                ((client.consentRequired && application.clientScopesGranted.length > 0) ||
                                                    application.additionalGrants.length > 0) ? (
                                                    <Button
                                                        type="submit"
                                                        size="sm"
                                                        variant="outline"
                                                        id={`revoke-${client.clientId}`}
                                                        name="clientId"
                                                        value={client.id}
                                                    >
                                                        {msg("revoke")}
                                                    </Button>
                                                ) : null}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </form>
                </CardContent>
            </Card>
        </Template>
    );
}

function isArrayWithEmptyObject(variable: any): boolean {
    return Array.isArray(variable) && variable.length === 1 && typeof variable[0] === "object" && Object.keys(variable[0]).length === 0;
}
