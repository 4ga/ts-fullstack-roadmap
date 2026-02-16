import { Router } from "express";
import { validate } from "../middleware/validate";
import { echoBodySchema, type EchoBody } from "../schemas/schemas";

const router = Router();

router.post("/echo", validate({ body: echoBodySchema }), (req, res) => {
  const body = req.validated!.body as EchoBody;
  return res.status(200).json({ ok: true, body });
});

export default router;
