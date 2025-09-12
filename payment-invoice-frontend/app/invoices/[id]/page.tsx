import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import Link from "next/link";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { invoiceDetailSchema, InvoiceDetail } from "@/lib/validation/invoice";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import {z} from "zod";
import { headers } from "next/headers";

interface Props {
  params: { id: string };
}


export default async function InvoiceDetails({ params }: Props) {
  const { id } = await params;
  const username = process.env.DJANGO_USER!;
  const password = process.env.DJANGO_PASS!;
  const apiUrl = process.env.API_URL!;

  const response = await fetch(`${apiUrl}invoices/${id}`, {
    cache: "no-store",
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error(`Failed to fetch invoice ${id}`);

  const data = await response.json();
  const invoiceDetail : InvoiceDetail = invoiceDetailSchema.parse(data);
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  const invoicePublicUrl = `${protocol}://${host}/invoices/${id}/pay`;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <InvoiceDetailCard invoiceDetail={invoiceDetail} publicUrl={invoicePublicUrl}/>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


function InvoiceDetailCard({invoiceDetail, publicUrl} : {
  invoiceDetail: z.infer<typeof invoiceDetailSchema>,
  publicUrl: string
}) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="space-y-1">
            <CardTitle>{`Invoice ${invoiceDetail.id}`}</CardTitle>
            <CardDescription>Invoice for services rendered</CardDescription>
          </div>
          <div className="mt-4 md:mt-0 space-y-1 text-sm">
            <div className="flex items-center gap-1">
              <div className="font-medium">Status:</div>
              <div>{`${invoiceDetail.status}`}</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Billdr - Pat Division</div>
            <div>support@billdr.com</div>
            <div>1-202-555-0170</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">{`${invoiceDetail.customer_name}`}</div>
            <div>{`${invoiceDetail.customer_email}`}</div>
            <div>{`${invoiceDetail.customer_phone}`}</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">1234 Main St</div>
            <div>Anytown, CA 12345</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Billing Address</div>
            <div>Same as shipping address</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Public Invoice Link</div>
            <Link href={`/invoices/${invoiceDetail.id}/pay`}>
            {publicUrl}
            </Link>
          </div>
        </div>
        <Separator className="my-4" />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Description</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
            invoiceDetail.line_items.map((item) => (
            <TableRow className="text-gray-500 dark:text-gray-400" key={`${item.id}`}>
              <TableCell className="font-medium">{item.description}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell className="text-right">{`$${item.amount}`}</TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="grid gap-1 md:grid-cols-1 md:gap-0">
          <div className="flex items-center gap-2">
            <div className="font-semibold">Invoice Total</div>
            <div className="ml-auto">{`$${invoiceDetail.amount_due}`}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-semibold">Total Paid</div>
            <div className="ml-auto">{`$${invoiceDetail.amount_paid}`}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="font-semibold">Total Remaining</div>
            <div className="ml-auto">{`$${invoiceDetail.amount_remaining}`}</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
