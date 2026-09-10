"use client";
// Shadcnblocks sidebar1. Navigation points only to implemented destinations.
import type { ReactNode } from "react";
import Link from "next/link";
import { Inbox, Globe, FileText, Shield } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
export function CrmShell({
  children,
  studioUrl,
}: {
  children: ReactNode;
  studioUrl: string;
}) {
  return (
    <SidebarProvider>
      <a
        href="#workspace"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-white focus:p-4"
      >
        Skip to inquiries
      </a>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/crm">
                  <span className="flex aspect-square size-8 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                    <Shield className="size-5" />
                  </span>
                  <span className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">VA Loans for Vets</span>
                    <span className="text-xs text-muted-foreground">
                      Team workspace
                    </span>
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <Link href="/crm" aria-current="page">
                      <Inbox />
                      Inquiries
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup>
            <SidebarGroupLabel>Content</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/">
                      <Globe />
                      View website
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href={studioUrl}>
                      <FileText />
                      Sanity Studio
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                Workspace
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inquiries</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <UserButton />
          </div>
        </header>
        <main
          id="workspace"
          className="mx-auto w-full max-w-[1440px] flex-1 p-4 md:p-8"
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
