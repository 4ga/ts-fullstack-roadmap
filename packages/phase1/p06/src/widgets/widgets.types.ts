export type Widget = {
  id: string;
  name: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

export type CreateWidgetInput = {
  name: string;
};

export type UpdateWidgetInput = {
  name?: string;
};
