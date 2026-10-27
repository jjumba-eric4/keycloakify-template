import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login.ftl" });

const meta = {
    title: "login/login.ftl",
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
                    existsError: (...fieldNames: string[]) => fieldNames.includes("username") || fieldNames.includes("password"),
                    get: () => "Invalid username or password.",
                    getFirstError: () => "Invalid username or password.",
                    exists: () => true,
                    printIfExists: <T,>(_fieldName: string, text: T) => text
                }
            }}
        />
    )
};
