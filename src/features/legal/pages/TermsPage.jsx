import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Home,
  Mail,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Store,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

function TermsPage() {
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
              <FileText size={16} />
              Terms of Use
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Masharti ya Matumizi ya CloveNet Soko
            </h1>

            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-slate-300 sm:text-lg">
              Masharti haya yanaeleza namna ya kutumia CloveNet Soko kwa
              usahihi, uwajibikaji wa wateja na wauzaji, pamoja na tahadhari
              muhimu wakati wa kufanya miamala.
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
                to="/privacy"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                Soma Privacy
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
              <ShieldCheck size={22} strokeWidth={2.7} />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-950">
                Matumizi salama na yenye uwajibikaji
              </h2>

              <p className="mt-3 text-sm font-medium leading-7 text-slate-600 sm:text-base">
                CloveNet Soko inalenga kujenga mazingira rahisi kwa wateja na
                wauzaji. Kwa kutumia mfumo huu, mtumiaji anakubali kutumia
                huduma kwa uaminifu, tahadhari, na kufuata maelekezo ya msingi
                yaliyowekwa kwenye masharti haya.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <TermsBlock
            icon={<ShoppingBag size={22} />}
            title="1. Kuhusu CloveNet Soko"
          >
            <p>
              CloveNet Soko ni mfumo wa kidigitali unaolenga kuwaunganisha
              wauzaji na wateja kwa njia rahisi. Mfumo huu unasaidia kuonesha
              bidhaa, kuweka taarifa za maduka, kurahisisha oda, na kuwezesha
              mawasiliano kati ya mteja na muuzaji.
            </p>

            <p>
              Kwa hatua ya sasa ya MVP / Pilot, baadhi ya huduma zinaweza kuwa
              bado zinaendelea kuboreshwa kabla ya mfumo kuwa rasmi kikamilifu
              kwa matumizi makubwa.
            </p>
          </TermsBlock>

          <TermsBlock
            icon={<Store size={22} />}
            title="2. Masharti kwa wauzaji"
          >
            <p>
              Muuzaji anatakiwa kuweka taarifa sahihi za duka, bidhaa, bei,
              picha, maelezo, na njia za mawasiliano. Bidhaa zinazowekwa kwenye
              mfumo zinapaswa kuwa halali na zisikiuke sheria, maadili, au haki
              za watu wengine.
            </p>

            <p>
              Muuzaji anawajibika kuhakikisha bidhaa anayoweka inapatikana, bei
              ni sahihi, na mteja anapewa taarifa za kweli kabla ya makubaliano
              au malipo yoyote.
            </p>
          </TermsBlock>

          <TermsBlock
            icon={<ShoppingBag size={22} />}
            title="3. Masharti kwa wateja"
          >
            <p>
              Mteja anatakiwa kusoma maelezo ya bidhaa, bei, taarifa za duka,
              na kuwasiliana na muuzaji ili kuthibitisha bidhaa kabla ya kufanya
              malipo au makubaliano yoyote.
            </p>

            <p>
              Mteja anashauriwa kuchukua tahadhari kabla ya kutuma fedha,
              kushiriki taarifa binafsi, au kukubaliana na makabidhiano ya
              bidhaa nje ya mfumo.
            </p>
          </TermsBlock>

          <TermsBlock
            icon={<CreditCard size={22} />}
            title="4. Malipo na makabidhiano"
          >
            <p>
              Kwa hatua ya sasa, CloveNet Soko inaweza kusaidia kuunganisha
              mteja na muuzaji, lakini malipo na makabidhiano yanaweza kufanyika
              kwa maelewano kati ya pande hizo mbili.
            </p>

            <p>
              CloveNet Soko haiwajibiki moja kwa moja kwa hasara, udanganyifu,
              kuchelewa kwa bidhaa, au migogoro inayotokana na makubaliano
              yaliyofanyika nje ya mfumo rasmi wa malipo.
            </p>
          </TermsBlock>

          <TermsBlock
            icon={<MessageCircle size={22} />}
            title="5. Mawasiliano kupitia WhatsApp"
          >
            <p>
              Baadhi ya sehemu za mfumo zinaweza kumpeleka mtumiaji kwenye
              WhatsApp ili kuendelea na mawasiliano. Mawasiliano hayo yatakuwa
              chini ya matumizi na sera za WhatsApp.
            </p>

            <p>
              Mtumiaji anapaswa kuwa makini na taarifa anazoshiriki kupitia
              WhatsApp, ikiwemo taarifa za malipo, namba za siri, au taarifa
              nyingine nyeti.
            </p>
          </TermsBlock>

          <TermsBlock
            icon={<ShieldAlert size={22} />}
            title="6. Matumizi yasiyoruhusiwa"
          >
            <p>
              Hairuhusiwi kutumia CloveNet Soko kwa udanganyifu, kutangaza
              bidhaa haramu, kuweka taarifa za uongo, kuiga biashara ya mtu
              mwingine, kuvuruga mfumo, au kufanya shughuli zinazokiuka sheria.
            </p>

            <p>
              CloveNet Soko inaweza kuzuia, kuficha, au kuondoa akaunti, duka,
              au bidhaa endapo itaonekana inakiuka masharti haya au inaweka
              watumiaji wengine kwenye hatari.
            </p>
          </TermsBlock>

          <TermsBlock
            icon={<AlertTriangle size={22} />}
            title="7. Ukomo wa uwajibikaji"
          >
            <p>
              CloveNet Soko inajitahidi kutoa huduma bora, lakini haitoi dhamana
              kwamba mfumo hautakuwa na changamoto za kiufundi, makosa ya data,
              au usumbufu wa muda wakati wa kipindi cha MVP / Pilot.
            </p>

            <p>
              Mtumiaji anakubali kutumia mfumo kwa uelewa kwamba baadhi ya
              vipengele vinaendelea kuboreshwa na kwamba tahadhari binafsi ni
              muhimu wakati wa kufanya maamuzi ya biashara.
            </p>
          </TermsBlock>

          <TermsBlock icon={<Mail size={22} />} title="8. Mawasiliano na msaada">
            <p>
              Kama una swali kuhusu masharti haya, changamoto ya matumizi, au
              taarifa unayotaka kuripoti, unaweza kuwasiliana nasi kupitia
              ukurasa wa msaada.
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
          </TermsBlock>
        </div>

        <div className="mt-10 rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-sm font-medium leading-7 text-amber-900 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <AlertTriangle size={22} strokeWidth={2.7} />
            </div>

            <div>
              <h2 className="font-black text-amber-950">Kumbuka</h2>

              <p className="mt-2">
                Masharti haya ni ya awali kwa hatua ya MVP / Pilot.
                Yataboreshwa zaidi kadiri CloveNet Soko itakavyoongeza backend,
                verification, mfumo rasmi wa malipo, na sera kamili za
                uendeshaji.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] bg-[var(--color-navy)] p-6 text-white shadow-sm sm:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[var(--color-green)]">
                <ShieldCheck size={22} strokeWidth={2.7} />
              </div>

              <h2 className="mt-4 text-2xl font-black">
                Soma pia sera ya faragha
              </h2>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-300">
                Privacy Policy inaeleza namna CloveNet Soko inavyoshughulikia
                taarifa za wateja, wauzaji, bidhaa, na mawasiliano ndani ya
                mfumo.
              </p>
            </div>

            <Link
              to="/privacy"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-green)] px-5 py-3 text-sm font-black text-[var(--color-navy)] transition hover:bg-[var(--color-green-dark)] hover:text-white"
            >
              Fungua Privacy
              <ChevronRight size={17} strokeWidth={2.7} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function TermsBlock({ icon, title, children }) {
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

export default TermsPage