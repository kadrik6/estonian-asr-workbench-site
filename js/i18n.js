// Shared translation layer for the Estonian ASR Workbench results site.
//
// Scope discipline (do not weaken this when adding strings):
// - Translate: UI chrome -- nav, headings, captions, labels, filters, legend,
//   methodology prose, button/control text, empty states.
// - NEVER translate or reformat: system/model/provider names, WER/CER/other
//   numeric values, hashes/commits, URLs, provenance identifiers, raw
//   metadata text (known_limitations/known_unknowns/source, and any
//   not_benchmarked_reason), or any benchmark reference/system transcript
//   text. Those all come from site-data/ and are rendered as-is regardless
//   of UI language -- see callers in compare.js/systems.js/transcripts.js.
//
// Default language is "et" for any visitor who hasn't chosen one yet.
// Never inferred from navigator.language / Accept-Language.

const LANG_STORAGE_KEY = "wb_lang";
const DEFAULT_LANG = "et";

const TRANSLATIONS = {
  et: {
    nav: {
      home: "Avaleht",
      compare: "Võrdlus",
      transcripts: "Transkriptsioonid",
      systems: "Süsteemid",
      methodology: "Metoodika",
      soon: "peagi",
    },
    brand: { pre: "Eesti ASR", accent: "võrdluskeskkond" },
    common: {
      scopeStrip: "Võrdleb olemasolevaid eesti keele kõnetuvastussüsteeme. Ei arenda ega treeni kõnetuvastusmudeleid.",
      footerTagline: "Eesti ASR võrdluskeskkond — võrdlusprojekt, mitte toode. Täpsem info lehtedel „Metoodika” ja „Meist”.",
      footerExported: "eksporditud",
      footerBenchmarked: "süsteemi hinnatud",
      unknownLong: "Teadmata / avalikult dokumenteerimata",
      dash: "—",
      category: {
        "estonian-specialized-local": "Eesti keelele spetsialiseeritud, kohalik",
        "general-multilingual-open": "Üldine mitmekeelne, avatud",
        "commercial-cloud": "Kommerts- / pilveteenus",
      },
      family: {
        "wav2vec2 + CTC": "wav2vec2 + CTC",
        unknownProprietary: "Teadmata / patenteeritud",
      },
      deployment: { local: "Kohapeal käivitatav", cloud: "Väline teenus" },
      hardware: { gpu: "GPU", cpu: "CPU", gpuCpu: "GPU + CPU" },
      streaming: { true: "Reaalajas töötlus", false: "Mitte-reaalajaline töötlus", unknown: "Teadmata" },
      tuned: { true: "Eesti keelele kohandatud", false: "Üldine mitmekeelne", unknown: "Teadmata" },
      repro: { yes: "Jah", partially: "Osaliselt", no: "Ei", not_run: "Käivitamata", unknown: "Teadmata" },
    },
    home: {
      title: "Eesti ASR võrdluskeskkond — tulemused",
      h1: "Kui hästi eesti keele kõnetuvastussüsteemid tegelikult toimivad?",
      heroScope:
        "<strong>Eesti ASR võrdluskeskkond</strong> võrdleb üheksat olemasolevat kõnetuvastussüsteemi samade eestikeelsete testisalvestiste põhjal — alates kohapeal käivitatavatest mudelitest kuni väliste teenusteni ning eesti keelele kohandatud süsteemidest üldiste mitmekeelsete mudeliteni. See ei arenda ega treeni ühtegi neist mudelitest.",
      chartHeading: "Sõnaviga (WER) — kui tihti süsteem sõna valesti tuvastas",
      chartCaption:
        "Lühem riba on parem. Koondskoor nelja testsalvestise põhjal viiest — täieliku jaotuse leiad lehelt „Võrdlus”.",
      findingsHeading: "Mis silma torkab",
      finding1Title: "Eesti keelele häälestamine ületab pelga mudeli suuruse",
      finding1Body:
        "Üldine Whisper-medium annab WER-iks 31.34%. Sama arhitektuur, eesti keelele häälestatuna, annab 9.64% — ja on ikka selgelt parem isegi kaks korda suuremast üldmudelist.",
      finding2Title: "Uuem ei tähenda automaatselt täpsemat",
      finding2Body:
        "Uusimad, spetsiaalselt selleks loodud reaalajas töötlevad mudelid (Zipformer) annavad selles võrdluses halvema tulemuse kui vanem, muutumatuna hoitud Whisper-medium'i töövoog — arhitektuuripere on sama oluline kui uudsus.",
      finding3Title: "Erinev tehnoloogia, erinevad vead",
      finding3Body:
        "Üks süsteem kasutab põhimõtteliselt teistsugust lähenemist ja see on näha: enamik selle „vigadest” on puuduvad tühikud õigesti tuvastatud sõnade vahel, mitte valed sõnad. Vaata seda otse lehelt „Transkriptsioonid”.",
      ctaCompare: "Vaata üksikasjalikku võrdlust →",
      ctaTranscripts: "Vaata, kus transkriptsioonid erinevad →",
    },
    compare: {
      title: "Süsteemide võrdlus — Eesti ASR võrdluskeskkond",
      h1: "Süsteemide võrdlus",
      intro:
        "Kõik testitud süsteemid, filtreeritavad kasutusviisi, arhitektuuripere, reaalajas töötluse ja eesti keelele kohandatuse järgi. Klõpsa reale, et näha jaotust settide (A–E) kaupa. Sorteerimiseks klõpsa veeru pealkirjal.",
      rankNote:
        "Vaikimisi sorditud sõnavea (WER) järgi — see on selle võrdluse peamine täpsusmõõdik, mitte üldpingerida. See ei ütle midagi maksumuse, viivituse, privaatsuse ega sinu kasutusjuhtumi sobivuse kohta; allpool toodud kasutusviis, riistvara ja korratavus on eraldiseisvad faktid, mida sellesse järjekorda ei arvestata. Sorteerimiseks klõpsa suvalisel veerul.",
      filters: {
        deployment: "Kasutusviis",
        family: "Arhitektuuripere",
        streaming: "Reaalajas / mitte-reaalajaline töötlus",
        tuning: "Eesti keelele kohandatud",
        optStreaming: "Reaalajas töötlus",
        optOffline: "Mitte-reaalajaline töötlus",
        optUnknown: "Teadmata",
        optTuned: "Eesti keelele kohandatud",
        optGeneral: "Üldine mitmekeelne",
      },
      columns: {
        system: "Süsteem",
        category: "Kategooria",
        deployment: "Kasutusviis",
        hardware: "Riistvara",
        streaming: "Reaalajas töötlus",
        tuned: "Eesti-hääl.",
        reproducible: "Korratav",
        wer: "WER",
        cer: "CER",
        compound: "Liitsõnu arvestav",
      },
      filterCount: "${n} / ${total} süsteemi",
      emptyFilter: "Ükski süsteem ei vasta valitud filtritele. Proovi mõni filter eemaldada.",
      plannedDetail: "Plaanitud, kuid testimata — ",
      noPerSetData: "Setipõhiseid andmeid ei ole eksporditud.",
      miniSet: "Sett",
      miniWer: "WER",
      miniCer: "CER",
      miniCompound: "Liitsõnu arvestav",
      miniRefWords: "Viitesõnu",
      secondary: "(teisejärguline)",
      compareTranscripts: "Vaata selle süsteemi transkriptsioone →",
    },
    transcripts: {
      title: "Transkriptsioonide võrdlus — Eesti ASR võrdluskeskkond",
      h1: "Transkriptsioonide võrdlus",
      intro:
        "Vali testsett ja 2–4 süsteemi, et näha täpselt, kus nende transkriptsioon võrdlustekstist erineb. Iga allpool toodud esiletõst tuleb Pythonis üks kord arvutatud sõnatasandi joondusest, kasutades sama hindamiskoodi, mis andis peamised näitajad — siin ei arvutata brauseris midagi ümber.",
      setLabel: "Sett",
      systemsLabel: "Süsteemid (vali 2–4)",
      setTitle: "Sett ${set}",
      setTitleSecondary: " — teisejärguline/kvalitatiivne",
      noteMax: "Neli on loetavuse piir — eemalda üks, et lisada teine.",
      noteMin: "Vali võrdlemiseks vähemalt kaks süsteemi.",
      legend: {
        sub: "Asendus — oodatud sõna asemel tuvastati teine sõna",
        del: "Puuduv sõna — võrdlusteksti sõna jäi transkriptsioonist välja",
        ins: "Lisatud sõna — transkriptsioonis on sõna, mida võrdlustekstis pole",
        bound: "Ainult sõnapiiri erinevus — sama sisu, kuid sõnad on kirjutatud kokku või lahku",
      },
      normalizeNote:
        "Kuvatav tekst on normaliseeritud (väiketähed, kirjavahemärgid eemaldatud) — täpselt sellisel kujul teksti ka hinnati, see ei ole kuvamisvalik. Rohkem selgitust lehel „Metoodika”.",
      refEyebrow: "Võrdlustekst — sett ${set}",
      refSub: "Mille vastu kõiki allolevaid süsteeme võrreldakse",
      insight:
        "Kahel süsteemil võib olla peaaegu sama üldine veamäär, kuid allpool tehtud vead võivad olla väga erineva <em>laadiga</em> — üks jätab terveid sõnu vahele, teine ajab enamasti sassi õigete sõnade vahelised tühikud. See erinevus ei kajastu ühes WER-numbris, ainult siin.",
      colsLabel: "Süsteemide transkriptsioonid, võrreldud ülaltoodud võrdlustekstiga",
      tokRef: "võrdlustekst: ${ref}",
      tokNotInRef: "võrdlustekstis puudub",
      tokMissing: "puudub — võrdlustekstis oli see olemas",
      tokBoundary: "ainult sõnapiiri erinevus — võrdlustekst: ${ref}",
      pickTwo: "Vali võrdlemiseks vähemalt kaks süsteemi.",
    },
    systems: {
      title: "Süsteemide kataloog — Eesti ASR võrdluskeskkond",
      h1: "Süsteemide kataloog",
      intro:
        "Mis iga selles võrdluses osalev süsteem tegelikult on — pakkuja, arhitektuur, kuidas seda käitati ning mis on teada ja mis mitte. See on viitekataloog, mitte pingerida; hinnatud võrdluse jaoks vaata lehte „Võrdlus”. Kui fakt ei ole avalikult dokumenteeritud, on see selgesõnaliselt nii kirjas, mitte ära arvatud.",
      plannedBadge: "Plaanitud, testimata",
      benchmarkedBadge: "Testitud",
      notBenchmarked: "Testimata",
      werLabel: "WER",
      fields: {
        architecture: "Arhitektuuripere",
        streaming: "Reaalajas / mitte-reaalajaline töötlus",
        deployment: "Kasutusviis",
        hardware: "Selles võrdluses kasutatud riistvara",
        tuned: "Eesti keele spetsiifiline treening",
        reproducible: "Ise korratav",
        status: "Testimise staatus",
      },
      statusPlanned: "Plaanitud, käivitamata — ",
      statusBenchmarked: "Testitud",
      headlinePooled: "Peanäitaja (koond A–D)",
      headline: "Peanäitaja",
      profile: "Profiil",
      provenance: "Päritolu / allikas",
      provider: "Pakkuja / autor",
      limitations: "Teadaolevad piirangud",
      unknowns: "Teadaolevad lahtised küsimused",
      neitherLabel: "Teadaolevad piirangud / lahtised küsimused",
      neitherText: "Töölaua metaandmetes ei ole hetkel dokumenteeritud ühtegi süsteemipõhist piirangut.",
      seeCompare: "Vaata lehel „Võrdlus” →",
      seeTranscripts: "Vaata selle transkriptsioone →",
    },
    methodology: {
      title: "Metoodika — Eesti ASR võrdluskeskkond",
      h1: "Metoodika",
      intro:
        "Kuidas selle lehe numbrid tegelikult tekkisid — kõigepealt lihtsas keeles, seejärel täielik tehniline selgitus neile, kes seda soovivad.",
      summaryHeading: "Lühidalt",
      tableRole: "Roll",
      rolePooled: "Koondatud peanäitajasse",
      roleSecondary: "Esitatud eraldi, teisejärguline/kvalitatiivne",
      summary: [
        "Iga süsteem transkribeerib samad <strong>viis eestikeelset salvestist</strong> (nimetatud settideks A–E). Neli neist (A–D) on loetud kindla teksti järgi ja koondatakse üheks peanäitajaks; viies (E) on vabam, loomulikum kõne ning hoitakse eraldi, sest seda pole õiglane samamoodi hinnata.",
        "Iga süsteemi transkriptsiooni võrreldakse sõna-sõnalt algse tekstiga. Peamine näitaja on <strong>sõnaviga (Word Error Rate, WER)</strong> — lihtsustatult, kui suur protsent sõnadest sai valesti tuvastatud. Madalam on parem.",
        "Täpsema pildi saamiseks tuuakse WER-i kõrval välja veel kaks näitajat: <strong>tähemärgiviga (Character Error Rate, CER)</strong> ning <strong>liitsõnu arvestav WER</strong>, mis jätab arvestamata ühte kindlat, eesti keeles levinud näiliste vigade liiki — vaata allpool.",
        'Enne võrdlemist muudetakse kogu tekst väiketäheliseks ja kirjavahemärgid eemaldatakse. Seepärast kuvab leht „<a href="transcripts.html">Transkriptsioonid</a>” tavalist väiketähelist teksti — see näitab täpselt seda, mida tegelikult hinnati, mitte ilustatud versiooni.',
        "See leht näitab praegu, millisel riistvaral iga süsteem töötas (CPU/GPU/kohapeal/pilves), kuid mitte kiirusnäite endid — CPU, GPU ja pilveteenuse näitajad ei oleks niikuinii omavahel otseselt võrreldavad. Põhjendus allpool.",
      ],
      toc: {
        aria: "Sisukord",
        sets: "Viis setti",
        reference: "Võrdlustekstid",
        wer: "Range WER",
        cer: "CER",
        compound: "Liitsõnu arvestav WER",
        normalization: "Normaliseerimine",
        normalizedDisplay: "Miks Transkriptsioonide leht näitab normaliseeritud teksti",
        speed: "Miks kiirus ei ole võrreldav",
        limitations: "Piirangud",
        reproducibility: "Korratavuse kategooriad",
      },
      sections: {
        sets: {
          h2: "Viis testsetti — ja miks A–D koondatakse, kuid E on teisejärguline",
          p: [
            "Iga süsteem transkribeerib samad viis fikseeritud eestikeelset salvestist, ühe kõneleja häälega, enamasti tehnilis-hariduslikul teemal (arvutid, andmebaasid, matemaatika). Setid A–D on ette loetud koostatud teksti järgi, sõna-sõnalt, mistõttu on olemas täpne võrdlusalus. Sett E on vabam ja loomulikumalt kõneldud.",
            "See erinevus on hindamisel oluline: kui kõneleja lugemise ajal loomulikult sõnastab ümber, kordab või lisab sõna, loetaks see fikseeritud tekstiga võrreldes „veaks”, isegi kui süsteem tuvastas heli täpselt õigesti. Seetõttu tuuakse sett E küll välja, kuid see jäetakse peanäitajast välja ja käsitletakse teisejärgulise/kvalitatiivsena, mitte ei koondata teistega.",
          ],
        },
        reference: {
          h2: "Võrdlustekstid",
          p: [
            '„Võrdlustekst” on iga seti algne kirjalik tekst — võrdlusalus, mille järgi iga süsteemi transkriptsiooni mõõdetakse. See on kinnitatud lehe „<a href="transcripts.html">Transkriptsioonid</a>” ülaossa just selleks, et poleks kunagi segadust, milline tekst on õige vastus ja millised on katsed.',
          ],
        },
        wer: {
          h2: "Range sõnaviga (WER) — peamine näitaja",
          p: [
            'WER loeb, kui palju sõnu süsteemi transkriptsioonis valesti läks, protsendina viitesõnade arvust: teise sõnaga asendatud sõnad, täielikult puuduvad sõnad ja lisatud sõnad, mida tegelikult ei öeldud. See on ainus number, mida see võrdlus peab peamiseks — selle järgi sordib leht „<a href="compare.html">Võrdlus</a>” vaikimisi.',
            "See on range, sõna-sõnaline arvestus: õigesti kuuldud, kuid ootamatul (ehkki usutaval) kujul kirjutatud sõna loetakse ikkagi valeks. „Piisavalt lähedase” eest punkte ei anta.",
          ],
        },
        cer: {
          h2: "Tähemärgiviga (CER)",
          p: [
            "CER mõõdab sama ideed tähemärgi, mitte sõna tasandil — kui palju üksikuid tähemärke tuli muuta, protsendina võrdlusteksti tähemärkide arvust. Seda tuuakse välja täiendava näitajana, sest see räägib teistsugust lugu kui WER: kui süsteem kuuleb sõna „andmebaas” valesti kui „andmebaaas”, loetakse WER-i järgi kogu sõna valeks, kuid CER näitab, et viga oli tegelikult pisike — üks lisatäht, mitte täiesti vale sõna.",
          ],
        },
        compound: {
          h2: "Liitsõnu arvestav WER — mida see täpselt andeks annab",
          p: [
            "Eesti keeles moodustatakse pikki liitsõnu vabalt (nt „andmebaas”). Süsteem kirjutab liitsõna mõnikord kahe eraldi sõnana või liidab kokku kaks sõna, mis tekstis olid lahku kirjutatud. Range WER loeb selle tõeliseks veaks, samaväärselt täiesti vale sõnaga — mis tõenäoliselt liialdab vea tõsidusega.",
            'Liitsõnu arvestav WER on täiendav näitaja, mis annab andeks ainult selle ühe kitsa juhtumi: kui sõnade rühm ühel poolel, tühikuteta kokku kirjutatuna, on tähemärk-tähemärgilt identne teisel poolel oleva ühe sõnaga. Näiteks Meta Omnilingual ASR süsteem transkribeeris „andmete visuaalne” ühe sõnana, <code>andmetevisuaalne</code> — tühiku eemaldamisel täpselt samasugune kirjapilt, mistõttu liitsõnu arvestav WER seda veaks ei loe. Tõeliselt valesid sõnu ei anta sel viisil kunagi andeks: valesti kuuldud sõna nagu „primaarvõti”, mis transkribeeriti kui „primaarvuti”, loetakse veaks mõlema näitaja järgi, sest need pole tähemärk-tähemärgilt identsed.',
            "Liitsõnu arvestav WER ei saa sama transkriptsiooni puhul kunagi olla kõrgem kui range WER — see ainult annab andeks, ei lisa kunagi vigu — seetõttu tuuakse see alati välja koos range WER-iga, mitte selle asemel.",
          ],
        },
        normalization: {
          h2: "Normaliseerimine",
          p: [
            "Enne igasugust võrdlemist läbivad nii võrdlustekst kui iga süsteemi transkriptsioon sama kindla puhastuse: Unicode ühtlustatakse, tekst muudetakse väiketäheliseks, kirjavahemärgid ja sümbolid eemaldatakse ning tühikud koondatakse. See toimub kõigi süsteemide puhul identselt, kasutades üht ühist teostust — nii ei saa tulemused vaikselt lahkneda seetõttu, et kahe süsteemi teksti puhastati erinevalt.",
            'Lisaks eemaldatakse enne hindamist iga süsteemi puhul ükskord süsteemispetsiifilised lisandid, mis pole tegelik transkriptsiooni sisu — kõneleja märgistused, ajatemplid, mõne tööriista lisatud dokumendi päised —, sest ühegi kõnetuvastussüsteemi „hinnet” ei tohiks nende pärast langetada.',
          ],
        },
        "normalized-display": {
          h2: "Miks Transkriptsioonide leht näitab normaliseeritud teksti",
          p: [
            'Lehe „<a href="transcripts.html">Transkriptsioonid</a>” sõnahaaval esiletõst on üles ehitatud otse samale joondusele, mida kasutati näitajate arvutamiseks — kuvamiseks ei arvutata midagi uuesti. See joondus töötab normaliseeritud (väiketäheline, kirjavahemärkideta) tekstiga, mistõttu millegi muu näitamine tähendaks, et esiletõstetud tekst ei vastaks tegelikult esiletõstu aluseks olevale. See on teadlik valik täpsuse kasuks ilusa väljanägemise asemel: see, mida seal näed, on tõestatavalt see, mida hinnati, mitte selle taastatud versioon.',
          ],
        },
        speed: {
          h2: "Miks kiirusnäitajad pole süsteemide vahel otseselt võrreldavad",
          p: [
            'Osa selle võrdluse süsteeme töötab CPU-l, osa GPU-l ning osa on pilveteenused, mille riistvara kohta pole sellel projektil üldse ülevaadet. Ühe CPU lõime peal mõõdetud „reaalajateguri” ja GPU peal mõõdetud vastava näitaja puhul vastatakse eri riistvaral erinevatele küsimustele, mitte samale küsimusele erineval riistvaral — ning pilveteenuse teatatud aeg sisaldab võrgu- ja järjekorrakäitumist, millega kohapealne käitus kunagi kokku ei puutu. See leht ei näita praegu ühelgi lehel süsteemipõhiseid kiirusnäitajaid — ainult riistvarakategooria (CPU/GPU/kohapeal/pilves), mida näidatakse lehtedel „<a href="compare.html">Võrdlus</a>” ja „<a href="systems.html">Süsteemid</a>”. Töölaua enda tulemused salvestavad ajastuse iga käituse kohta, kuid alati koos selle käituse konkreetse riistvaraga, just selleks, et pelka numbrit ei loetaks kunagi süsteemide vahel võrreldavaks ilma selle kontekstita.',
          ],
        },
        limitations: {
          h2: "Selle võrdluse piirangud",
          li: [
            "<strong>Üks kõneleja, üks salvestuskeskkond.</strong> Miski siin ei ütle midagi aktsendi, vanuse, soo, taustamüra ega mikrofoni erinevuste kohta.",
            "<strong>Väike valim.</strong> Viis salvestist on piisav süsteemide sisukaks võrdlemiseks, kuid mitte piisav lõpliku pingerea väitmiseks — setipõhised numbrid võivad olla müralised.",
            "<strong>Enamasti loetud tehniline kõne.</strong> Tulemused ei pruugi kanduda üle spontaansele vestlusele ega mittetehnilisele, argisele eesti keelele.",
            "<strong>Patenteeritud teenused on musta kastina.</strong> Pilve-/kommertssüsteemide puhul ei ole kasutatud täpne mudel, versioon ega seadistus tihti avalikustatud — see võrdlus talletab, mis on sõltumatult kontrollitav, ja ütleb selgelt välja, mis ei ole.",
            "<strong>Ühe hetke tulemused.</strong> Pilveteenused võivad muutuda ette teatamata; siinne tulemus peegeldab seda, mis oli testimise ajal käigus, mitte pidevalt uuendatavat elavat näitajat.",
          ],
        },
        reproducibility: {
          h2: "Korratavuse kategooriad",
          p: [
            'Iga süsteem lehtedel „<a href="compare.html">Võrdlus</a>” ja „<a href="systems.html">Süsteemid</a>” on märgistatud ühega järgnevast, olenevalt sellest, kas saaksid selle avaliku info põhjal ise uuesti käivitada:',
          ],
          li: [
            "<strong>Jah</strong> — mudel ja käitusteek on avalikud; saaksid käituse enda heliga ise korrata.",
            "<strong>Osaliselt</strong> — põhimõtteliselt korratav, kuid teadaoleva mööndusega (nt lahendamata käituste-vaheline varieeruvus ühes kohalikus torustikus).",
            "<strong>Ei</strong> — patenteeritud teenus, mille mudelit ega seadistust pole avaldatud; tulemus on säilitatud tõendina konkreetsest testist, mitte korratava juhendina.",
            '<strong>Käivitamata</strong> — dokumenteeritud ja plaanitud, kuid veel testimata (praegu ainult Microsoft MAI-Transcribe-1.5, mis jäeti kulu tõttu käivitamata — vaata selle profiili lehel „<a href="systems.html">Süsteemid</a>”).',
          ],
        },
      },
    },
  },

  en: {
    nav: {
      home: "Home",
      compare: "Compare",
      transcripts: "Transcripts",
      systems: "Systems",
      methodology: "Methodology",
      soon: "soon",
    },
    brand: { pre: "Estonian ASR", accent: "Workbench" },
    common: {
      scopeStrip: "Compares existing Estonian speech-recognition systems. Does not build or train ASR models.",
      footerTagline: "Estonian ASR Workbench — comparison project, not a product. See Methodology and About for full detail.",
      footerExported: "exported",
      footerBenchmarked: "systems benchmarked",
      unknownLong: "Unknown / not publicly documented",
      dash: "—",
      category: {
        "estonian-specialized-local": "Estonian-specialized, local",
        "general-multilingual-open": "General multilingual, open",
        "commercial-cloud": "Commercial / cloud",
      },
      family: {
        "wav2vec2 + CTC": "wav2vec2 + CTC",
        unknownProprietary: "Unknown / proprietary",
      },
      deployment: { local: "Local-capable", cloud: "External service" },
      hardware: { gpu: "GPU", cpu: "CPU", gpuCpu: "GPU + CPU" },
      streaming: { true: "Streaming", false: "Offline", unknown: "Unknown" },
      tuned: { true: "Estonian-tuned", false: "General multilingual", unknown: "Unknown" },
      repro: { yes: "Yes", partially: "Partially", no: "No", not_run: "Not run", unknown: "Unknown" },
    },
    home: {
      title: "Estonian ASR Workbench — results",
      h1: "How well do Estonian speech-recognition systems actually work?",
      heroScope:
        "The <strong>Estonian ASR Workbench</strong> scores nine existing speech-to-text systems — local and cloud, Estonian-tuned and general-purpose — against the same five Estonian recordings, using the same strict scoring rules for every one of them. It does not build or train any of these models.",
      chartHeading: "Word error rate — how often each system got a word wrong",
      chartCaption: "Shorter bar is better. Combined score across four of the five test recordings — see Compare for the full breakdown.",
      findingsHeading: "What stands out",
      finding1Title: "Estonian tuning beats raw model size",
      finding1Body:
        "Generic Whisper-medium scores 31.34% WER. The same architecture, fine-tuned for Estonian, scores 9.64% — and stays far ahead even of a generic model twice its size.",
      finding2Title: "Newer isn't automatically more accurate",
      finding2Body:
        "The newest, purpose-built streaming models (Zipformer) score worse than an older, frozen Whisper-medium pipeline on this benchmark — architecture family matters as much as recency.",
      finding3Title: "Different technology, different mistakes",
      finding3Body:
        "One system uses a fundamentally different approach and it shows: most of its \"errors\" are missing spaces between correctly-heard words, not wrong words. See it directly on the Transcripts page.",
      ctaCompare: "Compare systems in detail →",
      ctaTranscripts: "See where transcripts differ →",
    },
    compare: {
      title: "Compare systems — Estonian ASR Workbench",
      h1: "Compare systems",
      intro:
        "Every benchmarked system, filterable by deployment, architecture family, streaming/offline, and Estonian-tuned vs. general-purpose. Click a row to see its per-set (A–E) breakdown. Sort by clicking a column header.",
      rankNote:
        "Sorted by Word Error Rate by default — that's this benchmark's primary accuracy metric, not an overall ranking. It says nothing about cost, latency, privacy, or fit for your use case; deployment, hardware, and reproducibility below are separate facts, not scored into this order. Sort by any column.",
      filters: {
        deployment: "Deployment",
        family: "Architecture family",
        streaming: "Streaming / offline",
        tuning: "Estonian-tuned",
        optStreaming: "Streaming",
        optOffline: "Offline",
        optUnknown: "Unknown",
        optTuned: "Estonian-tuned",
        optGeneral: "General multilingual",
      },
      columns: {
        system: "System",
        category: "Category",
        deployment: "Deployment",
        hardware: "Hardware",
        streaming: "Streaming",
        tuned: "Est.-tuned",
        reproducible: "Reproducible",
        wer: "WER",
        cer: "CER",
        compound: "Compound-aware",
      },
      filterCount: "${n} / ${total} systems",
      emptyFilter: "No systems match the selected filters. Try clearing one.",
      plannedDetail: "Planned, not benchmarked — ",
      noPerSetData: "No per-set data exported.",
      miniSet: "Set",
      miniWer: "WER",
      miniCer: "CER",
      miniCompound: "Compound-aware",
      miniRefWords: "Ref words",
      secondary: "(secondary)",
      compareTranscripts: "Compare this system's transcripts →",
    },
    transcripts: {
      title: "Transcript comparison — Estonian ASR Workbench",
      h1: "Transcript comparison",
      intro:
        "Pick a benchmark set and 2–4 systems to see exactly where their output differs from the reference script. Every highlight below comes from a word-level alignment computed once in Python, using the same scoring code that produced the headline numbers — nothing here is recomputed in the browser.",
      setLabel: "Set",
      systemsLabel: "Systems (choose 2–4)",
      setTitle: "Set ${set}",
      setTitleSecondary: " — secondary/qualitative",
      noteMax: "Four is the readable limit — uncheck one to add another.",
      noteMin: "Pick at least two systems to compare.",
      legend: {
        sub: "substitution — a different word than expected",
        del: "deletion — a word is missing",
        ins: "insertion — an extra word that isn't in the reference",
        bound: "word-boundary only — same words, just split or joined differently",
      },
      normalizeNote:
        "Text shown normalized (lowercase, punctuation removed) — this is exactly the form that was scored, not a display choice. More on why in Methodology.",
      refEyebrow: "Reference script — Set ${set}",
      refSub: "What every system below is being compared against",
      insight:
        "Two systems can land on nearly the same overall error rate while making very different <em>kinds</em> of mistakes below — one drops whole words, another mostly mangles spacing between correct words. That difference doesn't show up in a single WER number, only here.",
      colsLabel: "System outputs, compared against the reference above",
      tokRef: "reference: ${ref}",
      tokNotInRef: "not in reference",
      tokMissing: "missing — reference had this",
      tokBoundary: "word-boundary difference only — reference: ${ref}",
      pickTwo: "Pick at least two systems above to compare.",
    },
    systems: {
      title: "System catalog — Estonian ASR Workbench",
      h1: "System catalog",
      intro:
        "What each system in this benchmark actually is — provider, architecture, how it was run, and what's known versus unresolved. This is a reference catalog, not a ranking; for scored comparison see Compare. Where a fact isn't publicly documented, that's stated explicitly rather than guessed.",
      plannedBadge: "Planned, not benchmarked",
      benchmarkedBadge: "Benchmarked",
      notBenchmarked: "Not benchmarked",
      werLabel: "WER",
      fields: {
        architecture: "Architecture family",
        streaming: "Streaming / offline",
        deployment: "Deployment",
        hardware: "Hardware used in this benchmark",
        tuned: "Estonian-specific training",
        reproducible: "Reproducible by you",
        status: "Benchmark status",
      },
      statusPlanned: "Planned, not run — ",
      statusBenchmarked: "Benchmarked",
      headlinePooled: "Headline (pooled A–D)",
      headline: "Headline",
      profile: "Profile",
      provenance: "Provenance / source",
      provider: "Provider / author",
      limitations: "Known limitations",
      unknowns: "Known unknowns",
      neitherLabel: "Known limitations / unknowns",
      neitherText: "No system-specific limitations are currently documented in the Workbench metadata.",
      seeCompare: "See in Compare →",
      seeTranscripts: "Compare its transcripts →",
    },
    methodology: {
      title: "Methodology — Estonian ASR Workbench",
      h1: "Methodology",
      intro:
        "How the numbers on this site were actually produced — in plain language first, with full technical detail further down for anyone who wants it.",
      summaryHeading: "In short",
      tableRole: "Role",
      rolePooled: "Pooled into the headline WER",
      roleSecondary: "Reported separately, secondary/qualitative",
      summary: [
        "Every system transcribes the same <strong>five Estonian recordings</strong> (called Sets A–E). Four of them (A–D) are read from a fixed script and get pooled into one headline score; the fifth (E) is looser, more natural speech, and is kept separate because it isn't fair to score the same way.",
        "Each system's transcript is compared word-by-word against the original script. The main score is <strong>Word Error Rate (WER)</strong> — roughly, the percentage of words a system got wrong. Lower is better.",
        "Two extra scores are reported alongside WER for more nuance: <strong>Character Error Rate (CER)</strong> and <strong>compound-aware WER</strong>, which specifically ignores one narrow kind of non-error common in Estonian — see below.",
        'Before comparing, all text is lowercased and stripped of punctuation. That\'s why the <a href="transcripts.html">Transcripts</a> page shows plain lowercase text — it\'s showing you exactly what was actually scored, not a prettied-up version.',
        "This site currently shows which hardware each system ran on (CPU/GPU/local/cloud) but not speed numbers themselves — a CPU figure, a GPU figure, and a cloud-service figure wouldn't be directly comparable to each other anyway. See below for why.",
      ],
      toc: {
        aria: "Sections",
        sets: "The five sets",
        reference: "Reference transcripts",
        wer: "Strict WER",
        cer: "CER",
        compound: "Compound-aware WER",
        normalization: "Normalization",
        normalizedDisplay: "Why Transcripts shows normalized text",
        speed: "Why speed isn't comparable",
        limitations: "Limitations",
        reproducibility: "Reproducibility categories",
      },
      sections: {
        sets: {
          h2: "The five benchmark sets, and why A–D are pooled while E is secondary",
          p: [
            "Every system transcribes the same five fixed Estonian recordings, one speaker, mostly technical/educational subject matter (computing, databases, mathematics). Sets A–D are read aloud from a prepared script, word for word, so there's an exact ground truth to check against. Set E is looser and more freely spoken.",
            'That difference matters for scoring: if a speaker naturally rephrases, repeats, or adds a word while reading, comparing against the fixed script would count that as an "error" even though the system transcribed the audio correctly. So Set E is reported, but kept out of the headline number and treated as secondary/qualitative rather than pooled in.',
          ],
        },
        reference: {
          h2: "Reference transcripts",
          p: [
            'The "reference" is the original written script for each set — the ground truth every system\'s output is measured against. It\'s shown pinned at the top of the <a href="transcripts.html">Transcripts</a> page specifically so it\'s never ambiguous which text is the answer and which are the attempts.',
          ],
        },
        wer: {
          h2: "Strict Word Error Rate (WER) — the primary metric",
          p: [
            'WER counts how many words a system\'s transcript got wrong, as a percentage of the reference\'s word count: words substituted for a different word, words dropped entirely, and extra words inserted that weren\'t said. It\'s the single number this benchmark treats as primary — the one used to sort <a href="compare.html">Compare</a> by default.',
            'It\'s a strict, literal count: a correctly-heard word written in an unexpected but plausible form still counts as wrong. No credit for "close enough."',
          ],
        },
        cer: {
          h2: "Character Error Rate (CER)",
          p: [
            'CER measures the same idea at the character level instead of the word level — how many individual characters had to change, as a percentage of the reference\'s character count. It\'s reported as a secondary metric because it tells a different story than WER: a system that mishears "andmebaas" as "andmebaaas" gets the whole word marked wrong under WER, but CER shows that error was actually tiny — one extra letter, not a completely different word.',
          ],
        },
        compound: {
          h2: "Compound-aware WER — what it forgives, precisely",
          p: [
            'Estonian builds long compound words freely (e.g. <em>andmebaas</em>, "database"). A system sometimes writes a compound as two separate words, or joins two words a script kept separate. Strict WER counts that as a real error, same as a completely wrong word — which arguably overstates the mistake.',
            'Compound-aware WER is a secondary score that forgives <strong>only</strong> this one narrow case: when a group of words on one side, joined together with no spaces, is character-for-character identical to a single word on the other side. For example, Meta\'s Omnilingual ASR system transcribed "andmete visuaalne" as one word, <code>andmetevisuaalne</code> — spelled exactly the same once you remove the space, so compound-aware WER doesn\'t count it as an error. Genuinely wrong words are never forgiven this way: a misheard word like "primaarvõti" transcribed as "primaarvuti" still counts as an error under both metrics, because those aren\'t character-identical.',
            "Compound-aware WER can never be higher than strict WER for the same transcript — it only ever forgives, never adds errors — so it's always reported alongside strict WER, never as a replacement for it.",
          ],
        },
        normalization: {
          h2: "Normalization",
          p: [
            "Before any comparison happens, both the reference and every system's transcript go through the same fixed cleanup: Unicode is standardized, text is lowercased, punctuation and symbols are stripped out, and whitespace is collapsed. This happens identically for every system, using one shared implementation — so results can't silently diverge because two systems' text was cleaned up differently.",
            'Separately, system-specific artifacts that aren\'t actually transcript content — speaker labels, timestamps, document headers some tools insert — are stripped once per system before scoring, since those aren\'t something any ASR system should be "graded" on getting wrong.',
          ],
        },
        "normalized-display": {
          h2: "Why the Transcripts page shows normalized text",
          p: [
            'The word-by-word highlighting on the <a href="transcripts.html">Transcripts</a> page is built directly from the same alignment used to compute the scores — nothing is recomputed for display. That alignment operates on normalized (lowercase, no punctuation) text, so showing anything else would mean the highlighted text doesn\'t actually match what\'s behind the highlighting. It\'s a deliberate choice for exactness over prettiness: what you see there is provably what was scored, not a reconstruction of it.',
          ],
        },
        speed: {
          h2: "Why speed numbers aren't directly comparable across systems",
          p: [
            'Some systems in this benchmark run on a CPU, some on a GPU, and some are cloud services running on hardware this project has no visibility into at all. A "real-time factor" measured on a single CPU thread and one measured on a GPU are answering different questions, not the same question on different hardware — and a cloud API\'s reported time includes network and queueing behavior a local run never has to deal with. This site doesn\'t currently display per-system speed numbers on any page — only the hardware category (CPU/GPU/local/cloud) shown on <a href="compare.html">Compare</a> and <a href="systems.html">Systems</a>. The Workbench\'s own results do record timing per run, but always alongside that run\'s specific hardware, precisely so a bare number is never read as comparable across systems without it.',
          ],
        },
        limitations: {
          h2: "Limitations of this benchmark",
          li: [
            "<strong>One speaker, one recording environment.</strong> Nothing here speaks to accent, age, gender, background noise, or microphone variation.",
            "<strong>Small sample.</strong> Five recordings is enough to compare systems meaningfully, not enough to claim a definitive ranking — per-set numbers can be noisy.",
            "<strong>Mostly read, technical speech.</strong> Results may not transfer to spontaneous conversation or non-technical, everyday Estonian.",
            "<strong>Proprietary services are black boxes.</strong> For cloud/commercial systems, the exact model, version, and configuration used often isn't published — this benchmark records what's independently verifiable and states plainly what isn't.",
            "<strong>Point-in-time results.</strong> Cloud services can change without notice; a result here reflects whatever was live when it was tested, not a live, continuously-updated score.",
          ],
        },
        reproducibility: {
          h2: "Reproducibility categories",
          p: [
            'Every system on <a href="compare.html">Compare</a> and <a href="systems.html">Systems</a> is labeled with one of these, based on whether you could rerun it yourself from public information:',
          ],
          li: [
            "<strong>Yes</strong> — the model and runtime are public; you could reproduce the run yourself with your own copy of the audio.",
            "<strong>Partially</strong> — reproducible in principle, but with a known caveat (e.g. an unresolved run-to-run variance in one local pipeline).",
            "<strong>No</strong> — a proprietary service with no published model or configuration; the result is preserved as evidence from a specific test, not a repeatable recipe.",
            '<strong>Not run</strong> — documented and planned, but not yet benchmarked (currently only Microsoft MAI-Transcribe-1.5, held back over cost — see its profile on <a href="systems.html">Systems</a>).',
          ],
        },
      },
    },
  },
};

function getLang() {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  return stored === "et" || stored === "en" ? stored : DEFAULT_LANG;
}

function setLang(lang) {
  if (lang !== "et" && lang !== "en") return;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  location.reload();
}

// t("compare.filters.deployment") -- dot-path lookup into the current
// language's dictionary. Falls back to the key itself (visibly wrong,
// intentionally -- never silently falls back to English) if missing, so a
// gap is obvious during review rather than hidden.
function t(path) {
  const dict = TRANSLATIONS[getLang()] || TRANSLATIONS[DEFAULT_LANG];
  const parts = path.split(".");
  let node = dict;
  for (const p of parts) {
    if (node && typeof node === "object" && p in node) node = node[p];
    else {
      console.warn(`[i18n] missing key for "${getLang()}": ${path}`);
      return `[[${path}]]`;
    }
  }
  return node;
}

function applyHtmlLang() {
  document.documentElement.lang = getLang();
}
applyHtmlLang();
