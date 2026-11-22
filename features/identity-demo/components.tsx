"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { formatMinor } from "@/domain/demo/money";
import type { DemoEvent, DemoOffer, DemoOrder } from "@/domain/demo/types";
import { actorLabel, formatDateTime, formatUnits, type StatusTone } from "./format";
import { CloseIcon } from "./icons";
import type { OfferProgress } from "./types";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export function StatusChip({ label, tone = "neutral" }: { label: string; tone?: StatusTone }) {
  return <span className={`identity-chip identity-chip--${tone}`}>{label}</span>;
}

export function ResultBanner({
  tone,
  title,
  children,
}: {
  tone: StatusTone;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className={`identity-result identity-result--${tone}`}>
      <strong>{title}</strong>
      {children ? <div className="identity-result-body">{children}</div> : null}
    </div>
  );
}

export function ProgressMeter({ progress }: { progress: OfferProgress }) {
  return (
    <div className="identity-progress-block">
      <div className="identity-progress-head">
        <span className="identity-progress-label">
          <strong className="identity-num">{progress.confirmedBlocks}</strong>
          <span> / {progress.totalBlocks} bloques confirmados</span>
        </span>
        <span className="identity-progress-percent identity-num">{progress.percent} %</span>
      </div>
      <div
        className="identity-progress"
        role="progressbar"
        aria-label="Progreso de la meta colectiva"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        aria-valuetext={`${progress.confirmedBlocks} de ${progress.totalBlocks} bloques confirmados (${progress.percent} %)`}
      >
        <span className="identity-progress-fill" style={{ width: `${progress.percent}%` }} />
      </div>
      {progress.pendingBlocks > 0 ? (
        <p className="identity-progress-note">
          <span className="identity-num">{progress.pendingBlocks}</span> bloques pendientes no cuentan para la meta.
        </p>
      ) : null}
    </div>
  );
}

export function DataRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="identity-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="identity-empty">{children}</p>;
}

export function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const node = dialogRef.current;
    const focusables = getFocusable(node);
    const initial = node?.querySelector<HTMLElement>("[data-autofocus]") ?? focusables[0] ?? node;
    initial?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = getFocusable(dialogRef.current);
      if (items.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, []);

  return (
    <div
      className="identity-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="identity-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="identity-dialog-head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="identity-dialog-close" onClick={onClose} aria-label="Cerrar">
            <CloseIcon />
          </button>
        </div>
        {description ? (
          <p className="identity-dialog-description" id={descriptionId}>
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}

export function OrderSummary({ order, offer }: { order: DemoOrder; offer: DemoOffer }) {
  return (
    <dl className="identity-rows identity-dialog-rows">
      <DataRow label="Bloques">
        <span className="identity-num">{order.blockCount}</span>
      </DataRow>
      <DataRow label="Unidades">
        <span className="identity-num">{formatUnits(order.blockCount, offer.unitsPerBlock, offer.unitLabel)}</span>
      </DataRow>
      <DataRow label="Monto">
        <span className="identity-num">{formatMinor(order.amountMinor)}</span>
      </DataRow>
    </dl>
  );
}

export function EventLog({ events }: { events: DemoEvent[] }) {
  if (events.length === 0) {
    return <EmptyState>Todavía no hay eventos.</EmptyState>;
  }
  return (
    <ul className="identity-events">
      {events.map((event) => (
        <li className="identity-event" key={event.id}>
          <div className="identity-event-meta">
            <strong>{actorLabel(event.actor)}</strong>
            <span>{event.action}</span>
            <span>{formatDateTime(event.occurredAt)}</span>
            <StatusChip label="Simulado" />
          </div>
          <p>{event.description}</p>
        </li>
      ))}
    </ul>
  );
}
