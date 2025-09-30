import { http, HttpResponse } from 'msw';

export const handlers = [

  http.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/health`, () =>
    HttpResponse.json({ status: 'ok', vehicle_count: 42 })
  ),
];