import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { ReactNode } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/form-field";

function Step(props: { number: number; children: ReactNode }) {
    return (
        <div className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                {props.number}
            </span>
            <div className="flex-1 pt-px text-[15px] text-foreground">{props.children}</div>
        </div>
    );
}

export default function LoginConfigTotp(props: PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const isManual = mode === "manual";

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={false}
            headerNode={msg("loginTotpTitle")}
            displayMessage={!messagesPerField.existsError("totp", "userLabel")}
        >
            <div className="mb-6 flex flex-col gap-4">
                <Step number={1}>
                    <p>{msg("loginTotpStep1")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {totp.supportedApplications.map((app, i) => (
                            <span key={app}>
                                {i > 0 && ", "}
                                {advancedMsg(app)}
                            </span>
                        ))}
                    </p>
                </Step>

                {isManual ? (
                    <Step number={2}>
                        <p>{msg("loginTotpManualStep2")}</p>
                        <p className="mt-1.5">
                            <span id="kc-totp-secret-key" className="inline-block rounded-md bg-secondary px-2.5 py-1 font-mono text-sm">
                                {totp.totpSecretEncoded}
                            </span>
                        </p>
                        <a href={totp.qrUrl} id="mode-barcode" className="mt-1.5 inline-block text-sm font-medium">
                            {msg("loginTotpScanBarcode")}
                        </a>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {msg("loginTotpType")}: {msg(`loginTotp.${totp.policy.type}`)} · {msg("loginTotpAlgorithm")}: {totp.policy.getAlgorithmKey()}{" "}
                            · {msg("loginTotpDigits")}: {totp.policy.digits} ·{" "}
                            {totp.policy.type === "totp" ? (
                                <>
                                    {msg("loginTotpInterval")}: {totp.policy.period}
                                </>
                            ) : (
                                <>
                                    {msg("loginTotpCounter")}: {totp.policy.initialCounter}
                                </>
                            )}
                        </p>
                    </Step>
                ) : (
                    <Step number={2}>
                        <p>{msg("loginTotpStep2")}</p>
                        <img
                            className="my-2 block size-36 rounded-md border"
                            id="kc-totp-secret-qr-code"
                            src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
                            alt="Figure: Barcode"
                        />
                        <a href={totp.manualUrl} id="mode-manual" className="text-sm font-medium">
                            {msg("loginTotpUnableToScan")}
                        </a>
                    </Step>
                )}

                <Step number={3}>
                    <p>{msg("loginTotpStep3")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{msg("loginTotpStep3DeviceName")}</p>
                </Step>
            </div>

            <form action={url.loginAction} className="flex flex-col gap-5" id="kc-totp-settings-form" method="post">
                <FormField
                    htmlFor="totp"
                    label={msg("authenticatorCode")}
                    required
                    errorHtml={messagesPerField.existsError("totp") ? kcSanitize(messagesPerField.get("totp")) : undefined}
                >
                    <Input type="text" id="totp" name="totp" autoComplete="off" autoFocus />
                </FormField>
                <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                {mode && <input type="hidden" id="mode" value={mode} />}

                <FormField
                    htmlFor="userLabel"
                    label={msg("loginTotpDeviceName")}
                    required={totp.otpCredentials.length >= 1}
                    errorHtml={messagesPerField.existsError("userLabel") ? kcSanitize(messagesPerField.get("userLabel")) : undefined}
                >
                    <Input type="text" id="userLabel" name="userLabel" autoComplete="off" />
                </FormField>

                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" className="size-4 rounded-[4px] border border-input accent-primary" />
                    {msg("logoutOtherSessions")}
                </label>

                <div className="flex gap-2.5">
                    <Button type="submit" id="saveTOTPBtn" className={isAppInitiatedAction ? undefined : "w-full"}>
                        {msgStr("doSubmit")}
                    </Button>
                    {isAppInitiatedAction && (
                        <Button type="submit" id="cancelTOTPBtn" name="cancel-aia" value="true" variant="outline">
                            {msg("doCancel")}
                        </Button>
                    )}
                </div>
            </form>
        </Template>
    );
}
