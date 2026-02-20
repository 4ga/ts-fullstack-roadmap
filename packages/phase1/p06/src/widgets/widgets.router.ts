import { NextFunction, Router, type Request, type Response } from "express";
import { validate } from "../middleware/validate";
import { createWidgetsStore, WidgetsStoreDeps } from "./widgets.store";
import {
  createWidgetBodySchema,
  listWidgetsQuerySchema,
  widgetIdParamsSchema,
  updateWidgetBodySchema,
} from "./widgets.schemas";
import { HttpError } from "../middleware/httpError";

export function widgetsRouter(deps: WidgetsStoreDeps) {
  const router = Router();
  const store = createWidgetsStore({ idGen: deps.idGen, clock: deps.clock });

  // POST /widgets
  router.post(
    "/",
    validate({ body: createWidgetBodySchema }),
    (req: Request, res: Response) => {
      const { name } = req.validated.body as { name: string };
      const created = store.create(name);
      return res.status(201).json(created);
    },
  );

  router.get(
    "/",
    validate({ query: listWidgetsQuerySchema }),
    (req: Request, res: Response) => {
      const { limit, offset } = req.validated.query as unknown as {
        limit: number;
        offset: number;
      };
      const { items, total } = store.list(limit, offset);
      return res.status(200).json({ items, limit, offset, total });
    },
  );

  router.get(
    "/:id",
    validate({ params: widgetIdParamsSchema }),
    (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.validated.params as { id: string };
      const found = store.getById(id);
      if (!found) return next(new HttpError(404));
      return res.status(200).json(found);
    },
  );

  router.patch(
    "/:id",
    validate({ params: widgetIdParamsSchema, body: updateWidgetBodySchema }),
    (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.validated.params as { id: string };
      const patch = req.validated.body as { name?: string };
      const updated = store.update(id, patch);
      if (!updated) return next(new HttpError(404));
      return res.status(200).json(updated);
    },
  );

  router.delete(
    "/:id",
    validate({ params: widgetIdParamsSchema }),
    (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.validated.params as { id: string };
      const ok = store.remove(id);
      if (!ok) return next(new HttpError(404));
      return res.status(204).end();
    },
  );

  return router;
}
