export default function PlaceholderJSON({ data }) {
  return (
    <div style={{ margin: "16px 0", border: "1px dashed #999", padding: 12, borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>API Data (Placeholder)</h3>
      <pre style={{ maxHeight: 280, overflow: "auto", fontSize: 12 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}