import { Trash2 } from "lucide-react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormField } from "@/components/shared/form-field";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Totp(props: PageProps<Extract<KcContext, { pageId: "totp.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { totp, mode, url, messagesPerField, stateChecker } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} active="totp">
            <div className="mb-5">
                <h1 className="text-2xl font-semibold tracking-tight">{msg("authenticatorTitle")}</h1>
                {totp.otpCredentials.length === 0 && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        <span className="text-destructive">*</span> {msg("requiredFields")}
                    </p>
                )}
            </div>

            {totp.enabled && (
                <Card className="mb-6">
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{msg("mobile")}</TableHead>
                                    {totp.otpCredentials.length > 1 && <TableHead>Id</TableHead>}
                                    <TableHead>{msg("totpDeviceName")}</TableHead>
                                    <TableHead className="w-10" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {totp.otpCredentials.map((credential, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{msg("mobile")}</TableCell>
                                        {totp.otpCredentials.length > 1 && <TableCell>{credential.id}</TableCell>}
                                        <TableCell>{credential.userLabel || ""}</TableCell>
                                        <TableCell>
                                            <form action={url.totpUrl} method="post">
                                                <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />
                                                <input type="hidden" id="submitAction" name="submitAction" value="Delete" />
                                                <input type="hidden" id="credentialId" name="credentialId" value={credential.id} />
                                                <Button id={`remove-mobile-${index}`} type="submit" variant="ghost" size="icon">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </form>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {!totp.enabled && (
                <>
                    <ol className="mb-6 flex flex-col gap-4 pl-5 text-sm text-foreground">
                        <li>
                            <p>{msg("totpStep1")}</p>
                            <ul className="mt-1.5 list-disc pl-4 text-muted-foreground">
                                {totp.supportedApplications?.map(app => (
                                    <li key={app}>{advancedMsg(app)}</li>
                                ))}
                            </ul>
                        </li>

                        {mode && mode == "manual" ? (
                            <>
                                <li>
                                    <p>{msg("totpManualStep2")}</p>
                                    <p>
                                        <span id="kc-totp-secret-key" className="inline-block rounded-md bg-secondary px-2.5 py-1 font-mono">
                                            {totp.totpSecretEncoded}
                                        </span>
                                    </p>
                                    <p>
                                        <a href={totp.qrUrl} id="mode-barcode">
                                            {msg("totpScanBarcode")}
                                        </a>
                                    </p>
                                </li>
                                <li>
                                    <p>{msg("totpManualStep3")}</p>
                                    <ul className="mt-1.5 list-disc pl-4 text-muted-foreground">
                                        <li id="kc-totp-type">
                                            {msg("totpType")}: {msg(`totp.${totp.policy.type}`)}
                                        </li>
                                        <li id="kc-totp-algorithm">
                                            {msg("totpAlgorithm")}: {totp.policy.getAlgorithmKey()}
                                        </li>
                                        <li id="kc-totp-digits">
                                            {msg("totpDigits")}: {totp.policy.digits}
                                        </li>
                                        {totp.policy.type === "totp" ? (
                                            <li id="kc-totp-period">
                                                {msg("totpInterval")}: {totp.policy.period}
                                            </li>
                                        ) : (
                                            <li id="kc-totp-counter">
                                                {msg("totpCounter")}: {totp.policy.initialCounter}
                                            </li>
                                        )}
                                    </ul>
                                </li>
                            </>
                        ) : (
                            <li>
                                <p>{msg("totpStep2")}</p>
                                <img
                                    className="my-2 block size-40 rounded-md border"
                                    id="kc-totp-secret-qr-code"
                                    src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
                                    alt="Figure: Barcode"
                                />
                                <p>
                                    <a href={totp.manualUrl} id="mode-manual">
                                        {msg("totpUnableToScan")}
                                    </a>
                                </p>
                            </li>
                        )}
                        <li>
                            <p>{msg("totpStep3")}</p>
                            <p>{msg("totpStep3DeviceName")}</p>
                        </li>
                    </ol>

                    <Card>
                        <CardContent>
                            <form action={url.totpUrl} className="flex flex-col gap-5" id="kc-totp-settings-form" method="post">
                                <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />

                                <FormField
                                    htmlFor="totp"
                                    label={msg("authenticatorCode")}
                                    required
                                    errorHtml={messagesPerField.existsError("totp") ? kcSanitize(messagesPerField.get("totp")) : undefined}
                                >
                                    <Input type="text" id="totp" name="totp" autoComplete="off" />
                                </FormField>
                                <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                                {mode && <input type="hidden" id="mode" value={mode} />}

                                <FormField
                                    htmlFor="userLabel"
                                    label={msg("totpDeviceName")}
                                    required={totp.otpCredentials.length >= 1}
                                    errorHtml={messagesPerField.existsError("userLabel") ? kcSanitize(messagesPerField.get("userLabel")) : undefined}
                                >
                                    <Input type="text" id="userLabel" name="userLabel" autoComplete="off" />
                                </FormField>

                                <div className="flex items-center justify-end gap-2.5">
                                    <Button type="submit" id="cancelTOTPBtn" name="submitAction" value="Cancel" variant="outline">
                                        {msg("doCancel")}
                                    </Button>
                                    <Button type="submit" id="saveTOTPBtn">
                                        {msgStr("doSave")}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </>
            )}
        </Template>
    );
}
