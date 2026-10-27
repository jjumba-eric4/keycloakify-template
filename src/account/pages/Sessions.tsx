import type { PageProps } from "keycloakify/account/pages/PageProps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Sessions(props: PageProps<Extract<KcContext, { pageId: "sessions.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { url, stateChecker, sessions } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} active="sessions">
            <div className="mb-5 flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight">{msg("sessionsHtmlTitle")}</h1>
                <form action={url.sessionsUrl} method="post">
                    <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />
                    <Button id="logout-all-sessions" type="submit" variant="outline">
                        {msg("doLogOutAllSessions")}
                    </Button>
                </form>
            </div>

            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{msg("ip")}</TableHead>
                                <TableHead>{msg("started")}</TableHead>
                                <TableHead>{msg("lastAccess")}</TableHead>
                                <TableHead>{msg("expires")}</TableHead>
                                <TableHead>{msg("clients")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions.sessions.map((session, index) => (
                                <TableRow key={index}>
                                    <TableCell>{session.ipAddress}</TableCell>
                                    <TableCell>{session?.started}</TableCell>
                                    <TableCell>{session?.lastAccess}</TableCell>
                                    <TableCell>{session?.expires}</TableCell>
                                    <TableCell>
                                        {session.clients.map((client, clientIndex) => (
                                            <div key={clientIndex}>{client}</div>
                                        ))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Template>
    );
}
