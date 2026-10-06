import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/features/applications/application-form";
import { requireProfile } from "@/features/auth/session";
import { getPublishedJob } from "@/features/jobs/queries";

export const metadata: Metadata = { title: "Aplikuj", robots: { index: false, follow: false } };

export default async function ApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const job = await getPublishedJob((await params).slug);
  if (!job) notFound();
  const { client, user } = await requireProfile(["candidate"]);
  const [{ data: candidate }, { count: experienceCount }] = await Promise.all([
    client.from("candidate_profiles").select("headline, bio").eq("user_id", user.id).single(),
    client
      .from("candidate_experiences")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);
  const profileReady = Boolean(candidate?.headline && candidate?.bio && (experienceCount ?? 0) > 0);

  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-5 py-14 lg:grid-cols-[0.7fr_1.3fr] lg:px-8 lg:py-20">
      <div>
        <p className="font-ui text-sm font-bold tracking-[0.12em] uppercase">Aplikujesz na</p>
        <h1 className="mt-3 font-display text-5xl uppercase">{job.title}</h1>
        <p className="mt-3 font-ui font-bold">{job.company.name}</p>
        <p className="mt-6 text-lg leading-relaxed">{job.summary}</p>
        {!profileReady && (
          <div className="mt-6 border-2 bg-primary p-4">
            <strong className="font-ui">Uzupełnij profil</strong>
            <p className="mt-2">One-click będzie dostępny po dodaniu opisu i doświadczenia.</p>
            <Link className="mt-3 inline-block font-ui font-bold underline" href="/app/profil">
              Przejdź do profilu
            </Link>
          </div>
        )}
      </div>
      <ApplicationForm jobId={job.id} profileReady={profileReady} />
    </section>
  );
}
