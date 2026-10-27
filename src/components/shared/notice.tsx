import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { Alert, AlertDescription } from "@/components/ui/alert";

export type NoticeVariant = "info" | "error" | "success" | "warning";

const icons: Record<NoticeVariant, typeof Info> = {
    info: Info,
    error: CircleAlert,
    success: CircleCheck,
    warning: TriangleAlert
};

const variantClassName: Record<NoticeVariant, string> = {
    info: "",
    error: "text-destructive *:data-[slot=alert-description]:text-destructive/90",
    success: "text-success *:data-[slot=alert-description]:text-success/90",
    warning: "text-warning *:data-[slot=alert-description]:text-warning/90"
};

export function Notice(props: { variant: NoticeVariant; children: ReactNode; id?: string }) {
    const { variant, children, id } = props;
    const Icon = icons[variant];

    return (
        <Alert id={id} className={cn(variantClassName[variant])}>
            <Icon />
            <AlertDescription>{children}</AlertDescription>
        </Alert>
    );
}
