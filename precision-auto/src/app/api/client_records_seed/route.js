export async function GET() {
  const fakeRecords = [
    {
      id: "r_001",
      vehicle: "Toyota Camry",
      description: "Oil Change",
      date: "2025-01-01",
    },
    {
      id: "r_002",
      vehicle: "Honda Civic",
      description: "Brake Replacement",
      date: "2025-02-15",
    },
    {
      id: "r_003",
      vehicle: "Ford F-150",
      description: "Tire Rotation",
      date: "2025-03-10",
    },
    {
      id: "r_004",
      vehicle: "Subaru Outback",
      description: "Engine Check",
      date: "2025-04-05",
    },
  ];

  return new Response(JSON.stringify(fakeRecords), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
