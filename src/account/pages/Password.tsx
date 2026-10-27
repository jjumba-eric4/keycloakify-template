import { useState } from "react";
import type { PageProps } from "keycloakify/account/pages/PageProps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";
import { PasswordInput } from "@/components/shared/password-input";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Password(props: PageProps<Extract<KcContext, { pageId: "password.ftl" }>, I18n>) {
    const { kcContext, i18n, Template } = props;

    const { url, password, account, stateChecker } = kcContext;

    const { msgStr, msg } = i18n;

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [newPasswordConfirmError, setNewPasswordConfirmError] = useState("");
    const [hasNewPasswordBlurred, setHasNewPasswordBlurred] = useState(false);
    const [hasNewPasswordConfirmBlurred, setHasNewPasswordConfirmBlurred] = useState(false);

    const checkNewPassword = (newPassword: string) => {
        if (!password.passwordSet) {
            return;
        }

        if (newPassword === currentPassword) {
            setNewPasswordError(msgStr("newPasswordSameAsOld"));
        } else {
            setNewPasswordError("");
        }
    };

    const checkNewPasswordConfirm = (newPasswordConfirm: string) => {
        if (newPasswordConfirm === "") {
            return;
        }

        if (newPassword !== newPasswordConfirm) {
            setNewPasswordConfirmError(msgStr("passwordConfirmNotMatch"));
        } else {
            setNewPasswordConfirmError("");
        }
    };

    return (
        <Template
            kcContext={{
                ...kcContext,
                message: (() => {
                    if (newPasswordError !== "") {
                        return { type: "error" as const, summary: newPasswordError };
                    }

                    if (newPasswordConfirmError !== "") {
                        return { type: "error" as const, summary: newPasswordConfirmError };
                    }

                    return kcContext.message;
                })()
            }}
            i18n={i18n}
            doUseDefaultCss={false}
            active="password"
        >
            <div className="mb-5">
                <h1 className="text-2xl font-semibold tracking-tight">{msg("changePasswordHtmlTitle")}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{msg("allFieldsRequired")}</p>
            </div>

            <Card>
                <CardContent>
                    <form action={url.passwordUrl} className="flex flex-col gap-5" method="post">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={account.username ?? ""}
                            autoComplete="username"
                            readOnly
                            style={{ display: "none" }}
                        />

                        {password.passwordSet && (
                            <FormField htmlFor="password" label={msg("password")}>
                                <PasswordInput
                                    labelShow={msgStr("showPassword")}
                                    labelHide={msgStr("hidePassword")}
                                    id="password"
                                    name="password"
                                    autoFocus
                                    autoComplete="current-password"
                                    value={currentPassword}
                                    onChange={event => setCurrentPassword(event.target.value)}
                                />
                            </FormField>
                        )}

                        <input type="hidden" id="stateChecker" name="stateChecker" value={stateChecker} />

                        <FormField htmlFor="password-new" label={msg("passwordNew")}>
                            <PasswordInput
                                labelShow={msgStr("showPassword")}
                                labelHide={msgStr("hidePassword")}
                                id="password-new"
                                name="password-new"
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={event => {
                                    const newPassword = event.target.value;

                                    setNewPassword(newPassword);
                                    if (hasNewPasswordBlurred) {
                                        checkNewPassword(newPassword);
                                    }
                                }}
                                onBlur={() => {
                                    setHasNewPasswordBlurred(true);
                                    checkNewPassword(newPassword);
                                }}
                            />
                        </FormField>

                        <FormField htmlFor="password-confirm" label={msg("passwordConfirm")}>
                            <PasswordInput
                                labelShow={msgStr("showPassword")}
                                labelHide={msgStr("hidePassword")}
                                id="password-confirm"
                                name="password-confirm"
                                autoComplete="new-password"
                                value={newPasswordConfirm}
                                onChange={event => {
                                    const newPasswordConfirm = event.target.value;

                                    setNewPasswordConfirm(newPasswordConfirm);
                                    if (hasNewPasswordConfirmBlurred) {
                                        checkNewPasswordConfirm(newPasswordConfirm);
                                    }
                                }}
                                onBlur={() => {
                                    setHasNewPasswordConfirmBlurred(true);
                                    checkNewPasswordConfirm(newPasswordConfirm);
                                }}
                            />
                        </FormField>

                        <div className="flex items-center justify-end">
                            <Button disabled={newPasswordError !== "" || newPasswordConfirmError !== ""} type="submit" name="submitAction" value="Save">
                                {msg("doSave")}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </Template>
    );
}
