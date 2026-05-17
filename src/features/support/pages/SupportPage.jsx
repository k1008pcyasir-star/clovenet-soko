import {
  ArrowLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  Home,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Store,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

function SupportPage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Hero */}
      <section className="bg-[var(--color-navy)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
            >
              <ArrowLeft size={17} strokeWidth={2.6} />
              Rudi Nyuma
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
            >
              <Home size={17} strokeWidth={2.6} />
              Rudi Mwanzo
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-green)]/30 bg-[var(--color-green)]/10 px-4 py-2 text-sm font-bold text-[var(--color-green)]">
              <HelpCircle size={16} />
              CloveNet Soko Support
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Msaada kwa wateja na wauzaji
            </h1>

            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-slate-300 sm:text-lg">
              Pata mwongozo wa kutumia CloveNet Soko: jinsi ya kuangalia
              bidhaa, kuweka oda, kufungua duka, na kuwasiliana nasi kwa msaada
              zaidi.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://wa.me/255776378529"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
              >
                <MessageCircle size={18} strokeWidth={2.7} />
                Wasiliana WhatsApp
              </a>

              <Link
                to="/soko"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                Angalia Bidhaa
                <ChevronRight size={18} strokeWidth={2.7} />
              </Link>

              <Link
                to="/vendor/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                Fungua Duka
                <ChevronRight size={18} strokeWidth={2.7} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <SupportCard
            icon={<ShoppingBag size={24} />}
            title="Kwa Wateja"
            description="Jifunze jinsi ya kutafuta bidhaa, kuangalia taarifa za bidhaa, kuongeza kwenye kikapu, na kuwasiliana na muuzaji."
            items={[
              "Fungua ukurasa wa Soko",
              "Chagua bidhaa unayotaka",
              "Angalia bei na maelezo",
              "Weka kwenye kikapu au wasiliana na muuzaji",
            ]}
            actionLabel="Angalia Soko"
            actionPath="/soko"
          />

          <SupportCard
            icon={<Store size={24} />}
            title="Kwa Wauzaji"
            description="Mwongozo wa kuanza kuuza kupitia CloveNet Soko kwa kufungua akaunti ya duka na kusimamia bidhaa zako."
            items={[
              "Fungua duka lako",
              "Jaza taarifa za biashara",
              "Ongeza bidhaa zako",
              "Pokea oda kupitia mfumo na WhatsApp",
            ]}
            actionLabel="Fungua Duka"
            actionPath="/vendor/register"
          />

          <SupportCard
            icon={<ShieldCheck size={24} />}
            title="Usalama na Uaminifu"
            description="Tunashauri wateja na wauzaji kufuata tahadhari za msingi kabla ya malipo au makabidhiano ya bidhaa."
            items={[
              "Hakiki taarifa za bidhaa",
              "Wasiliana na muuzaji kabla ya malipo",
              "Epuka kutuma fedha bila uhakika",
              "Ripoti changamoto kupitia support",
            ]}
            actionLabel="Soma Privacy"
            actionPath="/privacy"
          />
        </div>

        {/* FAQ */}
        <div className="mt-12 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[var(--color-border)] sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                FAQ
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Maswali yanayoulizwa mara kwa mara
              </h2>
            </div>

            <Link
              to="/terms"
              className="inline-flex items-center gap-2 text-sm font-black text-[var(--color-green-dark)] transition hover:text-[var(--color-navy)]"
            >
              Soma Masharti
              <ChevronRight size={16} strokeWidth={2.7} />
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <FaqItem
              question="Je, ninawezaje kuweka oda?"
              answer="Unaweza kuangalia bidhaa kwenye ukurasa wa Soko, kisha kuongeza bidhaa kwenye kikapu au kuwasiliana na muuzaji kupitia njia zilizowekwa."
            />

            <FaqItem
              question="Je, muuzaji anawezaje kufungua duka?"
              answer="Muuzaji anaweza kubonyeza Fungua Duka Lako, kujaza taarifa za biashara, kisha kuanza kuongeza bidhaa zake."
            />

            <FaqItem
              question="Je, CloveNet Soko inapokea malipo?"
              answer="Kwa MVP hii, malipo yanaweza kufanyika kwa maelewano kati ya mteja na muuzaji. Mfumo wa malipo ya ndani unaweza kuongezwa kwenye hatua zinazofuata."
            />

            <FaqItem
              question="Nikipata tatizo nifanye nini?"
              answer="Unaweza kuwasiliana nasi kupitia WhatsApp, simu, au email kwa msaada zaidi."
            />
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12">
          <div className="mb-5">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              Mawasiliano
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Njia za kupata msaada
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <ContactCard
              icon={<MessageCircle size={22} />}
              title="WhatsApp"
              value="Wasiliana nasi kupitia WhatsApp"
              href="https://wa.me/255776378529"
            />

            <ContactCard
              icon={<Phone size={22} />}
              title="Simu"
              value="Piga simu kwa support"
              href="tel:+255776378529"
            />

            <ContactCard
              icon={<Mail size={22} />}
              title="Email"
              value="support@clovenet.co.tz"
              href="mailto:support@clovenet.co.tz"
            />
          </div>
        </div>

        {/* Legal CTA */}
        <div className="mt-12 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-navy)] p-6 text-white shadow-sm sm:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[var(--color-green)]">
                <FileText size={22} strokeWidth={2.7} />
              </div>

              <h2 className="mt-4 text-2xl font-black">
                Soma sera na masharti ya matumizi
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-300">
                Kwa kuwa CloveNet Soko ipo kwenye hatua ya MVP / Pilot, ni
                muhimu kwa wateja na wauzaji kuelewa sera ya faragha, masharti
                ya matumizi, na tahadhari za miamala.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Link
                to="/privacy"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
              >
                Privacy Policy
                <ChevronRight size={17} strokeWidth={2.7} />
              </Link>

              <Link
                to="/terms"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                Masharti
                <ChevronRight size={17} strokeWidth={2.7} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function SupportCard({
  icon,
  title,
  description,
  items,
  actionLabel,
  actionPath,
}) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[var(--color-border)] transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
        {icon}
      </div>

      <h2 className="mt-5 text-xl font-black text-slate-950">{title}</h2>

      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
        {description}
      </p>

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm font-medium text-slate-700"
          >
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-green)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Link
        to={actionPath}
        className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[var(--color-green-dark)] transition hover:text-[var(--color-navy)]"
      >
        {actionLabel}
        <ChevronRight size={16} strokeWidth={2.7} />
      </Link>
    </div>
  )
}

function FaqItem({ question, answer }) {
  return (
    <div className="rounded-2xl bg-[var(--color-bg)] p-5 ring-1 ring-[var(--color-border)]">
      <h3 className="font-black text-slate-950">{question}</h3>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
        {answer}
      </p>
    </div>
  )
}

function ContactCard({ icon, title, value, href }) {
  const isExternal = href.startsWith("http")

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className="group rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[var(--color-border)] transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-navy)] text-[var(--color-green)]">
        {icon}
      </div>

      <h3 className="mt-5 font-black text-slate-950">{title}</h3>

      <p className="mt-2 text-sm font-medium text-slate-600 group-hover:text-[var(--color-green-dark)]">
        {value}
      </p>
    </a>
  )
}

export default SupportPage