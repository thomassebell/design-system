import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../src/components/Icon/Icon";

const meta: Meta<typeof Icon> = {
  title: "Components/Icon",
  component: Icon,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    label: { control: "text" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A thin wrapper around an inline SVG. Pass raw <path />, <circle />, etc. as children. Provide a `label` for meaningful icons; omit it for purely decorative ones.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

/** Default — a check mark, decorative. */
export const Default: Story = {
  args: { size: "md" },
  render: (args) => (
    <Icon {...args}>
      <path d="M5 12l5 5L20 7" />
    </Icon>
  ),
};

export const Small: Story = {
  args: { size: "sm", label: "Check" },
  render: (args) => (
    <Icon {...args}>
      <path d="M5 12l5 5L20 7" />
    </Icon>
  ),
};

export const Medium: Story = {
  args: { size: "md", label: "Check" },
  render: (args) => (
    <Icon {...args}>
      <path d="M5 12l5 5L20 7" />
    </Icon>
  ),
};

export const Large: Story = {
  args: { size: "lg", label: "Check" },
  render: (args) => (
    <Icon {...args}>
      <path d="M5 12l5 5L20 7" />
    </Icon>
  ),
};

export const WithLabel: Story = {
  args: { size: "md", label: "Search" },
  render: (args) => (
    <Icon {...args}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </Icon>
  ),
};

/** A small gallery showing several common icons rendered through the same component. */
export const Gallery: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, auto)",
        gap: 24,
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
        fontSize: 12,
        color: "#666",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Icon size="md" label="Check">
          <path d="M5 12l5 5L20 7" />
        </Icon>
        <div>check</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Icon size="md" label="Close">
          <path d="M6 6l12 12M18 6L6 18" />
        </Icon>
        <div>close</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Icon size="md" label="Search">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </Icon>
        <div>search</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Icon size="md" label="Plus">
          <path d="M12 5v14M5 12h14" />
        </Icon>
        <div>plus</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Icon size="md" label="Arrow right">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </Icon>
        <div>arrow-right</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Icon size="md" label="Heart">
          <path d="M12 21s-7-4.35-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6c-2.5 4.65-9.5 9-9.5 9z" />
        </Icon>
        <div>heart</div>
      </div>
    </div>
  ),
};

/** All three sizes side by side for comparison. */
export const SizeScale: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 32,
        alignItems: "center",
        fontFamily: "system-ui, sans-serif",
        fontSize: 12,
        color: "#666",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Icon size="sm" label="Check">
          <path d="M5 12l5 5L20 7" />
        </Icon>
        <div>sm — 16px</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Icon size="md" label="Check">
          <path d="M5 12l5 5L20 7" />
        </Icon>
        <div>md — 20px</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Icon size="lg" label="Check">
          <path d="M5 12l5 5L20 7" />
        </Icon>
        <div>lg — 24px</div>
      </div>
    </div>
  ),
};
