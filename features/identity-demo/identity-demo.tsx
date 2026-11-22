"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { FlowResult } from "@/domain/demo/flow";
import { formatMinor } from "@/domain/demo/money";
import { useDemo } from "@/domain/demo/provider";
import { getBuyerOrders, getCommission, getOffer, getOfferProgress, getRefundSummary } from "@/domain/demo/selectors";
import type { DemoOffer, DemoOrder, DemoWallet, WalletNetwork } from "@/domain/demo/types";
import { BuyerTab } from "./buyer-tab";
import { CoBusinessTab } from "./cobusiness-tab";
import { OrderSummary } from "./components";
import { ConfirmDialog, RefundAmountSummary, SignatureDialog } from "./dialogs";
import { OperatorTab } from "./operator-tab";
import { OfferSummary } from "./summary";
import type { DialogState, IdentityTab, OfferProgress, ServiceOutcome } from "./types";

const OFFER_ID = "demo-offer-1";
const BUYER_ID = "demo-buyer";
const BUYER_ALIAS = "Tu negocio (demo)";
const DEMO_WALLET_ADDRESS = "GDEMO0000000000000000000000000000000000000000000000000DEMO";
const WRONG_NETWORK_MESSAGE = "Estás en la red pública simulada. Cambia a Testnet para continuar. No se realizó ningún cargo.";
const TERMS_MESSAGE = "Acepta los términos simulados para continuar.";
const INVALID_COUNT_MESSAGE = "Ingresa un número entero de bloques mayor que cero.";

const TABS: Array<{ id: IdentityTab; label: string }> = [
  { id: "buyer", label: "Comprador" },
  { id: "operator", label: "Operador" },
  { id: "admin", label: "CoBusiness" },
];

function compareNewest(a: DemoOrder, b: DemoOrder): number {
  const diff = Date.parse(b.createdAt) - Date.parse(a.createdAt);
  return diff !== 0 ? diff : b.id.localeCompare(a.id);
}

function sortOrders(orders: DemoOrder[]): DemoOrder[] {
  return [...orders].sort(compareNewest);
}

function callService(action: () => FlowResult): ServiceOutcome {
  try {
    const result = action();
    return result.ok ? result : { ok: false, message: result.error.message };
  } catch {
    return { ok: false, message: "No se pudieron guardar los datos de la demo. Reintenta o reinicia la demostración." };
  }
}

function resolvePurchaseBlocker({
  offer,
  progress,
  wallet,
  termsAccepted,
  blockCount,
  hasPendingOrder,
}: {
  offer: DemoOffer;
  progress: OfferProgress;
  wallet: DemoWallet;
  termsAccepted: boolean;
  blockCount: number;
  hasPendingOrder: boolean;
}): string | null {
  if (offer.commercialStatus !== "collecting") return "La oferta ya no acepta reservas.";
  if (!wallet.address || !wallet.network) return "Conecta una wallet simulada para reservar.";
  if (wallet.network !== "TESTNET") return WRONG_NETWORK_MESSAGE;
  if (progress.availableBlocks <= 0) return "No quedan bloques disponibles en esta oferta.";
  if (hasPendingOrder) return "Tienes una reserva pendiente. Reanúdala o cancélala antes de reservar otra.";
  if (!termsAccepted) return TERMS_MESSAGE;
  if (!Number.isSafeInteger(blockCount) || blockCount <= 0) return INVALID_COUNT_MESSAGE;
  if (blockCount > progress.availableBlocks) return `Solo quedan ${progress.availableBlocks} bloques disponibles. Ajusta la cantidad.`;
  return null;
}

function PageHeader({ onReset }: { onReset?: () => void }) {
  return (
    <header className="identity-header">
      <div className="identity-header-brand">
        <Link href="/" className="identity-brand">
          CoBusiness<span>.</span>
        </Link>
        <Link href="/" className="identity-header-link">
          Volver al inicio
        </Link>
      </div>
      <div className="identity-header-meta">
        <p className="identity-simulation-notice">Demostración local. Sin pagos, API ni Stellar. Sin fondos reales.</p>
        <button type="button" className="identity-button identity-button--secondary" onClick={onReset} disabled={!onReset}>
          Reiniciar demo
        </button>
      </div>
    </header>
  );
}

function Intro() {
  return (
    <section className="identity-intro" aria-labelledby="identity-title">
      <div className="identity-intro-main">
        <h1 id="identity-title">Prueba una compra colectiva de principio a fin</h1>
        <div className="identity-intro-copy">
          <p>Reserva bloques como comprador, responde como operador y autoriza como CoBusiness.</p>
          <p>Cada paso usa datos ficticios y estados simulados; puedes recorrer los dos resultados posibles.</p>
        </div>
      </div>
      <p className="identity-disclaimer">Demostración local. Sin pagos, API ni Stellar. Sin fondos reales.</p>
    </section>
  );
}

export function IdentityDemo() {
  const { state, error, loading, reset, reload, services } = useDemo();
  const [activeTab, setActiveTab] = useState<IdentityTab>("buyer");
  const [notice, setNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [blockCountInput, setBlockCountInput] = useState("4");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dialogTriggerRef = useRef<HTMLElement | null>(null);

  const offer = useMemo(() => (state ? getOffer(state, OFFER_ID) : undefined), [state]);
  const progress = useMemo(() => (state ? getOfferProgress(state, OFFER_ID) : null), [state]);
  const buyerOrders = useMemo(() => (state ? sortOrders(getBuyerOrders(state, BUYER_ID)) : []), [state]);
  const pendingOrder = useMemo(() => buyerOrders.find((order) => order.paymentStatus === "pending") ?? null, [buyerOrders]);
  const confirmedOrder = useMemo(() => buyerOrders.find((order) => order.paymentStatus === "confirmed") ?? null, [buyerOrders]);
  const refundableOrder = useMemo(
    () => buyerOrders.find((order) => order.paymentStatus === "confirmed" && order.refundStatus === "none") ?? null,
    [buyerOrders],
  );
  const claimedOrder = useMemo(
    () => buyerOrders.find((order) => order.paymentStatus === "confirmed" && order.refundStatus === "claimed") ?? null,
    [buyerOrders],
  );
  const commission = useMemo(() => (state ? getCommission(state, OFFER_ID) : null), [state]);
  const refundSummary = useMemo(() => (state ? getRefundSummary(state, OFFER_ID) : null), [state]);
  const allOrders = useMemo(() => (state ? sortOrders(state.orders) : []), [state]);
  const events = useMemo(() => {
    if (!state) return [];
    return [...state.events].sort((a, b) => {
      const diff = Date.parse(b.occurredAt) - Date.parse(a.occurredAt);
      return diff !== 0 ? diff : b.id.localeCompare(a.id);
    });
  }, [state]);
  const hasUnclaimedSeededOrders = useMemo(
    () =>
      Boolean(
        state?.orders.some(
          (order) =>
            order.offerId === OFFER_ID &&
            order.seeded &&
            order.paymentStatus === "confirmed" &&
            order.refundStatus === "none",
        ),
      ),
    [state],
  );

  const wallet: DemoWallet = state?.wallet ?? { address: null, network: null, connectedAt: null };
  const parsedBlockCount = blockCountInput.trim() === "" ? Number.NaN : Number(blockCountInput);
  const purchaseBlocker =
    offer && progress
      ? resolvePurchaseBlocker({
          offer,
          progress,
          wallet,
          termsAccepted,
          blockCount: parsedBlockCount,
          hasPendingOrder: Boolean(pendingOrder),
        })
      : null;

  function announce(message: string) {
    setErrorNotice(null);
    setDialogError(null);
    setNotice(message);
  }

  function openDialog(next: DialogState) {
    const active = document.activeElement;
    dialogTriggerRef.current = active instanceof HTMLElement ? active : null;
    setDialogError(null);
    setDialog(next);
  }

  function closeDialog() {
    const activeIndex = Math.max(
      TABS.findIndex((tab) => tab.id === activeTab),
      0,
    );
    setDialog(null);
    setDialogError(null);
    requestAnimationFrame(() => {
      const trigger = dialogTriggerRef.current;
      if (trigger?.isConnected && !(trigger instanceof HTMLButtonElement && trigger.disabled)) {
        trigger.focus();
        return;
      }
      tabRefs.current[activeIndex]?.focus();
    });
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = TABS.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setActiveTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  }

  if (loading) {
    return (
      <main className="identity-page">
        <PageHeader />
        <Intro />
        <div className="identity-shell">
          <div className="identity-state identity-state--loading" role="status">
            <h2>Cargando la demostración…</h2>
            <div className="identity-skeleton" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="identity-page">
        <PageHeader />
        <Intro />
        <div className="identity-shell">
          <div className="identity-state" role="alert">
            <h2>No se pudieron cargar los datos de la demo.</h2>
            {error !== "No se pudieron cargar los datos de la demo." ? <p>{error}</p> : null}
            <div className="identity-actions">
              <button type="button" className="identity-button identity-button--primary" onClick={reload}>
                Reintentar
              </button>
              <button type="button" className="identity-button identity-button--secondary" onClick={() => reset()}>
                Reiniciar datos
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!state || !offer || !progress || !commission || !refundSummary) {
    return (
      <main className="identity-page">
        <PageHeader />
        <Intro />
        <div className="identity-shell">
          <div className="identity-state">
            <h2>No se encontró la oferta de ejemplo.</h2>
            <p>Reinicia los datos de la demostración para recuperar la oferta inicial.</p>
            <div className="identity-actions">
              <button type="button" className="identity-button identity-button--primary" onClick={() => reset()}>
                Reiniciar datos
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  function handleConnect(network: WalletNetwork) {
    if (!services) return;
    const outcome = callService(() => services.wallet.connect(DEMO_WALLET_ADDRESS, network));
    if (!outcome.ok) {
      setErrorNotice(outcome.message);
      return;
    }
    announce(
      network === "TESTNET"
        ? "Wallet simulada conectada en Testnet."
        : "Wallet simulada conectada en la red pública. Cambia a Testnet para continuar.",
    );
  }

  function handleDisconnect() {
    if (!services) return;
    const outcome = callService(() => services.wallet.disconnect());
    if (!outcome.ok) {
      setErrorNotice(outcome.message);
      return;
    }
    announce("Wallet simulada desconectada.");
  }

  function handleSetNetwork(network: WalletNetwork) {
    if (!services) return;
    const outcome = callService(() => services.wallet.setNetwork(network));
    if (!outcome.ok) {
      setErrorNotice(outcome.message);
      return;
    }
    announce(network === "TESTNET" ? "Red cambiada a Testnet simulada." : "Red cambiada a la red pública simulada.");
  }

  function handlePurchase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!services || !offer) return;
    if (purchaseBlocker) {
      setErrorNotice(purchaseBlocker);
      return;
    }
    const blockCount = Number(blockCountInput);
    const outcome = callService(() =>
      services.orders.create({
        offerId: offer.id,
        buyerId: BUYER_ID,
        buyerAlias: BUYER_ALIAS,
        blockCount,
        termsAccepted,
      }),
    );
    if (!outcome.ok) {
      setErrorNotice(outcome.message);
      return;
    }
    const created = sortOrders(
      outcome.state.orders.filter(
        (order) => order.buyerId === BUYER_ID && !order.seeded && order.paymentStatus === "pending",
      ),
    )[0];
    if (created) {
      announce("Reserva pendiente. Todavía no cuenta para la meta.");
      openDialog({ kind: "signature", orderId: created.id });
    }
    setTermsAccepted(false);
  }

  function handleApproveSignature(orderId: string) {
    if (!services) return;
    const outcome = callService(() => services.orders.confirm(orderId));
    if (!outcome.ok) {
      setDialogError(outcome.message);
      return;
    }
    closeDialog();
    announce("Pago simulado confirmado.");
  }

  function handleRejectSignature(orderId: string) {
    if (!services) return;
    const outcome = callService(() => services.orders.fail(orderId, "signature_rejected"));
    if (!outcome.ok) {
      setDialogError(outcome.message);
      return;
    }
    closeDialog();
    announce("Firma rechazada. La reserva no se confirmó y no se descontó nada. Puedes reintentar.");
  }

  function handleNetworkError(orderId: string) {
    if (!services) return;
    const outcome = callService(() => services.orders.fail(orderId, "network_error"));
    if (!outcome.ok) {
      setDialogError(outcome.message);
      return;
    }
    closeDialog();
    announce("Error de red simulado. La reserva no se confirmó. Puedes reintentar.");
  }

  function handleCancelReservation(orderId: string) {
    if (!services) return;
    const outcome = callService(() => services.orders.fail(orderId, "cancelled"));
    if (!outcome.ok) {
      setDialogError(outcome.message);
      return;
    }
    closeDialog();
    announce("Reserva cancelada. No se descontó nada.");
  }

  function handleRetry(orderId: string) {
    if (!services) return;
    const outcome = callService(() => services.orders.retry(orderId));
    if (!outcome.ok) {
      setErrorNotice(outcome.message);
      return;
    }
    const retried = outcome.state.orders.find((order) => order.id === orderId);
    if (retried && retried.paymentStatus === "pending") {
      announce("Reserva pendiente. Todavía no cuenta para la meta.");
      openDialog({ kind: "signature", orderId });
    }
  }

  function handleClaimRefund(orderId: string) {
    if (!services) return;
    const outcome = callService(() => services.orders.claimRefund(orderId));
    if (!outcome.ok) {
      setDialogError(outcome.message);
      return;
    }
    closeDialog();
    announce("Reembolso simulado reclamado.");
  }

  function handleOperatorContinue() {
    if (!services) return;
    const outcome = callService(() => services.offers.respond(OFFER_ID, "continue"));
    if (!outcome.ok) {
      setDialogError(outcome.message);
      return;
    }
    closeDialog();
    announce("El operador continúa. CoBusiness debe autorizar la liberación.");
  }

  function handleOperatorDecline() {
    if (!services) return;
    const outcome = callService(() => services.offers.respond(OFFER_ID, "decline"));
    if (!outcome.ok) {
      setDialogError(outcome.message);
      return;
    }
    closeDialog();
    announce("El operador rechazó la operación. CoBusiness debe habilitar las devoluciones.");
  }

  function handleAuthorizeRelease() {
    if (!services) return;
    const outcome = callService(() => services.offers.authorizeRelease(OFFER_ID));
    if (!outcome.ok) {
      setDialogError(outcome.message);
      return;
    }
    closeDialog();
    announce("Operación liberada (simulada).");
  }

  function handleEnableRefund() {
    if (!services) return;
    const outcome = callService(() => services.offers.enableRefund(OFFER_ID));
    if (!outcome.ok) {
      setDialogError(outcome.message);
      return;
    }
    closeDialog();
    announce("Devoluciones habilitadas (simuladas).");
  }

  function handleSettleRefunds() {
    if (!services) return;
    const outcome = callService(() => services.offers.settleSeedRefunds(OFFER_ID));
    if (!outcome.ok) {
      setDialogError(outcome.message);
      return;
    }
    closeDialog();
    announce("Reembolsos de ejemplo liquidados (simulados).");
  }

  function handleReset() {
    const success = reset();
    closeDialog();
    if (success) {
      announce("Datos de la demo reiniciados.");
      setBlockCountInput("4");
      setTermsAccepted(false);
    }
  }

  const selectedTab = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];
  const latestBuyerOrder = buyerOrders[0] ?? null;
  const signatureOrder =
    dialog?.kind === "signature" ? state.orders.find((order) => order.id === dialog.orderId) ?? null : null;
  const cancelOrder =
    dialog?.kind === "cancel-order" ? state.orders.find((order) => order.id === dialog.orderId) ?? null : null;
  const claimOrder =
    dialog?.kind === "claim-refund" ? state.orders.find((order) => order.id === dialog.orderId) ?? null : null;

  return (
    <main className="identity-page">
      <PageHeader onReset={() => openDialog({ kind: "reset" })} />
      <Intro />

      <div className="identity-shell">
        <div className="identity-live" aria-live="polite" role="status">
          {notice ? <p className="identity-notice">{notice}</p> : null}
        </div>
        {errorNotice ? (
          <p className="identity-alert" role="alert">
            {errorNotice}
          </p>
        ) : null}

        <div className="identity-workspace">
          <OfferSummary offer={offer} progress={progress} buyerOrder={latestBuyerOrder} />

          <section className="identity-panel-area" aria-label="Panel de la demostración">
            <div className="identity-tabs" role="tablist" aria-label="Vistas de la demostración">
              {TABS.map((tab, index) => (
                <button
                  key={tab.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`identity-tab-${tab.id}`}
                  aria-selected={activeTab === tab.id}
                  aria-controls={`identity-panel-${tab.id}`}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  className={activeTab === tab.id ? "identity-tab identity-tab--active" : "identity-tab"}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div
              className="identity-panel"
              role="tabpanel"
              id={`identity-panel-${selectedTab.id}`}
              aria-labelledby={`identity-tab-${selectedTab.id}`}
              tabIndex={0}
            >
              {activeTab === "buyer" ? (
                <BuyerTab
                  offer={offer}
                  progress={progress}
                  wallet={wallet}
                  orders={buyerOrders}
                  pendingOrder={pendingOrder}
                  confirmedOrder={confirmedOrder}
                  refundableOrder={refundableOrder}
                  claimedOrder={claimedOrder}
                  blockCountInput={blockCountInput}
                  onBlockCountChange={setBlockCountInput}
                  termsAccepted={termsAccepted}
                  onTermsChange={setTermsAccepted}
                  purchaseBlocker={purchaseBlocker}
                  onPurchase={handlePurchase}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                  onSetNetwork={handleSetNetwork}
                  onOpenSignature={(orderId) => openDialog({ kind: "signature", orderId })}
                  onCancelReservation={(orderId) => openDialog({ kind: "cancel-order", orderId })}
                  onRetry={handleRetry}
                  onClaimRefund={(orderId) => openDialog({ kind: "claim-refund", orderId })}
                />
              ) : null}
              {activeTab === "operator" ? (
                <OperatorTab
                  offer={offer}
                  progress={progress}
                  orders={allOrders}
                  onContinue={() => openDialog({ kind: "operator-continue" })}
                  onDecline={() => openDialog({ kind: "operator-decline" })}
                />
              ) : null}
              {activeTab === "admin" ? (
                <CoBusinessTab
                  offer={offer}
                  progress={progress}
                  orders={allOrders}
                  events={events}
                  commission={commission}
                  refundSummary={refundSummary}
                  hasUnclaimedSeededOrders={hasUnclaimedSeededOrders}
                  onAuthorizeRelease={() => openDialog({ kind: "authorize-release" })}
                  onEnableRefund={() => openDialog({ kind: "enable-refund" })}
                  onSettleRefunds={() => openDialog({ kind: "settle-refunds" })}
                />
              ) : null}
            </div>
          </section>
        </div>
      </div>

      {dialog?.kind === "signature" && signatureOrder ? (
        <SignatureDialog
          order={signatureOrder}
          offer={offer}
          error={dialogError}
          onApprove={() => handleApproveSignature(signatureOrder.id)}
          onReject={() => handleRejectSignature(signatureOrder.id)}
          onNetworkError={() => handleNetworkError(signatureOrder.id)}
          onClose={closeDialog}
        />
      ) : null}

      {dialog?.kind === "cancel-order" && cancelOrder ? (
        <ConfirmDialog
          title="Cancelar reserva"
          description="La reserva pendiente se marcará como cancelada. No se descontó nada y no se envió ningún pago."
          confirmLabel="Cancelar reserva"
          error={dialogError}
          onConfirm={() => handleCancelReservation(cancelOrder.id)}
          onClose={closeDialog}
        >
          <OrderSummary order={cancelOrder} offer={offer} />
        </ConfirmDialog>
      ) : null}

      {dialog?.kind === "claim-refund" && claimOrder ? (
        <ConfirmDialog
          title="Reclamar reembolso simulado"
          description="Se marcará tu reserva confirmada como reembolsada en la demostración. No se transferirá dinero real."
          confirmLabel="Reclamar reembolso"
          error={dialogError}
          onConfirm={() => handleClaimRefund(claimOrder.id)}
          onClose={closeDialog}
        >
          <RefundAmountSummary amountMinor={claimOrder.amountMinor} />
        </ConfirmDialog>
      ) : null}

      {dialog?.kind === "operator-continue" ? (
        <ConfirmDialog
          title="Continuar con la operación"
          description="El operador confirma que continuará con la operación. La liberación todavía requiere la autorización de CoBusiness. No se liberan fondos en este paso."
          confirmLabel="Continuar con la operación"
          error={dialogError}
          onConfirm={handleOperatorContinue}
          onClose={closeDialog}
        />
      ) : null}

      {dialog?.kind === "operator-decline" ? (
        <ConfirmDialog
          title="Rechazar la operación"
          description="El operador rechaza la operación. CoBusiness deberá habilitar las devoluciones. No se liberan fondos."
          confirmLabel="Rechazar la operación"
          error={dialogError}
          onConfirm={handleOperatorDecline}
          onClose={closeDialog}
        />
      ) : null}

      {dialog?.kind === "authorize-release" ? (
        <ConfirmDialog
          title="Autorizar liberación"
          description="CoBusiness autoriza la liberación simulada de la operación. Se marcará como liberada. No se transfiere dinero real."
          confirmLabel="Autorizar liberación"
          error={dialogError}
          onConfirm={handleAuthorizeRelease}
          onClose={closeDialog}
        >
          <dl className="identity-rows identity-dialog-rows">
            <div className="identity-row">
              <dt>Monto bruto</dt>
              <dd className="identity-num">{formatMinor(commission.grossMinor)}</dd>
            </div>
            <div className="identity-row">
              <dt>Comisión</dt>
              <dd className="identity-num">{formatMinor(commission.commissionMinor)}</dd>
            </div>
            <div className="identity-row">
              <dt>Monto neto</dt>
              <dd className="identity-num">{formatMinor(commission.netMinor)}</dd>
            </div>
          </dl>
          <p className="identity-fineprint">Comisión ilustrativa de CoBusiness ({commission.rateBps / 100} %).</p>
        </ConfirmDialog>
      ) : null}

      {dialog?.kind === "enable-refund" ? (
        <ConfirmDialog
          title="Habilitar devoluciones"
          description="CoBusiness habilita las devoluciones simuladas. Habilitar no es un pago; cada comprador debe reclamar su reembolso en la demostración."
          confirmLabel="Habilitar devoluciones"
          error={dialogError}
          onConfirm={handleEnableRefund}
          onClose={closeDialog}
        >
          <RefundAmountSummary amountMinor={refundSummary.totalRefundMinor} />
        </ConfirmDialog>
      ) : null}

      {dialog?.kind === "settle-refunds" ? (
        <ConfirmDialog
          title="Liquidar reembolsos de ejemplo"
          description="Se marcarán como reembolsados los pedidos de demostración que aún no reclamaron su devolución. Es una ayuda de la demo y no un pago real."
          confirmLabel="Liquidar reembolsos"
          error={dialogError}
          onConfirm={handleSettleRefunds}
          onClose={closeDialog}
        >
          <dl className="identity-rows identity-dialog-rows">
            <div className="identity-row">
              <dt>Pedidos elegibles</dt>
              <dd className="identity-num">{refundSummary.eligibleOrders}</dd>
            </div>
            <div className="identity-row">
              <dt>Monto reembolsable</dt>
              <dd className="identity-num">{formatMinor(refundSummary.totalRefundMinor)}</dd>
            </div>
            <div className="identity-row">
              <dt>Comisión</dt>
              <dd>Sin comisión</dd>
            </div>
          </dl>
        </ConfirmDialog>
      ) : null}

      {dialog?.kind === "reset" ? (
        <ConfirmDialog
          title="Reiniciar demo"
          description="Se borrarán los datos locales de esta demostración. No afecta cuentas ni fondos reales."
          confirmLabel="Reiniciar datos"
          error={dialogError}
          onConfirm={handleReset}
          onClose={closeDialog}
        />
      ) : null}
    </main>
  );
}
