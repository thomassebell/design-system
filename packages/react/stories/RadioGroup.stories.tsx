import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "../src/components/RadioGroup/RadioGroup";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const planOptions = [
  { value: "free", label: "Free" },
  { value: "standard", label: "Standard" },
  { value: "pro", label: "Pro" },
];

const planOptionsWithHints = [
  { value: "free", label: "Free", hint: "Up to 3 projects." },
  { value: "standard", label: "Standard", hint: "Unlimited projects, $10 / month." },
  { value: "pro", label: "Pro", hint: "Standard plus analytics, $25 / month." },
];

export const Default: Story = {
  args: {
    legend: "Choose a plan",
    name: "plan",
    options: planOptions,
    defaultValue: "standard",
  },
};

export const WithHint: Story = {
  args: {
    legend: "Choose a plan",
    name: "plan-hint",
    hint: "You can switch plans anytime in account settings.",
    options: planOptions,
  },
};

export const WithError: Story = {
  args: {
    legend: "Choose a plan",
    name: "plan-error",
    error: "Please choose a plan to continue.",
    options: planOptions,
  },
};

export const PerOptionHints: Story = {
  args: {
    legend: "Choose a plan",
    name: "plan-with-hints",
    options: planOptionsWithHints,
    defaultValue: "standard",
  },
};

export const Dense: Story = {
  args: {
    legend: "Sort by",
    name: "sort",
    size: "dense",
    options: [
      { value: "newest", label: "Newest first" },
      { value: "oldest", label: "Oldest first" },
      { value: "popular", label: "Most popular" },
    ],
    defaultValue: "newest",
  },
};

export const OneOptionDisabled: Story = {
  args: {
    legend: "Delivery option",
    name: "delivery",
    options: [
      { value: "standard", label: "Standard (3–5 days)" },
      { value: "express", label: "Express (1–2 days)" },
      {
        value: "same-day",
        label: "Same-day",
        hint: "Not available at your address.",
        disabled: true,
      },
    ],
    defaultValue: "standard",
  },
};

export const AllDisabled: Story = {
  args: {
    legend: "Plan (read-only)",
    name: "plan-disabled",
    options: planOptions,
    defaultValue: "pro",
    disabled: true,
  },
};

/** Controlled example — the parent owns the state. Useful when the
 *  selection drives other UI in the page. */
export const Controlled: Story = {
  render: () => {
    const [plan, setPlan] = useState("free");
    return (
      <div>
        <RadioGroup
          legend="Choose a plan"
          name="plan-controlled"
          value={plan}
          onChange={setPlan}
          options={planOptionsWithHints}
        />
        <p style={{ marginTop: 16, fontSize: 14, color: "var(--color-text-light)" }}>
          Selected: <strong>{plan}</strong>
        </p>
      </div>
    );
  },
};
