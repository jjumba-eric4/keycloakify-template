import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-update-password.ftl" });

const meta = {
    title: "login/login-update-password.ftl",
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
                    existsError: (...fieldNames: string[]) => fieldNames.includes("password-confirm"),
                    get: () => "Passwords do not match.",
                    getFirstError: () => "Passwords do not match.",
                    exists: () => true,
                    printIfExists: <T,>(_fieldName: string, text: T) => text
                }
            }}
        />
    )
};
