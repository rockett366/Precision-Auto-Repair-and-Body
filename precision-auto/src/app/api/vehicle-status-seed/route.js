// Temporary mock API for testing the UI
export async function GET() {
    const fakeUser = [{
      id: "u_123",
      status: 2,
      make: "Toyota",
      model: "Camry",
      year: "2012",
      vin: "123456789ABCDEFGH",
      color: "Red",
      design: "Custom Design",
      additional_details: "Notes from technician"
    }];
  
    return new Response(JSON.stringify(fakeUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }