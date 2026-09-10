"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  CheckCheck,
  FlaskConical,
  Inbox,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DeleteForm } from "./delete-form";
import { RefreshButton } from "./refresh-button";
import { TestForm } from "./test-form";

export type InquiryRow = {
  id: string;
  recipient: string;
  createdAt: string;
  jobStatus: string;
  emailId: string | null;
  smsStatus: string;
  lastError: string | null;
  updatedAt: string;
  sms: { recipient: string; message: string; simulatedAt: string } | null;
};

function Status({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={
        status === "complete"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : status === "failed"
            ? "border-red-200 bg-red-50 text-red-800"
            : "bg-muted text-muted-foreground"
      }
    >
      <span className="mr-1.5 size-1.5 rounded-full bg-current" />
      {status === "complete"
        ? "Complete"
        : status === "failed"
          ? "Failed"
          : status === "pending"
            ? "Pending"
            : status}
    </Badge>
  );
}

function createdLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  }).format(new Date(value));
}

function InquiryDetails({ inquiry }: { inquiry: InquiryRow }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`View inquiry ${inquiry.id}`}
        >
          View <ArrowUpRight />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="border-b p-6 pt-12">
          <SheetDescription>TEST INQUIRY</SheetDescription>
          <SheetTitle className="text-2xl">Consultation request</SheetTitle>
          <p className="text-sm text-muted-foreground">
            {createdLabel(inquiry.createdAt)} ET
          </p>
        </SheetHeader>
        <div className="space-y-7 p-6">
          <Status status={inquiry.jobStatus} />
          {inquiry.jobStatus === "failed" && inquiry.lastError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              <h3 className="font-semibold">Last error</h3>
              <p className="mt-1">{inquiry.lastError}</p>
              <p className="mt-2 text-xs">
                Retry below. A retry never sends a second email for the same
                inquiry.
              </p>
            </div>
          )}
          <div>
            <h3 className="mb-2 text-sm font-semibold">Recipient</h3>
            <p className="break-all text-sm text-muted-foreground">
              {inquiry.recipient}
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Request activity</h3>
            <dl className="space-y-5 border-l pl-5 text-sm">
              <div>
                <dt className="font-medium">Request saved</dt>
                <dd className="mt-1 text-muted-foreground">
                  Saved in the test database.
                </dd>
              </div>
              <div>
                <dt className="font-medium">Confirmation email</dt>
                <dd className="mt-1 text-muted-foreground">
                  {inquiry.emailId
                    ? "Accepted by Resend. Check delivery below."
                    : "Not yet accepted by Resend."}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Confirmation SMS</dt>
                <dd className="mt-1 text-muted-foreground">
                  {inquiry.sms ? (
                    <>
                      Simulated {createdLabel(inquiry.sms.simulatedAt)} ET. No
                      text message was sent.
                      <span className="mt-2 block rounded-md bg-muted p-3 text-xs">
                        To: {inquiry.sms.recipient}
                        <br />
                        {inquiry.sms.message}
                      </span>
                    </>
                  ) : (
                    "Simulation pending."
                  )}
                </dd>
              </div>
            </dl>
          </div>
          {inquiry.emailId && (
            <Button asChild variant="outline">
              <a
                href={`https://resend.com/emails/${inquiry.emailId}`}
                target="_blank"
                rel="noreferrer"
              >
                Check email delivery <ArrowUpRight />
              </a>
            </Button>
          )}
          {inquiry.jobStatus !== "complete" && (
            <TestForm inquiryId={inquiry.id} retry />
          )}
          <div className="rounded-lg bg-muted p-4">
            <h3 className="text-xs font-medium text-muted-foreground">
              Inquiry ID
            </h3>
            <p className="mt-2 break-all font-mono text-xs">{inquiry.id}</p>
          </div>
          <DeleteForm ids={[inquiry.id]} label="Delete this inquiry" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Adapted from licensed Shadcnblocks stats-card1 and data-table1.
// The bounded list uses native table sorting and the existing inquiry actions.
export function InquiryWorkspace({
  inquiries,
  inquiryId,
  staffEmail,
}: {
  inquiries: InquiryRow[];
  inquiryId: string;
  staffEmail: string;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [oldestFirst, setOldestFirst] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // Rows deleted elsewhere drop out of the selection on the next render.
  const selected = selectedIds.filter((id) =>
    inquiries.some((row) => row.id === id),
  );
  const visible = inquiries.filter(
    (row) =>
      (status === "all" || row.jobStatus === status) &&
      `${row.recipient} ${row.id} consultation request`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  if (oldestFirst) visible.reverse();
  const allVisibleSelected =
    visible.length > 0 && visible.every((row) => selected.includes(row.id));
  const toggleVisible = () =>
    setSelectedIds(
      allVisibleSelected
        ? selected.filter((id) => !visible.some((row) => row.id === id))
        : [...new Set([...selected, ...visible.map((row) => row.id)])],
    );
  const toggleOne = (id: string) =>
    setSelectedIds(
      selected.includes(id)
        ? selected.filter((entry) => entry !== id)
        : [...selected, id],
    );
  const complete = inquiries.filter(
    (row) => row.jobStatus === "complete",
  ).length;
  const failed = inquiries.filter((row) => row.jobStatus === "failed").length;
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-amber-500" /> Test
            workspace
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Inquiries</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track requests and check each confirmation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <RefreshButton
            pendingSince={
              inquiries
                .filter((row) => row.jobStatus === "pending")
                .map((row) => row.updatedAt)
                .sort()
                .at(-1) ?? null
            }
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <FlaskConical /> New test inquiry
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader className="p-6 pt-12">
                <SheetTitle className="text-2xl">
                  Test the request flow
                </SheetTitle>
                <SheetDescription>
                  Submit a sample consultation request and check its
                  confirmations.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 px-6">
                <div className="rounded-lg border bg-muted/50 p-4 text-sm leading-6">
                  The confirmation email goes to your own address,{" "}
                  <strong>{staffEmail}</strong>. SMS is simulated. No borrower
                  details are collected.
                </div>
                <TestForm inquiryId={inquiryId} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Recent inquiries",
            value: inquiries.length,
            note: "Latest 20 requests",
            icon: Inbox,
          },
          {
            title: "Completed",
            value: complete,
            note: "Test workflow finished",
            icon: CheckCheck,
          },
          {
            title: "Failed",
            value: failed,
            note: "Open a request to retry",
            icon: ShieldCheck,
          },
        ].map(({ title, value, note, icon: Icon }) => (
          <Card key={title} className="shadow-none">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tracking-tight">
                {value}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6 overflow-hidden shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b p-5">
          <h2 className="font-semibold">
            All test inquiries{" "}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {inquiries.length}
            </span>
          </h2>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            {selected.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground" role="status">
                  {selected.length} selected
                </span>
                <DeleteForm
                  key={selected.join(",")}
                  ids={selected}
                  label={`Delete ${selected.length}`}
                />
              </div>
            )}
            <div className="relative min-w-0 flex-1">
              <Search className="absolute top-3 left-3 size-4 text-muted-foreground" />
              <Input
                aria-label="Search inquiries"
                placeholder="Search email or inquiry ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9 sm:w-64"
              />
            </div>
            <select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 rounded-lg border bg-background px-3 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="complete">Complete</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Latest 20 test inquiries. Times are US Eastern.
            </caption>
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="w-10 pl-5">
                  <input
                    type="checkbox"
                    aria-label="Select all shown inquiries"
                    className="size-4 accent-primary"
                    checked={allVisibleSelected}
                    disabled={visible.length === 0}
                    onChange={toggleVisible}
                  />
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Inquiry
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Status
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Email
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 font-medium"
                  aria-sort={oldestFirst ? "ascending" : "descending"}
                >
                  <button
                    className="inline-flex items-center gap-2 whitespace-nowrap"
                    onClick={() => setOldestFirst(!oldestFirst)}
                  >
                    Created (ET){" "}
                    {oldestFirst ? (
                      <ArrowUp className="size-3" />
                    ) : (
                      <ArrowDown className="size-3" />
                    )}
                  </button>
                </th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  className="border-b last:border-0 hover:bg-muted/30 data-[selected=true]:bg-muted/40"
                  data-selected={selected.includes(inquiry.id)}
                >
                  <td className="pl-5">
                    <input
                      type="checkbox"
                      aria-label={`Select inquiry ${inquiry.id}`}
                      className="size-4 accent-primary"
                      checked={selected.includes(inquiry.id)}
                      onChange={() => toggleOne(inquiry.id)}
                    />
                  </td>
                  <td className="px-5 py-5">
                    <p className="whitespace-nowrap font-medium">
                      Test consultation request
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {inquiry.recipient}
                    </p>
                  </td>
                  <td className="px-5 py-5">
                    <Status status={inquiry.jobStatus} />
                  </td>
                  <td className="px-5 py-5 text-muted-foreground">
                    {inquiry.emailId ? "Accepted" : "Pending"}
                  </td>
                  <td className="whitespace-nowrap px-5 py-5 text-muted-foreground">
                    {createdLabel(inquiry.createdAt)}
                  </td>
                  <td className="pr-4">
                    <div className="flex items-center justify-end gap-1">
                      <InquiryDetails inquiry={inquiry} />
                      <DeleteForm ids={[inquiry.id]} compact />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visible.length === 0 && (
          <div className="px-6 py-16 text-center">
            <Inbox className="mx-auto mb-3 size-7 text-muted-foreground" />
            <h3 className="font-medium">
              {inquiries.length ? "No matching inquiries" : "No inquiries yet"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {inquiries.length
                ? "Change your search or status filter."
                : "Create a test inquiry to check the request flow."}
            </p>
          </div>
        )}
        <div
          className="border-t px-5 py-3 text-xs text-muted-foreground"
          role="status"
        >
          Showing {visible.length} of {inquiries.length} recent inquiries ·
          Newest 20 loaded
        </div>
      </Card>
      <p className="mt-5 text-xs leading-5 text-muted-foreground">
        Test data only. Email acceptance does not confirm delivery. Open an
        inquiry to check delivery and SMS simulation.
      </p>
    </>
  );
}
