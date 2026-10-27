import { useReducer, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";

export function PasswordInput(props: ComponentProps<typeof Input> & { labelShow: string; labelHide: string }) {
    const { labelShow, labelHide, className, id, ...rest } = props;

    const [isRevealed, toggle] = useReducer((revealed: boolean) => !revealed, false);

    return (
        <div className="relative">
            <Input {...rest} id={id} type={isRevealed ? "text" : "password"} className={cn("pr-10", className)} />
            <button
                type="button"
                className="absolute top-1/2 right-1 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                aria-label={isRevealed ? labelHide : labelShow}
                aria-controls={id}
                onClick={toggle}
            >
                {isRevealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
        </div>
    );
}
