"use client";

import Link from "next/link";
import { redirect } from "next/navigation";

export default function FAQPage() {
  // إعادة التوجيه إلى صفحة المساعدة التي تحتوي على الأسئلة الشائعة
  redirect("/help");
}
