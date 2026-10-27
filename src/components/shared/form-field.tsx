import type { ReactNode } from "react";
import { cn } from "cn";
import { Label } from "@/components/ui/label";

/**
 * Mirrors HIVEOS.ControlPlane.Web's FormItem/FormLabel/FormDescription/FormMessage
 * (src/components/ui/form.tsx), minus the react-hook-form wiring — these forms post
 * straight to Keycloak and errors come back from the server on reload, not from a
 * client-side resolver.
 */
export function FormField(props: {
    htmlFor?: string;
    label: ReactNode;
    required?: boolean;
    description?: ReactNode;
    /** Pre-sanitized HTML (see kcSanitize) — Keycloak field errors can contain markup. */
    errorHtml?: string;
    children: ReactNode;
    className?: string;
}) {
    const { htmlFor, label, required, description, errorHtml, children, className } = props;

    return (
        <div className={cn("grid gap-2", className)}>
            <Label htmlFor={htmlFor} data-error={!!errorHtml} className="data-[error=true]:text-destructive">
                {label}
                {required && (
                    <span aria-hidden="true" className="text-destructive">
                        *
                    </span>
                )}
            </Label>
            {children}
            {errorHtml ? (
                <p className="text-sm text-destructive" role="alert" dangerouslySetInnerHTML={{ __html: errorHtml }} />
            ) : description ? (
                <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
        </div>
    );
}
