// Cloudflare Pages Function: every /api/* request is handled by the classroom API.
import { handleApi, type Env } from '../../server/classroom';

export const onRequest = (context: { request: Request; env: Env }): Promise<Response> =>
  handleApi(context.request, context.env);
