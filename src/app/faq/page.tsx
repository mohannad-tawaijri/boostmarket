"use client";

import Link from "next/link";
import { redirect } from "next/navigation";

export default function FAQPage() {
  // Redirect to help page which has FAQs
  redirect("/help");
}
