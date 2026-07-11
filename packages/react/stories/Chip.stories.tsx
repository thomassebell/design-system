import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "../src/components/Chip/Chip";
import { Stack } from "../src/components/Stack/Stack";
import { Icon } from "../src/components/Icon/Icon";

/** Check icon – shown on selected filter chips. */
const CheckIcon = () => (
  <Icon size="lg">
    <path d="M5 13l4 4L19 7" />
  </Icon>
);

/** Close icon – used as a trailing dismiss affordance. */
const CloseIcon = () => (
  <Icon size="lg">
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline"],
    },
    active: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Solid: Story = {
  args: { children: "Chip", variant: "solid" },
};

export const Outline: Story = {
  args: { children: "Chip", variant: "outline" },
};

export const Active: Story = {
  args: { children: "Chip", variant: "solid", active: true },
};

export const WithIcons: Story = {
  render: () => (
    <Stack direction="row" gap="small">
      <Chip startIcon={<CheckIcon />} active>
        Selected
      </Chip>
      <Chip endIcon={<CloseIcon />}>Dismissible</Chip>
      <Chip variant="outline" startIcon={<CheckIcon />} active>
        Selected
      </Chip>
      <Chip variant="outline" endIcon={<CloseIcon />}>
        Dismissible
      </Chip>
    </Stack>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Stack direction="row" gap="small">
      <Chip disabled>Solid</Chip>
      <Chip disabled active>
        Solid active
      </Chip>
      <Chip variant="outline" disabled>
        Outline
      </Chip>
      <Chip variant="outline" disabled active>
        Outline active
      </Chip>
    </Stack>
  ),
};

/** A working filter bar – click chips to toggle them. The variant control
    applies to all chips in the bar. */
export const FilterBar: Story = {
  args: {
    variant: "outline"
  },

  render: function FilterBarStory(args) {
    const filters = ["Breakfast", "Lunch", "Dinner", "Vegetarian", "Quick"];
    const [selected, setSelected] = useState<string[]>(["Lunch"]);
    const toggle = (f: string) =>
      setSelected((s) =>
        s.includes(f) ? s.filter((x) => x !== f) : [...s, f]
      );
    return (
      <Stack direction="row" gap="small">
        {filters.map((f) => (
          <Chip
            key={f}
            {...args}
            active={selected.includes(f)}
            onClick={() => toggle(f)}
          >
            {f}
          </Chip>
        ))}
      </Stack>
    );
  }
};
