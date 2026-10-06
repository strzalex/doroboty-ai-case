import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Inbox, Send, UserRound } from "lucide-react";
import { requireProfile } from "@/features/auth/session";
import { getSupabaseConfig } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function WorkspaceHome() {
  if (!getSupabaseConfig().configured) return null;
  const { client, user, profile } = await requireProfile();
  const isCandidate = profile.role === "candidate";
  const { count } = isCandidate
    ? await client
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("candidate_id", user.id)
    : await client.from("applications").select("id", { count: "exact", head: true });

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="font-ui text-xs font-bold uppercase">
            {isCandidate
              ? "Strefa kandydata"
              : profile.role === "employer"
                ? "Strefa pracodawcy"
                : "Strefa operatora"}
          </p>
          <h1 className="mt-2">Cześć{profile.display_name ? `, ${profile.display_name}` : ""}.</h1>
          <p>
            {isCandidate
              ? "Pokaż konkretną pracę i aplikuj świadomie."
              : "Podejmuj decyzje na podstawie źródłowego doświadczenia."}
          </p>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <DashboardCard
          icon={isCandidate ? UserRound : Inbox}
          title={isCandidate ? "Uzupełnij profil" : "Przejrzyj kandydatów"}
          body={
            isCandidate
              ? "Dodaj doświadczenia i ich mierzalne efekty."
              : `${count ?? 0} aplikacji jest dostępnych w Twojej organizacji.`
          }
          href={isCandidate ? "/app/profil" : "/app/kandydaci"}
        />
        <DashboardCard
          icon={isCandidate ? Send : BriefcaseBusiness}
          title={isCandidate ? "Twoje aplikacje" : "Wyniki rozmów"}
          body={
            isCandidate
              ? `Masz ${count ?? 0} zapisanych aplikacji.`
              : "Zapisuj decyzję po pierwszej rozmowie i dalszy wynik."
          }
          href={isCandidate ? "/app/aplikacje" : "/app/kandydaci"}
        />
        <DashboardCard
          icon={BriefcaseBusiness}
          title="Rynek DoRoboty.ai"
          body="Przeglądaj aktywne role Build, Apply i Lead."
          href="/oferty"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: typeof UserRound;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <article className="flex flex-col border-2 bg-card p-6 shadow-[4px_4px_0_var(--foreground)]">
      <Icon className="size-7" />
      <h2 className="mt-5 font-display text-3xl uppercase">{title}</h2>
      <p className="mt-3 grow text-lg leading-relaxed">{body}</p>
      <Link
        className="mt-6 inline-flex items-center gap-2 font-ui font-bold uppercase underline"
        href={href}
      >
        Przejdź <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}
