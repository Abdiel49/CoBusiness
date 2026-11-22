import { formatMinor, multiplyMinor } from "@/domain/demo/money";
import type { DemoOffer, DemoOrder } from "@/domain/demo/types";
import { DataRow, ProgressMeter, StatusChip } from "./components";
import {
  commercialStatusLabel,
  commercialStatusTone,
  escrowStatusLabel,
  escrowStatusTone,
  formatDate,
  formatUnits,
  paymentStatusLabel,
  paymentStatusTone,
} from "./format";
import type { OfferProgress } from "./types";

export function OfferSummary({
  offer,
  progress,
  buyerOrder,
}: {
  offer: DemoOffer;
  progress: OfferProgress;
  buyerOrder: DemoOrder | null;
}) {
  const totalValueMinor = multiplyMinor(offer.blockPriceMinor, offer.totalBlocks);

  return (
    <aside className="identity-summary" aria-labelledby="identity-summary-title">
      <div className="identity-summary-head">
        <h2 id="identity-summary-title">{offer.title}</h2>
        <p>{offer.productDescription}</p>
      </div>

      <ProgressMeter progress={progress} />

      <div className="identity-chip-group">
        <div className="identity-chip-item">
          <span className="identity-chip-label">Estado comercial</span>
          <StatusChip label={commercialStatusLabel(offer.commercialStatus)} tone={commercialStatusTone(offer.commercialStatus)} />
        </div>
        <div className="identity-chip-item">
          <span className="identity-chip-label">Estado del pago</span>
          <StatusChip label={escrowStatusLabel(offer.escrowStatus)} tone={escrowStatusTone(offer.escrowStatus)} />
        </div>
      </div>

      <dl className="identity-rows">
        <DataRow label="Operador">{offer.operatorName}</DataRow>
        <DataRow label="Producto">{offer.productDescription}</DataRow>
        <DataRow label="Unidad">
          <span className="identity-num">
            {offer.unitsPerBlock} {offer.unitLabel} por bloque
          </span>
        </DataRow>
        <DataRow label="Bloques totales">
          <span className="identity-num">{offer.totalBlocks}</span>
        </DataRow>
        <DataRow label="Confirmados">
          <span className="identity-num">{progress.confirmedBlocks}</span>
        </DataRow>
        <DataRow label="Pendientes">
          <span className="identity-num">{progress.pendingBlocks}</span>
        </DataRow>
        <DataRow label="Disponibles">
          <span className="identity-num">{progress.availableBlocks}</span>
        </DataRow>
        <DataRow label="Precio por bloque">
          <span className="identity-num">{formatMinor(offer.blockPriceMinor)}</span>
        </DataRow>
        <DataRow label="Valor total de la operación">
          <span className="identity-num">{formatMinor(totalValueMinor)}</span>
        </DataRow>
        <DataRow label="Plazo">{formatDate(offer.deadline)}</DataRow>
        <DataRow label="Términos">
          <span className="identity-num">Versión {offer.termsVersion}</span>
        </DataRow>
      </dl>

      <p className="identity-fixed-note">Alcanzar la meta no autoriza la liberación.</p>

      {buyerOrder ? (
        <div className="identity-your-reservation">
          <div className="identity-your-reservation-head">
            <h3>Tu reserva</h3>
            <StatusChip label={paymentStatusLabel(buyerOrder.paymentStatus)} tone={paymentStatusTone(buyerOrder.paymentStatus)} />
          </div>
          <p className="identity-num">
            {buyerOrder.blockCount} bloques · {formatUnits(buyerOrder.blockCount, offer.unitsPerBlock, offer.unitLabel)} ·{" "}
            {formatMinor(buyerOrder.amountMinor)}
          </p>
          {buyerOrder.paymentStatus === "pending" ? (
            <p className="identity-fineprint">Reserva pendiente. Todavía no cuenta para la meta.</p>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
