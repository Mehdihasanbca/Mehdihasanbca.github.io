export default {
  async fetch() {
    return new Response(JSON.stringify({ error: 'service_retired' }), {
      status: 410,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  }
};
