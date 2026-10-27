import type { PageProps } from "keycloakify/account/pages/PageProps";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Log(props: PageProps<Extract<KcContext, { pageId: "log.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { log } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} active="log">
            <div className="mb-5">
                <h1 className="text-2xl font-semibold tracking-tight">{msg("accountLogHtmlTitle")}</h1>
            </div>

            <Card>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{msg("date")}</TableHead>
                                <TableHead>{msg("event")}</TableHead>
                                <TableHead>{msg("ip")}</TableHead>
                                <TableHead>{msg("client")}</TableHead>
                                <TableHead>{msg("details")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {log.events.map((event, index) => (
                                <TableRow key={index}>
                                    <TableCell>{event.date ? new Date(event.date).toLocaleString() : ""}</TableCell>
                                    <TableCell>{event.event}</TableCell>
                                    <TableCell>{event.ipAddress}</TableCell>
                                    <TableCell>{event.client || ""}</TableCell>
                                    <TableCell>
                                        {event.details.map((detail, detailIndex) => (
                                            <span key={detailIndex}>
                                                {`${detail.key} = ${detail.value}`}
                                                {detailIndex < event.details.length - 1 && ", "}
                                            </span>
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
