import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-config-totp.ftl" });

const meta = {
    title: "login/login-config-totp.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ManualMode: Story = {
    render: () => <KcPageStory kcContext={{ mode: "manual" }} />
};

export const WithError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                messagesPerField: {
                    existsError: (...fieldNames: string[]) => fieldNames.includes("totp"),
                    get: () => "Invalid authenticator code.",
                    getFirstError: () => "Invalid authenticator code.",
                    exists: () => true,
                    printIfExists: <T,>(_fieldName: string, text: T) => text
                }
            }}
        />
    )
};
