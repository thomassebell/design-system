import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "../src/components/Text/Text";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "display",
        "h1",
        "h2",
        "h3",
        "h4",
        "body",
        "bodySmall",
        "caption",
        "overline",
      ],
    },
    muted: { control: "boolean" },
    truncate: {
      control: "select",
      options: [undefined, 1, 2, 3],
    },
    align: {
      control: "select",
      options: [undefined, "left", "center", "right"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Body: Story = {
  args: {
    variant: "body",
    children:
      "The quick brown fox jumps over the lazy dog. Body copy used for paragraphs and most reading text.",
  },
};

export const Display: Story = {
  args: { variant: "display", children: "Display heading" },
};

export const Heading1: Story = {
  args: { variant: "h1", children: "Heading 1" },
};

export const Heading2: Story = {
  args: { variant: "h2", children: "Heading 2" },
};

export const Heading3: Story = {
  args: { variant: "h3", children: "Heading 3" },
};

export const Heading4: Story = {
  args: { variant: "h4", children: "Heading 4" },
};

export const BodySmall: Story = {
  args: {
    variant: "bodySmall",
    children: "Smaller body text for dense areas like cards and tables.",
  },
};

export const Caption: Story = {
  args: { variant: "caption", children: "Caption — small descriptive text" },
};

export const Overline: Story = {
  args: { variant: "overline", children: "Overline label" },
};

export const Muted: Story = {
  args: {
    variant: "body",
    muted: true,
    children: "Secondary, lower-emphasis text.",
  },
};

export const Truncated: Story = {
  args: {
    variant: "body",
    truncate: 2,
    children:
      "This text is set to truncate after two lines. Try resizing the canvas — it will collapse with an ellipsis once it overflows. Useful for cards, list items, and previews where vertical space is constrained.",
  },
  render: (args) => (
    <div style={{ maxWidth: 280 }}>
      <Text {...args} />
    </div>
  ),
};

/** Every variant rendered together for visual reference. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Text variant="display">Display</Text>
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
      <Text variant="body">Body — the workhorse of paragraphs.</Text>
      <Text variant="bodySmall">Body small — denser reading text.</Text>
      <Text variant="caption">Caption — tiny supporting text.</Text>
      <Text variant="overline">Overline label</Text>
    </div>
  ),
};
