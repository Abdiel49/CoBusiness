type IconName =
  | "mark"
  | "users"
  | "layers"
  | "shield"
  | "cart"
  | "user"
  | "package"
  | "warehouse"
  | "check"
  | "cross"
  | "flag"
  | "laptop"
  | "settings"
  | "network"
  | "arrow";

type RoadmapPhase = {
  id: string;
  label: string;
  status: string;
  icon: IconName;
  summary: string;
  compactSummary?: string[];
  features: string[];
  condition?: string;
};

const phases: RoadmapPhase[] = [
  {
    id: "mvp",
    label: "MVP",
    status: "Planificado",
    icon: "laptop",
    summary:
      "Validar la compra colectiva y sus resultados en Stellar Testnet, sin fondos reales.",
    features: [
      "Cuentas de comprador y operador, con acceso administrativo mínimo.",
      "Ofertas con producto, precio, MOQ, fecha límite y condiciones básicas.",
      "Descubrimiento de ofertas, selección de cantidades y participación de compradores.",
      "Conexión de wallet y aportes de prueba en Stellar Testnet.",
      "Escrow Soroban mínimo con contribuciones, fecha límite y control de autorización.",
      "Liberación sujeta a aprobación comercial simulada y reembolsos elegibles si no se alcanza el objetivo.",
      "Estados y referencias de transacción con recorridos de éxito y fallo reproducibles.",
    ],
  },
  {
    id: "phase-two",
    label: "Fase 2",
    status: "Planificado",
    icon: "layers",
    summary:
      "Más opciones de pedidos y herramientas de gestión para compradores y operadores.",
    features: [
      "Perfiles de operadores y ofertas por invitación para sus redes comerciales.",
      "Variantes de producto, reservas y cantidades comprometidas.",
      "Panel de comprador y panel de operador con estados comerciales y financieros separados.",
      "Avisos sobre vencimientos, mínimos alcanzados y cambios de estado.",
      "Medición de conversión y tiempo operativo para validar el piloto.",
    ],
  },
  {
    id: "phase-three",
    label: "Fase 3",
    status: "Condicional",
    icon: "settings",
    summary:
      "Preparar verificación y pagos de producción con resguardos comerciales y financieros.",
    condition:
      "Depende de preparación legal, contractual, de seguridad y de proveedores. No implica aceptar fondos reales antes de cumplir esos requisitos.",
    features: [
      "Flujos aplicables de KYC y KYB con datos sensibles protegidos fuera de la cadena.",
      "Pagos de producción y conciliación con operaciones en Stellar.",
      "Liberaciones por hitos con autorización y evidencia revisada.",
      "Cancelaciones y gestión formal de disputas.",
      "Historial financiero, auditoría y controles operativos.",
    ],
  },
  {
    id: "phase-four",
    label: "Fase 4",
    status: "Planificado",
    icon: "network",
    summary:
      "Expresar demanda de compradores y comparar cotizaciones de operadores para nuevas compras B2B.",
    compactSummary: [
      "Demanda de compradores;",
      "cotizaciones de operadores",
      "para comparar opciones B2B.",
    ],
    features: [
      "Solicitudes de productos y grupos de demanda.",
      "Votos e interés diferenciados de una compra confirmada.",
      "Cotizaciones de operadores con precio, MOQ, fechas y condiciones.",
      "Comparación de propuestas y conversión de una cotización aceptada en una orden colectiva.",
      "Descubrimiento de ofertas e historial comercial verificado.",
    ],
  },
];

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const common = {
    "aria-hidden": true as const,
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 48 48",
  };

  switch (name) {
    case "mark":
      return (
        <svg {...common}>
          <path d="m24 4 19 10.5v19L24 44 5 33.5v-19L24 4Z" fill="currentColor" stroke="none" />
          <path d="m14 18 10-5.5L34 18l-10 5.5L14 18Zm0 8 10 5.5L34 26" stroke="white" strokeWidth="2.4" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="18" cy="15" r="6" />
          <circle cx="33" cy="17" r="5" />
          <path d="M6 38c0-7 5-12 12-12s12 5 12 12M30 27c7 0 12 4 12 10" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <path d="m24 6 18 9-18 9L6 15l18-9Z" />
          <path d="m7 24 17 9 17-9M7 33l17 9 17-9" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M24 5 39 11v11c0 10-6 16-15 21C15 38 9 32 9 22V11l15-6Z" />
          <path d="m17 24 5 5 10-11" />
        </svg>
      );
    case "cart":
      return (
        <svg {...common}>
          <path d="M6 9h5l4 22h20l5-16H13M18 38h.1M33 38h.1" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="24" cy="15" r="7" />
          <path d="M9 41c0-9 6-15 15-15s15 6 15 15" />
        </svg>
      );
    case "package":
      return (
        <svg {...common}>
          <path d="m24 5 18 10v19L24 44 6 34V15L24 5Z" />
          <path d="m6 15 18 10 18-10M24 25v19M15 10l18 10v9" />
        </svg>
      );
    case "warehouse":
      return (
        <svg {...common}>
          <path d="M5 20 24 8l19 12v21H5V20Z" />
          <path d="M14 41V25h20v16M19 30h10M19 35h10" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="18" />
          <path d="m15 24 6 6 12-13" />
        </svg>
      );
    case "cross":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="18" />
          <path d="m18 18 12 12m0-12L18 30" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M11 42V7m1 2h25l-6 8 6 8H12" />
        </svg>
      );
    case "laptop":
      return (
        <svg {...common}>
          <rect x="8" y="8" width="32" height="24" rx="2" />
          <path d="M4 38h40l-3 4H7l-3-4Z" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="7" />
          <path d="M24 4v7m0 26v7M4 24h7m26 0h7M10 10l5 5m18 18 5 5m0-28-5 5m-18 18-5 5" />
        </svg>
      );
    case "network":
      return (
        <svg {...common}>
          <circle cx="24" cy="10" r="5" />
          <circle cx="10" cy="35" r="5" />
          <circle cx="38" cy="35" r="5" />
          <path d="m21 15-8 15m14-15 8 15M15 35h18" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M6 24h35m-13-13 13 13-13 13" />
        </svg>
      );
  }
}

function RoadmapCard({
  phase,
  compact = false,
}: {
  phase: RoadmapPhase;
  compact?: boolean;
}) {
  return (
    <article className={`roadmap-card roadmap-card--${phase.id}${compact ? " roadmap-card--compact" : ""}`}>
      <div className="roadmap-card__heading">
        <Icon name={phase.icon} className="roadmap-card__icon" />
        <h3>{phase.label}</h3>
        <span className={`status status--${phase.status === "Condicional" ? "conditional" : "planned"}`}>
          {phase.status}
        </span>
      </div>
      <p className="roadmap-card__summary">
        {compact && phase.compactSummary
          ? phase.compactSummary.map((line, index) => (
              <span key={line}>
                {line}
                {index < phase.compactSummary!.length - 1 && (
                  <>
                    {" "}
                    <br className="compact-summary-break" />
                  </>
                )}
              </span>
            ))
          : phase.summary}
      </p>
      {!compact && (
        <>
          {phase.condition && <p className="roadmap-card__condition">{phase.condition}</p>}
          <ul className="roadmap-card__features">
            {phase.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}

export default function Home() {
  return (
    <div className="landing-page">
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>

      <div className="first-screen">
        <header className="site-header">
          <a className="brand-mark" href="#top" aria-label="CoBusiness, inicio">
            <Icon name="mark" />
          </a>
          <a className="brand-name" href="#top" id="top">
            CoBusiness
          </a>
          <p className="brand-description">Compras colectivas B2B<br />para importadores y operadores en Bolivia</p>
          <nav className="header-navigation" aria-label="Navegación principal">
            <a href="#how-it-works">Cómo funciona</a>
            <a href="#mvp">MVP</a>
            <a href="#roadmap">Roadmap</a>
            <a href="/login">Acceder</a>
          </nav>
          <a className="header-action" href="/identidad">
            Explorar la demo <Icon name="arrow" />
          </a>
        </header>

        <main id="main-content" className="hero-main">
          <section className="hero-copy" aria-labelledby="hero-title">
            <h1 id="hero-title" className="hero-headline">
              Unir pedidos para alcanzar el mínimo de compra
            </h1>
            <p className="hero-description">
              CoBusiness es un proyecto B2B en Bolivia para que varios negocios reúnan pedidos y alcancen el mínimo de compra (MOQ) de un importador, con condiciones claras desde el inicio.
            </p>
            <ul className="benefit-list" aria-label="Beneficios de la compra colectiva">
              <li className="benefit-row benefit-row--one">
                <span className="benefit-icon"><Icon name="users" /></span>
                <span className="benefit-copy">
                  <strong>Varios compradores, un solo pedido</strong>
                  <span>Se reúnen cantidades para alcanzar el mínimo de un operador.</span>
                </span>
              </li>
              <li className="benefit-row benefit-row--two">
                <span className="benefit-icon"><Icon name="layers" /></span>
                <span className="benefit-copy">
                  <strong>Condiciones visibles antes de participar</strong>
                  <span>La oferta presenta precio, MOQ, fecha límite y reglas básicas.</span>
                </span>
              </li>
              <li className="benefit-row benefit-row--three">
                <span className="benefit-icon"><Icon name="shield" /></span>
                <span className="benefit-copy">
                  <strong>Resultados condicionados desde el inicio</strong>
                <span>Si se alcanza el objetivo, se libera la compra tras aprobación comercial simulada; si no, eres elegible para el reembolso.</span>
                </span>
              </li>
            </ul>
          </section>

          <section className="offer-panel" aria-labelledby="offer-title">
            <div className="offer-heading">
              <span className="offer-icon"><Icon name="cart" /></span>
              <div className="offer-title-group">
                <h2 id="offer-title">Pedido colectivo</h2>
                <p>Ejemplo de oferta de importación con demanda combinada</p>
              </div>
              <p className="offer-disclaimer">
                <span className="info-mark" aria-hidden="true">i</span>
                Flujo ilustrativo · MVP previsto en Stellar Testnet · Sin fondos reales
              </p>
            </div>

            <ul className="buyer-list" aria-label="Participantes ilustrativos">
              <li className="buyer-row buyer-row--one"><Icon name="user" /><span>Comprador</span></li>
              <li className="buyer-row buyer-row--two"><Icon name="user" /><span>Comprador</span></li>
              <li className="buyer-row buyer-row--three"><Icon name="user" /><span>Comprador</span></li>
            </ul>

            <div className="demand-join" aria-hidden="true">
              <span className="demand-join__top" />
              <span className="demand-join__middle" />
              <span className="demand-join__bottom" />
              <span className="demand-join__stem" />
              <span className="demand-join__head" />
            </div>

            <div className="demand-node demand-node--combined">
              <Icon name="package" />
              <strong>Demanda combinada</strong>
              <span className="demand-node__mobile-arrow" aria-hidden="true"><Icon name="arrow" /></span>
            </div>
            <Icon name="arrow" className="demand-arrow" />
            <div className="demand-node demand-node--operator">
              <Icon name="warehouse" />
              <strong>MOQ del operador</strong>
            </div>

            <div className="demand-progress" aria-hidden="true">
              <span />
            </div>
            <span className="demand-progress-flag"><Icon name="flag" /></span>
            <p className="visually-hidden">Representación ilustrativa del objetivo mínimo; no refleja una orden o progreso real.</p>

            <div className="outcome-card outcome-card--success">
              <Icon name="check" />
              <div>
                <h3>Objetivo alcanzado</h3>
                <p className="success-outcome-copy">En la demo, el saldo simulado solo se libera tras la aprobación comercial del operador.</p>
              </div>
            </div>
            <div className="outcome-card outcome-card--refund">
              <Icon name="cross" />
              <div>
                <h3>Objetivo no alcanzado<br />(antes del plazo)</h3>
                <p className="refund-outcome-copy">No se realiza la compra y los compradores son elegibles para el reembolso.</p>
              </div>
            </div>
          </section>
        </main>

        <section id="roadmap-preview" className="roadmap-preview" aria-labelledby="roadmap-preview-title">
          <h2 id="roadmap-preview-title" className="roadmap-heading">Roadmap</h2>
          <p className="roadmap-intro">Evolución prevista de CoBusiness en cuatro fases, sin fechas de cierre comprometidas.</p>
          {phases.map((phase) => <RoadmapCard key={phase.id} phase={phase} compact />)}
          <Icon name="arrow" className="roadmap-arrow roadmap-arrow--one" />
          <Icon name="arrow" className="roadmap-arrow roadmap-arrow--two" />
          <Icon name="arrow" className="roadmap-arrow roadmap-arrow--three" />
        </section>
      </div>

      <section id="how-it-works" className="content-section how-section" aria-labelledby="how-title">
        <div className="section-heading">
          <h2 id="how-title">Una oferta, varios pedidos, condiciones claras</h2>
          <p>El MVP se enfoca en un recorrido completo, desde la oferta del operador hasta un resultado de pago definido.</p>
        </div>
        <ol className="workflow-list">
          <li>
            <span className="workflow-label">Operador</span>
            <h3>Publica una oferta</h3>
            <p>Define producto, precio, cantidad mínima (MOQ), fecha límite y condiciones básicas.</p>
          </li>
          <li>
            <span className="workflow-label">Compradores</span>
            <h3>Reúnen cantidades</h3>
            <p>Revisan las condiciones y aportan a una orden colectiva con una wallet de Stellar en Testnet.</p>
          </li>
          <li>
            <span className="workflow-label">Resultado</span>
            <h3>Se aplica la regla acordada</h3>
            <p>El éxito requiere autorización comercial simulada; si no se alcanza el mínimo a tiempo, aplican reembolsos elegibles.</p>
          </li>
        </ol>
      </section>

      <section id="mvp" className="content-section mvp-section" aria-labelledby="mvp-title">
        <div className="section-heading">
          <h2 id="mvp-title">Qué validará el MVP</h2>
          <p>Un flujo reproducible en Stellar Testnet, con activos de demostración y sin fondos de clientes.</p>
        </div>
        <div className="mvp-impact">
          <div className="mvp-impact__intro">
            <h3>Funcionalidades y a quién impactan</h3>
            <p>Las capacidades siguientes forman parte del alcance planeado, no describen funciones ya disponibles en esta web.</p>
          </div>
          <ul className="capability-list">
            <li><span>Operadores</span><p>Crear y publicar ofertas con producto, precio unitario, MOQ, vencimiento y condiciones.</p></li>
            <li><span>Compradores</span><p>Descubrir ofertas, revisar términos, elegir cantidades y confirmar su participación.</p></li>
            <li><span>Compradores</span><p>Conectar una wallet compatible, autorizar aportes de prueba y consultar referencias de transacción.</p></li>
            <li><span>Plataforma</span><p>Asociar aportes a la orden, controlar el objetivo y el plazo, y registrar los estados financieros y comerciales.</p></li>
            <li><span>Operadores y compradores</span><p>Recorrer un caso exitoso con aprobación comercial simulada y un caso fallido con reembolsos elegibles.</p></li>
            <li><span>Administración</span><p>Limitar la creación de ofertas a operadores autorizados y habilitar acciones administrativas mínimas para la demostración.</p></li>
          </ul>
        </div>
      </section>

      <section id="roadmap" className="content-section roadmap-details" aria-labelledby="roadmap-title">
        <div className="section-heading">
          <h2 id="roadmap-title">Roadmap del producto</h2>
          <p>Las fases muestran qué se pretende construir después de validar cada etapa. No representan fechas ni plazos de entrega.</p>
        </div>
        <div className="roadmap-details__list">
          {phases.map((phase) => <RoadmapCard key={phase.id} phase={phase} />)}
        </div>
      </section>

      <footer className="site-footer">
        <a className="footer-brand" href="#top"><Icon name="mark" />CoBusiness</a>
        <p>Comercio colectivo B2B · Bolivia</p>
        <a href="#top">Volver arriba</a>
      </footer>
    </div>
  );
}
