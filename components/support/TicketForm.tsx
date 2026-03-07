"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TerminalLine } from "@/components/terminal/TerminalLine";

const schema = z.object({
  name: z.string().min(1, "Name required").max(100),
  email: z.string().email("Valid email required").max(200),
  issue: z.string().min(10, "Please describe the issue (min 10 chars)").max(3000),
  website: z.string().max(0).optional(), // honeypot
});

type FormData = z.infer<typeof schema>;

interface TicketFormProps {
  prefillIssue?: string;
  aiResponse?: string;
}

export function TicketForm({ prefillIssue, aiResponse }: TicketFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { issue: prefillIssue ?? "" },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, aiResponse }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-[var(--color-border)] p-4 bg-[var(--color-surface)]">
        <TerminalLine prompt="[OK]">ticket submitted. ian will get back to you.</TerminalLine>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Honeypot */}
      <input {...register("website")} className="hidden" tabIndex={-1} aria-hidden />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">name</Label>
          <Input id="name" placeholder="your name" {...register("name")} />
          {errors.name && <p className="text-xs text-[var(--color-danger)]">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-xs text-[var(--color-danger)]">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="issue">issue description</Label>
        <Textarea
          id="issue"
          placeholder="describe your technical issue in detail..."
          rows={5}
          {...register("issue")}
        />
        {errors.issue && <p className="text-xs text-[var(--color-danger)]">{errors.issue.message}</p>}
      </div>

      <Button type="submit" disabled={submitting} variant="default">
        {submitting ? "submitting..." : "submit ticket"}
      </Button>
    </form>
  );
}
