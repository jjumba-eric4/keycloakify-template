import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "totp.ftl" });

const meta = {
    title: "account/totp.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SetUp: Story = {
    render: () => <KcPageStory kcContext={{ totp: { enabled: false } }} />
};
