import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "../App";
import { makeMsg, paged } from "../test/factories";

// Mock the module App imports:
vi.mock("../api", () => ({
  listMessages: vi.fn(),
  createMessage: vi.fn(),
  patchMessage: vi.fn(),
  deleteMessage: vi.fn(),
}));

// Pull the mocked functions so we can program them:
import * as api from "../api";

const pageData = (ids: number[], total = 12, limit = 5, offset = 0) =>
  paged(ids.map((id) => makeMsg(id)), total, limit, offset);

describe("App integration: pagination + order toggle", () => {
  it("loads, paginates next/prev, toggles order", async () => {
    const user = userEvent.setup();

    // Sequence the listMessages responses (ignore args; match call order)
    (api.listMessages as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce(pageData([12, 11, 10, 9, 8], 12, 5, 0)) // initial DESC page 1
      .mockResolvedValueOnce(pageData([7, 6, 5, 4, 3], 12, 5, 5))   // Next (DESC page 2)
      .mockResolvedValueOnce(pageData([12, 11, 10, 9, 8], 12, 5, 0)) // Prev (back)
      .mockResolvedValueOnce(pageData([1, 2, 3, 4, 5], 12, 5, 0));   // Toggle ASC page 1

    const qc = new QueryClient();
    render(
      <QueryClientProvider client={qc}>
        <App />
      </QueryClientProvider>
    );

    // Initial list renders
    await waitFor(() => expect(screen.getByText("#12")).toBeInTheDocument());

    // Next ›
    await user.click(screen.getByRole("button", { name: /Next/i }));
    await waitFor(() => expect(screen.getByText("#7")).toBeInTheDocument());
    expect(screen.queryByText("#12")).not.toBeInTheDocument();

    // ‹ Prev
    await user.click(screen.getByRole("button", { name: /Prev/i }));
    await waitFor(() => expect(screen.getByText("#12")).toBeInTheDocument());

    // Toggle Order button (DESC → ASC)
    const orderBtn = screen.getByRole("button", { name: /Order:\s*DESC/i });
    await user.click(orderBtn);
    await waitFor(() => expect(screen.getByText("#1")).toBeInTheDocument());

    // Sanity: multiple pages
    expect(screen.getByText(/Page\s+1\s*\/\s*[2-9]/i)).toBeInTheDocument();
  });
});

