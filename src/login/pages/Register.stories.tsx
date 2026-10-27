import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "register.ftl" });

const meta = {
    title: "login/register.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
    render: () => (
        <KcPageStory
            kcContext={{
                message: {
                    type: "error",
                    summary: "Username already exists."
                },
                messagesPerField: {
                    existsError: (...fieldNames: string[]) => fieldNames.includes("global") || fieldNames.includes("username"),
                    exists: (fieldName: string) => fieldName === "global" || fieldName === "username",
                    get: () => "Username already exists.",
                    getFirstError: () => "Username already exists.",
                    printIfExists: <T,>(_fieldName: string, text: T) => text
                }
            }}
        />
    )
};
