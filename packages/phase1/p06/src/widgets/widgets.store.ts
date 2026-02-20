import type { Widget } from "./widgets.types";

export type WidgetsStoreDeps = {
  idGen: { nextId: () => string };
  clock: { nowISO: () => string };
};

export type WidgetsListResult = {
  items: Widget[];
  total: number;
  limit: number;
  offset: number;
};

export function createWidgetsStore(deps: WidgetsStoreDeps) {
  const items: Widget[] = [];

  function create(name: string): Widget {
    const now = deps.clock.nowISO();
    const widget: Widget = {
      id: deps.idGen.nextId(),
      name,
      createdAt: now,
      updatedAt: now,
    };
    items.push(widget);
    return widget;
  }

  function list(limit: number, offset: number): WidgetsListResult {
    const total = items.length;
    const page = items.slice(offset, offset + limit);
    return { items: page, total, limit, offset };
  }

  function getById(id: string): Widget | null {
    return items.find((w) => w.id === id) ?? null;
  }

  function update(id: string, patch: { name?: string }): Widget | null {
    const widget = items.find((w) => w.id === id);
    if (!widget) return null;

    let changed = false;

    if (typeof patch.name === "string" && patch.name !== widget.name) {
      widget.name = patch.name;
      changed = true;
    }

    if (changed) {
      widget.updatedAt = deps.clock.nowISO();
    }
    return widget;
  }

  function remove(id: string): boolean {
    const idx = items.findIndex((w) => w.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    return true;
  }

  return { create, list, getById, update, remove };
}
