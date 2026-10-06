"use client";

import { useId, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Info,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { documents, visitorDays } from "./data";

const metrics = [
  {
    label: "Łączny przychód",
    value: "5 250 zł",
    change: "+12,5%",
    title: "Wzrost w tym miesiącu",
    detail: "Wynik z ostatnich 6 miesięcy",
    up: true,
  },
  {
    label: "Nowi klienci",
    value: "1 234",
    change: "−20%",
    title: "Spadek w tym okresie",
    detail: "Pozyskiwanie wymaga uwagi",
    up: false,
  },
  {
    label: "Aktywne konta",
    value: "45 678",
    change: "+12,5%",
    title: "Klienci wracają",
    detail: "Zaangażowanie powyżej celu",
    up: true,
  },
  {
    label: "Tempo wzrostu",
    value: "4,5%",
    change: "+4,5%",
    title: "Stabilny wzrost",
    detail: "Zgodnie z prognozą",
    up: true,
  },
];
const periods = [
  { days: 90, label: "3 miesiące" },
  { days: 30, label: "30 dni" },
  { days: 7, label: "7 dni" },
];

function VisitorsChart() {
  const [days, setDays] = useState(90);
  const gradientId = useId();
  const values = visitorDays.slice(-days);
  const points = (key: "desktop" | "mobile") =>
    values
      .map((point, index) => `${(index / (values.length - 1)) * 1000},${210 - point[key] / 2}`)
      .join(" ");
  const dateLabel = (date: string) =>
    new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short", timeZone: "UTC" }).format(
      new Date(date),
    );
  return (
    <section className="visitors-card" aria-labelledby="visitors-title">
      <div className="chart-heading">
        <div>
          <h2 id="visitors-title">Odwiedzający</h2>
          <p>Przykładowy ruch z ostatnich {days} dni</p>
        </div>
        <div className="period-picker" role="group" aria-label="Okres wykresu">
          {periods.map((period) => (
            <Button
              key={period.days}
              size="sm"
              variant={days === period.days ? "secondary" : "ghost"}
              aria-pressed={days === period.days}
              onClick={() => setDays(period.days)}
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>
      <svg
        className="visitors-chart"
        viewBox="0 0 1000 220"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Przykładowy ruch na komputerach i telefonach z ostatnich ${days} dni`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-2)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {[30, 90, 150, 210].map((y) => (
          <line
            key={y}
            x1="0"
            x2="1000"
            y1={y}
            y2={y}
            stroke="var(--border)"
            strokeDasharray="3 4"
          />
        ))}
        <polygon points={`0,210 ${points("desktop")} 1000,210`} fill={`url(#${gradientId})`} />
        <polygon
          points={`0,210 ${points("mobile")} 1000,210`}
          fill="var(--chart-1)"
          opacity="0.3"
        />
        <polyline
          points={points("desktop")}
          fill="none"
          stroke="var(--chart-2)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={points("mobile")}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="chart-dates" aria-hidden="true">
        {[
          0,
          Math.floor((values.length - 1) / 3),
          Math.floor(((values.length - 1) * 2) / 3),
          values.length - 1,
        ].map((index) => (
          <span key={index}>{dateLabel(values[index].date)}</span>
        ))}
      </div>
      <div className="chart-legend">
        <span>
          <i />
          Komputery
        </span>
        <span>
          <i />
          Telefony
        </span>
      </div>
    </section>
  );
}

export function DashboardView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const filtered = documents.filter(
    (document) =>
      document.title
        .toLocaleLowerCase("pl-PL")
        .includes(search.trim().toLocaleLowerCase("pl-PL")) &&
      (status === "all" || document.status === status),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const visible = filtered.slice(page * 10, page * 10 + 10);
  const selectedCount = filtered.filter((document) => selected.includes(document.id)).length;
  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <h1>Dokumenty</h1>
        <Badge variant="outline">Przykładowe dane</Badge>
      </div>
      <aside className="dashboard-info" aria-label="Informacja o demonstracji">
        <Info size={20} aria-hidden="true" />
        <div>
          <strong>To jest demonstracja.</strong>
          <p>Dashboard pokazuje przykładowe dane. Możesz poprosić agenta o usunięcie tego demo.</p>
        </div>
      </aside>
      <div className="metric-grid">
        {metrics.map((metric) => {
          const Icon = metric.up ? TrendingUp : TrendingDown;
          return (
            <section className="metric-card" key={metric.label} aria-label={metric.label}>
              <div className="metric-top">
                <span>{metric.label}</span>
                <Badge variant="outline">
                  <Icon />
                  {metric.change}
                </Badge>
              </div>
              <p className="metric-value">{metric.value}</p>
              <p className="metric-title">
                {metric.title}
                <Icon size={15} />
              </p>
              <p className="metric-detail">{metric.detail}</p>
            </section>
          );
        })}
      </div>
      <VisitorsChart />
      <section aria-labelledby="documents-title" className="documents-section">
        <div className="table-toolbar">
          <h2 id="documents-title">
            Spis dokumentów <Badge variant="secondary">{documents.length}</Badge>
          </h2>
          <div className="table-filters">
            <div className="search-field">
              <Search size={16} />
              <Input
                aria-label="Szukaj dokumentów"
                placeholder="Szukaj dokumentów…"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(0);
                }}
              />
            </div>
            <select
              className="native-select filter-select"
              aria-label="Filtruj po statusie"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(0);
              }}
            >
              <option value="all">Wszystkie statusy</option>
              <option value="progress">W trakcie</option>
              <option value="done">Gotowe</option>
            </select>
          </div>
        </div>
        <div
          className="table-scroll"
          role="region"
          aria-label="Tabela dokumentów — przewiń, aby zobaczyć wszystkie kolumny"
          tabIndex={0}
        >
          <table className="documents-table">
            <caption className="sr-only">
              Przykładowe dokumenty, ich status i osoba sprawdzająca
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  <input
                    type="checkbox"
                    aria-label="Zaznacz dokumenty na tej stronie"
                    disabled={!visible.length}
                    checked={
                      visible.length > 0 &&
                      visible.every((document) => selected.includes(document.id))
                    }
                    onChange={(event) =>
                      setSelected(
                        event.target.checked
                          ? [...new Set([...selected, ...visible.map((document) => document.id)])]
                          : selected.filter(
                              (id) => !visible.some((document) => document.id === id),
                            ),
                      )
                    }
                  />
                </th>
                <th scope="col">Nazwa</th>
                <th scope="col">Typ sekcji</th>
                <th scope="col">Status</th>
                <th scope="col" className="numeric-cell">
                  Cel
                </th>
                <th scope="col" className="numeric-cell">
                  Limit
                </th>
                <th scope="col">Sprawdza</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((document) => (
                <tr key={document.id} data-selected={selected.includes(document.id)}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Zaznacz: ${document.title}`}
                      checked={selected.includes(document.id)}
                      onChange={(event) =>
                        setSelected(
                          event.target.checked
                            ? [...selected, document.id]
                            : selected.filter((id) => id !== document.id),
                        )
                      }
                    />
                  </td>
                  <th scope="row">{document.title}</th>
                  <td>
                    <Badge variant="outline">{document.type}</Badge>
                  </td>
                  <td>
                    <Badge variant="outline" className="document-status">
                      {document.status === "done" ? (
                        <CheckCircle2 className="text-[var(--color-success)]" />
                      ) : (
                        <CircleDashed />
                      )}
                      {document.status === "done" ? "Gotowe" : "W trakcie"}
                    </Badge>
                  </td>
                  <td className="numeric-cell">{document.target}</td>
                  <td className="numeric-cell">{document.limit}</td>
                  <td className="reviewer-cell">{document.reviewer}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && (
            <div className="table-empty">
              <h3>Brak pasujących dokumentów</h3>
              <p>Zmień wyszukiwanie lub status.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setStatus("all");
                  setPage(0);
                }}
              >
                Wyczyść filtry
              </Button>
            </div>
          )}
        </div>
        <div className="table-footer">
          <p role="status">
            Zaznaczono {selectedCount} z {filtered.length} dokumentów
          </p>
          <div className="table-pagination">
            <span>
              Strona {page + 1} z {pages}
            </span>
            <Button
              variant="outline"
              size="icon"
              aria-label="Poprzednia strona"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Następna strona"
              disabled={page + 1 >= pages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
