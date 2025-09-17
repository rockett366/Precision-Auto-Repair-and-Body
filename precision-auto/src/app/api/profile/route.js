// Temporary mock API for testing the UI
export async function PUT(req) {
    const body = await req.json();
    console.log("Received profile update:", body);
  
    return new Response(JSON.stringify({ success: true, ...body }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }