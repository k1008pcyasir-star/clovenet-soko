import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Database,
  FileText,
  Home,
  Lock,
  Mail,
  MessageCircle,
  ShieldCheck,
  UserCheck,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

function PrivacyPage() {
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
              <ShieldCheck size={16} />
              Privacy Policy
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Sera ya Faragha ya CloveNet Soko
            </h1>

            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-slate-300 sm:text-lg">
              Sera hii inaeleza kwa lugha rahisi namna CloveNet Soko
              inavyoshughulikia taarifa za wateja, wauzaji, bidhaa, na
              mawasiliano yanayofanyika ndani ya mfumo.
            </p>

            <div className="mt-6 inline-flex rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-slate-300">
              Toleo la MVP / Pilot • Imesasishwa: Mei 2026
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/support"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
              >
                Wasiliana Support
                <ChevronRight size={18} strokeWidth={2.7} />
              </Link>

              <Link
                to="/terms"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                Soma Masharti
                <ChevronRight size={18} strokeWidth={2.7} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
              <Lock size={22} strokeWidth={2.7} />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-950">
                Ahadi yetu kuhusu faragha
              </h2>

              <p className="mt-3 text-sm font-medium leading-7 text-slate-600 sm:text-base">
                CloveNet Soko inalenga kutumia taarifa muhimu tu zinazohitajika
                kuendesha marketplace, kusaidia oda, kuboresha huduma, na
                kuongeza uaminifu kati ya wateja na wauzaji.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <PolicyBlock
            icon={<UserCheck size={22} />}
            title="1. Taarifa tunazoweza kukusanya"
          >
            <p>
              CloveNet Soko inaweza kukusanya taarifa za msingi zinazohitajika
              ili mfumo ufanye kazi. Taarifa hizo zinaweza kujumuisha jina la
              mtumiaji, namba ya simu, taarifa za duka, taarifa za bidhaa,
              kikapu cha manunuzi, na mawasiliano kati ya mteja na muuzaji.
            </p>

            <p>
              Kwa wauzaji, tunaweza kuhifadhi taarifa za duka kama jina la
              biashara, maelezo ya biashara, picha za bidhaa, bei, na taarifa
              nyingine zinazosaidia kuonyesha bidhaa kwa wateja.
            </p>
          </PolicyBlock>

          <PolicyBlock
            icon={<Database size={22} />}
            title="2. Matumizi ya taarifa"
          >
            <p>
              Taarifa zinazokusanywa hutumika kuwezesha huduma za msingi za
              CloveNet Soko, kama kuonyesha bidhaa, kurahisisha oda, kusimamia
              kikapu, kusaidia wauzaji kuweka bidhaa, na kuboresha uzoefu wa
              mtumiaji.
            </p>

            <p>
              Pia taarifa zinaweza kutumika kwa mawasiliano ya msaada, uboreshaji
              wa huduma, na kuhakikisha mfumo unaendelea kufanya kazi kwa njia
              salama na yenye uaminifu.
            </p>
          </PolicyBlock>

          <PolicyBlock
            icon={<MessageCircle size={22} />}
            title="3. Matumizi ya WhatsApp"
          >
            <p>
              CloveNet Soko ni mfumo unaorahisisha biashara kwa kuunganisha
              wateja na wauzaji, ikiwemo kupitia WhatsApp. Mteja akibofya link
              ya WhatsApp, anaweza kuhamishwa kwenda WhatsApp ili kuendelea na
              mazungumzo na muuzaji.
            </p>

            <p>
              Mawasiliano yatakayofanyika ndani ya WhatsApp yatakuwa chini ya
              sera na masharti ya WhatsApp. CloveNet Soko haiwezi kudhibiti moja
              kwa moja mazungumzo au taarifa zinazoshirikiwa nje ya mfumo.
            </p>
          </PolicyBlock>

          <PolicyBlock
            icon={<Lock size={22} />}
            title="4. Usalama wa taarifa"
          >
            <p>
              Tunachukua tahadhari za msingi kulinda taarifa za watumiaji na
              kupunguza matumizi yasiyo sahihi ya data. Hata hivyo, kwa kuwa huu
              ni mfumo wa MVP / Pilot, baadhi ya vipengele vya usalama
              vitaendelea kuboreshwa kadiri mfumo unavyoendelea kukua.
            </p>

            <p>
              Watumiaji wanashauriwa kutoshiriki taarifa nyeti kama password,
              PIN za miamala, au taarifa za siri za kifedha kupitia sehemu zisizo
              rasmi.
            </p>
          </PolicyBlock>

          <PolicyBlock
            icon={<AlertTriangle size={22} />}
            title="5. Tahadhari kuhusu malipo na makabidhiano"
          >
            <p>
              Kwa hatua ya sasa ya MVP, malipo na makabidhiano yanaweza kufanyika
              kwa maelewano kati ya mteja na muuzaji. Mtumiaji anapaswa
              kuhakikisha taarifa za bidhaa, bei, eneo, na muuzaji kabla ya
              kufanya malipo au makubaliano yoyote.
            </p>

            <p>
              CloveNet Soko inaweza kutoa njia ya kuwasiliana na muuzaji, lakini
              haipaswi kuchukuliwa kama dhamana ya moja kwa moja ya muamala
              mpaka mfumo rasmi wa uthibitisho na malipo utakapoanzishwa.
            </p>
          </PolicyBlock>

          <PolicyBlock
            icon={<Database size={22} />}
            title="6. Uhifadhi wa taarifa"
          >
            <p>
              Taarifa zinaweza kuhifadhiwa kwa muda unaohitajika ili kutoa
              huduma, kutatua changamoto za watumiaji, kuboresha mfumo, au
              kutimiza mahitaji ya kiutendaji.
            </p>

            <p>
              Kadiri mfumo utakavyokua, CloveNet Soko inaweza kuongeza sera
              kamili zaidi kuhusu muda wa kuhifadhi taarifa, kufuta akaunti, na
              kuomba nakala ya taarifa za mtumiaji.
            </p>
          </PolicyBlock>

          <PolicyBlock icon={<Mail size={22} />} title="7. Mawasiliano">
            <p>
              Kama una swali kuhusu sera hii ya faragha au matumizi ya taarifa
              zako, unaweza kuwasiliana nasi kupitia ukurasa wa msaada.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/support"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-navy)] px-5 py-3 text-sm font-black text-white transition hover:bg-[var(--color-navy-soft)]"
              >
                Fungua Support
                <ChevronRight size={17} strokeWidth={2.7} />
              </Link>

              <a
                href="mailto:support@clovenet.co.tz"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] px-5 py-3 text-sm font-black text-slate-800 transition hover:border-[var(--color-green)] hover:text-[var(--color-green-dark)]"
              >
                support@clovenet.co.tz
              </a>
            </div>
          </PolicyBlock>
        </div>

        <div className="mt-10 rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-sm font-medium leading-7 text-amber-900 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <AlertTriangle size={22} strokeWidth={2.7} />
            </div>

            <div>
              <h2 className="font-black text-amber-950">Kumbuka</h2>

              <p className="mt-2">
                Hii ni sera ya awali kwa hatua ya MVP / Pilot. Itaboreshwa
                zaidi kadiri CloveNet Soko itakavyoongeza backend, database
                rasmi, mfumo wa malipo, na vipengele vya verification.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] bg-[var(--color-navy)] p-6 text-white shadow-sm sm:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[var(--color-green)]">
                <FileText size={22} strokeWidth={2.7} />
              </div>

              <h2 className="mt-4 text-2xl font-black">
                Soma pia masharti ya matumizi
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-300">
                Masharti ya matumizi yanaeleza wajibu wa wateja, wauzaji,
                tahadhari za malipo, na namna ya kutumia CloveNet Soko kwa
                usahihi.
              </p>
            </div>

            <Link
              to="/terms"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
            >
              Fungua Terms
              <ChevronRight size={17} strokeWidth={2.7} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function PolicyBlock({ icon, title, children }) {
  return (
    <article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[var(--color-border)] transition hover:-translate-y-0.5 hover:shadow-md sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-green-soft)] text-[var(--color-green-dark)]">
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-950">{title}</h2>

          <div className="mt-4 space-y-4 text-sm font-medium leading-7 text-slate-600 sm:text-base">
            {children}
          </div>
        </div>
      </div>
    </article>
  )
}

export default PrivacyPage