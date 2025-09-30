export default function InvoicesTable({ items }) {
  if (!items || items.length === 0) {
    return <p style={{ textAlign: "center" }}>No invoices yet.</p>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((e) => (
          <tr key={e.id}>
            <td>{e.name}</td>
            <td>{e.description}</td>
            <td>{e.date}</td>
            <td><a href="#">View</a></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}