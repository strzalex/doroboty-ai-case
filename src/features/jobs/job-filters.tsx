import Link from "next/link";
import type { JobFilters } from "@/features/jobs/types";
import {
  categoryLabels,
  contractLabels,
  functionLabels,
  remoteLabels,
  seniorityLabels,
} from "@/features/jobs/presentation";

export function JobFiltersForm({ filters }: { filters: JobFilters }) {
  return (
    <form
      className="grid gap-3 border-2 bg-secondary p-4 md:grid-cols-3 lg:grid-cols-7"
      action="/oferty"
    >
      <label className="md:col-span-3 lg:col-span-2">
        <span className="font-ui text-xs font-bold tracking-[0.08em] uppercase">Szukaj</span>
        <input
          className="mt-1 h-11 w-full border-2 bg-card px-3 font-ui outline-none focus:ring-4 focus:ring-primary"
          name="query"
          defaultValue={filters.query}
          placeholder="Rola albo firma"
        />
      </label>
      <FilterSelect
        name="category"
        label="Kategoria"
        value={filters.category}
        options={categoryLabels}
      />
      <FilterSelect
        name="function"
        label="Funkcja"
        value={filters.function}
        options={functionLabels}
      />
      <FilterSelect
        name="remote"
        label="Tryb pracy"
        value={filters.remote}
        options={remoteLabels}
      />
      <FilterSelect
        name="seniority"
        label="Poziom"
        value={filters.seniority}
        options={seniorityLabels}
      />
      <FilterSelect
        name="contract"
        label="Umowa"
        value={filters.contract}
        options={contractLabels}
      />
      <div className="flex items-end gap-2 md:col-span-3 lg:col-span-7">
        <button
          className="h-11 border-2 bg-primary px-5 font-ui font-bold tracking-[0.08em] uppercase shadow-[3px_3px_0_var(--foreground)]"
          type="submit"
        >
          Filtruj
        </button>
        <Link className="px-3 py-2 font-ui text-sm font-bold underline" href="/oferty">
          Wyczyść
        </Link>
      </div>
    </form>
  );
}

function FilterSelect({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value?: string;
  options: Record<string, string>;
}) {
  return (
    <label>
      <span className="font-ui text-xs font-bold tracking-[0.08em] uppercase">{label}</span>
      <select
        className="mt-1 h-11 w-full border-2 bg-card px-2 font-ui outline-none focus:ring-4 focus:ring-primary"
        name={name}
        defaultValue={value ?? ""}
      >
        <option value="">Wszystkie</option>
        {Object.entries(options).map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
