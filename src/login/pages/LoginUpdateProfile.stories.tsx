import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-update-profile.ftl" });

const meta = {
    title: "login/login-update-profile.ftl",
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
                    existsError: (...fieldNames: string[]) => fieldNames.includes("email"),
                    exists: (fieldName: string) => fieldName === "global" || fieldName === "email",
                    get: () => "Email already in use.",
                    getFirstError: () => "Email already in use.",
                    printIfExists: <T,>(_fieldName: string, text: T) => text
                }
            }}
        />
    )
};
