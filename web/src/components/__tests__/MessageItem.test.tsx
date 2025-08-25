import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageItem } from "../";

const base = {
  id: 42,
  session_id: 1,
  user_id: null,
  role: "user",
  text: "hello",
  created_at: new Date(2025, 7, 19, 12, 42).toISOString(),
};

describe("MessageItem", () => {
  it("toggles edit mode and cancels without saving", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const onDelete = vi.fn().mockResolvedValue(undefined);

    render(
      <MessageItem m={base} onSave={onSave} onDelete={onDelete} disableActions={false} />
    );

    // Enter edit mode
    await user.click(screen.getByRole("button", { name: "✏️" }));

    // Change text then cancel
    const input = screen.getByDisplayValue("hello");
    await user.clear(input);
    await user.type(input, "edited");
    await user.click(screen.getByRole("button", { name: /Cancel/i }));

    // Original content shown, no save triggered
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("hides delete while editing, then shows it again after cancel", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);
    const onDelete = vi.fn().mockResolvedValue(undefined);

    render(
      <MessageItem m={base} onSave={onSave} onDelete={onDelete} disableActions={false} />
    );

    // Before editing, delete button is visible
    expect(screen.getByTitle("Delete")).toBeInTheDocument();

    // Enter edit mode → delete button disappears (cannot delete while editing)
    await user.click(screen.getByRole("button", { name: "✏️" }));
    expect(screen.queryByTitle("Delete")).not.toBeInTheDocument();

    // Cancel → delete button returns
    await user.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(screen.getByTitle("Delete")).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
  });
});

