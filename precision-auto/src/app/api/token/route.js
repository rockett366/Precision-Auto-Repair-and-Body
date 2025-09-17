// Temporary mock API for testing the UI
export async function GET() {
    const fakeUser = {
      id: "u_123",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "(555) 555-1234",
    };
  
    return new Response(JSON.stringify(fakeUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }