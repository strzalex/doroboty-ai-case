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
    label: "Total revenue",
    value: "PLN 5,250",
    change: "+12.5%",
    title: "Growth this month",
    detail: "Results from the last 6 months",
    up: true,
  },
  {
    label: "New customers",
    value: "1,234",
    change: "−20%",
    title: "Decline this period",
    detail: "Acquisition needs attention",
    up: false,
  },
  {
    label: "Active accounts",
    value: "45,678",
    change: "+12.5%",
    title: "Customers are returning",
    detail: "Engagement above target",
    up: true,
  },
  {
    label: "Growth rate",
    value: "4.5%",
    change: "+4.5%",
    title: "Steady growth",
    detail: "In line with the forecast",
    up: true,
  },
];
const periods = [
  { days: 90, label: "3 months" },
  { days: 30, label: "30 days" },
  { days: 7, label: "7 days" },
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
    new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", timeZone: "UTC" }).format(
      new Date(date),
    );
  return (
    <section className="visitors-card" aria-labelledby="visitors-title">
      <div className="chart-heading">
        <div>
          <h2 id="visitors-title">Visitors</h2>
          <p>Sample traffic over the last {days} days</p>
        </div>
        <div className="period-picker" role="group" aria-label="Chart period">
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
        aria-label={`Sample traffic on desktop and mobile over the last ${days} days`}
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
          Desktop
        </span>
        <span>
          <i />
          Mobile
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
        .toLocaleLowerCase("en-US")
        .includes(search.trim().toLocaleLowerCase("en-US")) &&
      (status === "all" || document.status === status),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const visible = filtered.slice(page * 10, page * 10 + 10);
  const selectedCount = filtered.filter((document) => selected.includes(document.id)).length;
  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <h1>Documents</h1>
        <Badge variant="outline">Sample data</Badge>
      </div>
      <aside className="dashboard-info" aria-label="Demo information">
        <Info size={20} aria-hidden="true" />
        <div>
          <strong>This is a demo.</strong>
          <p>The dashboard uses sample data. You can ask the agent to remove this demo.</p>
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
            Document list <Badge variant="secondary">{documents.length}</Badge>
          </h2>
          <div className="table-filters">
            <div className="search-field">
              <Search size={16} />
              <Input
                aria-label="Search documents"
                placeholder="Search documents…"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(0);
                }}
              />
            </div>
            <select
              className="native-select filter-select"
              aria-label="Filter by status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(0);
              }}
            >
              <option value="all">All statuses</option>
              <option value="progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
        <div
          className="table-scroll"
          role="region"
          aria-label="Document table — scroll to see all columns"
          tabIndex={0}
        >
          <table className="documents-table">
            <caption className="sr-only">Sample documents, their status, and reviewer</caption>
            <thead>
              <tr>
                <th scope="col">
                  <input
                    type="checkbox"
                    aria-label="Select documents on this page"
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
                <th scope="col">Name</th>
                <th scope="col">Section type</th>
                <th scope="col">Status</th>
                <th scope="col" className="numeric-cell">
                  Target
                </th>
                <th scope="col" className="numeric-cell">
                  Limit
                </th>
                <th scope="col">Reviewer</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((document) => (
                <tr key={document.id} data-selected={selected.includes(document.id)}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Select: ${document.title}`}
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
                      {document.status === "done" ? "Done" : "In progress"}
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
              <h3>No matching documents</h3>
              <p>Change the search or status filter.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setStatus("all");
                  setPage(0);
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
        <div className="table-footer">
          <p role="status">
            Selected {selectedCount} of {filtered.length} documents
          </p>
          <div className="table-pagination">
            <span>
              Page {page + 1} of {pages}
            </span>
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous page"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next page"
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
