interface Props {
  params: { id: string };
}

export default async function InvoicePay({ params }: Props) {
const { id } = await params;
  return (
    <main style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <h1>Hello {id}!</h1>
    </main>
  );
}