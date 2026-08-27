import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "../src/components/Text/Text";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "display1",
        "display2",
        "display3",
        "display4",
        "display5",
        "display6",
        "body",
        "bodySmall",
      ],
    },
    weight: {
      control: "select",
      options: [undefined, "understate", "default", "emphasized"],
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

    weight: "emphasized"
  },
};

export const Display1: Story = {
  args: { variant: "display1", children: "Display 1" },
};

export const Display2: Story = {
  args: { variant: "display2", children: "Display 2" },
};

export const Display3: Story = {
  args: { variant: "display3", children: "Display 3" },
};

export const Display4: Story = {
  args: { variant: "display4", children: "Display 4" },
};

export const Display5: Story = {
  args: { variant: "display5", children: "Display 5" },
};

export const Display6: Story = {
  args: { variant: "display6", children: "Display 6" },
};

export const BodySmall: Story = {
  args: {
    variant: "bodySmall",
    children: "Smaller body text for dense areas like cards and tables.",
  },
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

/**
 * The full type ramp – it mirrors the Figma `typography` page exactly. Six
 * `header/display *` steps, then the two `paragraph/*` sizes. Every display step
 * takes the header family; that pairing is a system rule, not a per-story choice.
 * Figma's `paragraph emphasized` / `small emphasized` are not separate variants
 * here – see the InlineEmphasis and Weights stories for why.
 */
export const TypeRamp: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Text variant="display1">Display 1</Text>
      <Text variant="display2">Display 2</Text>
      <Text variant="display3">Display 3</Text>
      <Text variant="display4">Display 4</Text>
      <Text variant="display5">Display 5</Text>
      <Text variant="display6">Display 6</Text>
      <Text variant="body">Body — the workhorse of paragraphs.</Text>
      <Text variant="bodySmall">Body small — denser reading text.</Text>
    </div>
  ),
};

/**
 * Style and document hierarchy are independent. The variant picks the size;
 * `as` picks the heading level. Neither implies the other — a page's `<h1>`
 * is free to be the smallest step in the ramp.
 */
export const StyleVersusHierarchy: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Text variant="display6" as="h1">
        A small h1, styled display6
      </Text>
      <Text variant="display2" as="h2">
        A large h2, styled display2
      </Text>
      <Text variant="display4" as="p">
        Not a heading at all — display4 on a paragraph
      </Text>
    </div>
  ),
};

/**
 * Inline emphasis. `<strong>` and `<b>` inside a `Text` resolve to the brand's
 * `font-weight.emphasized` token rather than the browser's bold.
 *
 * Figma carries this as a separate text style (`paragraph/paragraph emphasized`)
 * only because Figma cannot set a weight on a range of text – the sole way to
 * emphasise one word in a paragraph there is to apply a whole other style. That
 * is a tool limitation, not an instruction to model emphasis as its own variant.
 * On the web the intent expresses directly, so it does: one paragraph, one
 * variant, a `<strong>` around the word.
 */
export const InlineEmphasis: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <Text variant="body">
        This meal was shared by <strong>Pia</strong> — the name is emphasised
        inline, without breaking the paragraph.
      </Text>
      <Text variant="bodySmall">
        Works at every size, including <strong>small body copy</strong>.
      </Text>
    </div>
  ),
};

/**
 * The `weight` prop overrides the variant's default weight for a whole block –
 * the block-level counterpart to the inline `<strong>` above. `body` +
 * `weight="emphasized"` is Figma's `paragraph/paragraph emphasized`; `bodySmall`
 * + `weight="emphasized"` is `paragraph/small emphasized`.
 *
 * `understate` is the exception: it is a real weight slot in the brand
 * collection, but no Figma text style uses it. Exposed here, unused by the ramp.
 */
export const Weights: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Text variant="body" weight="understate">
        Understate — the lightest weight slot.
      </Text>
      <Text variant="body" weight="default">
        Default — the body weight.
      </Text>
      <Text variant="body" weight="emphasized">
        Emphasized — the heading weight, on body copy.
      </Text>
      <Text variant="display3" weight="default">
        A display3 heading set at default weight
      </Text>
    </div>
  ),
};
