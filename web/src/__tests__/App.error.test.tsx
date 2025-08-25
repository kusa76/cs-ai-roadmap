import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { makeMsg, paged } from "../test/factories";

// Mock the same module App imports
vi.mock("../api", () => ({
  listMessages: vi.fn(),
  createMessage: vi.fn(),
  patchMessage: vi.fn(),
  deleteMessage: vi.fn(),
}));
import * as api from "../api";

const pageData = (ids: number[], total = 5, limit = 5, offset = 0) =>
  paged(ids.map((id) => makeMsg(id)), total, limit, offset);

describe("App integration: error state", () => {
  it("shows an error when list fails once, then recovers on refetch", async () => {
    // First call rejects → show error; second call resolves → render list
    (api.listMessages as unknown as ReturnType<typeof vi.fn>)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(pageData([5, 4, 3, 2, 1]));

    const qc = new QueryClient({
      defaultOptions: { queries: { retry: false } }, // don't auto-retry
    });

    render(
      <QueryClientProvider client={qc}>
        <App />
      </QueryClientProvider>
    );

    // Error banner/paragraph should appear
    await waitFor(() =>
      expect(screen.getByText(/error|failed/i)).toBeInTheDocument()
    );

    // Trigger a refetch by toggling order (DESC → ASC) or clicking Next (both cause a new query)
    const orderBtn = screen.getByRole("button", { name: /Order:\s*DESC/i });
    await userEvent.click(orderBtn);

    // After recovery the list should render items
    await waitFor(() => expect(screen.getByText("#5")).toBeInTheDocument());
  });
});

