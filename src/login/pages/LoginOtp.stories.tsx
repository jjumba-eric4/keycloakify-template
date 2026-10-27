import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-otp.ftl" });

const meta = {
    title: "login/login-otp.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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
