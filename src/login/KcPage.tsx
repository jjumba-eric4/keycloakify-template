import { Suspense, lazy } from "react";
import type { ClassKey } from "keycloakify/login";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";
import Login from "./pages/Login";
import LoginResetPassword from "./pages/LoginResetPassword";
import Register from "./pages/Register";
import LoginUpdatePassword from "./pages/LoginUpdatePassword";
import LoginOtp from "./pages/LoginOtp";
import LoginVerifyEmail from "./pages/LoginVerifyEmail";
import LoginConfigTotp from "./pages/LoginConfigTotp";
import SelectAuthenticator from "./pages/SelectAuthenticator";
import WebauthnAuthenticate from "./pages/WebauthnAuthenticate";
import WebauthnRegister from "./pages/WebauthnRegister";
import WebauthnError from "./pages/WebauthnError";
import LoginUpdateProfile from "./pages/LoginUpdateProfile";
import LoginIdpLinkConfirm from "./pages/LoginIdpLinkConfirm";
import Terms from "./pages/Terms";
import LogoutConfirm from "./pages/LogoutConfirm";
import Error from "./pages/Error";
import Info from "./pages/Info";
import LoginPageExpired from "./pages/LoginPageExpired";
import LoginUsername from "./pages/LoginUsername";
import SelectOrganization from "./pages/SelectOrganization";
const UserProfileFormFields = lazy(
    () => import("keycloakify/login/UserProfileFormFields")
);

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "login.ftl":
                        return <Login kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "login-reset-password.ftl":
                        return <LoginResetPassword kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "register.ftl":
                        return <Register kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "login-update-password.ftl":
                        return <LoginUpdatePassword kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "login-otp.ftl":
                        return <LoginOtp kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "login-verify-email.ftl":
                        return <LoginVerifyEmail kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "login-config-totp.ftl":
                        return <LoginConfigTotp kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "select-authenticator.ftl":
                        return <SelectAuthenticator kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "webauthn-authenticate.ftl":
                        return <WebauthnAuthenticate kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "webauthn-register.ftl":
                        return <WebauthnRegister kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "webauthn-error.ftl":
                        return <WebauthnError kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "login-update-profile.ftl":
                        return <LoginUpdateProfile kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "login-idp-link-confirm.ftl":
                        return <LoginIdpLinkConfirm kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "terms.ftl":
                        return <Terms kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "logout-confirm.ftl":
                        return <LogoutConfirm kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "error.ftl":
                        return <Error kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "info.ftl":
                        return <Info kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "login-page-expired.ftl":
                        return <LoginPageExpired kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "login-username.ftl":
                        return <LoginUsername kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    case "select-organization.ftl":
                        return <SelectOrganization kcContext={kcContext} i18n={i18n} classes={classes} Template={Template} doUseDefaultCss={false} />;
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const classes = {} satisfies { [key in ClassKey]?: string };
