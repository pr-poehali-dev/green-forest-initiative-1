import { StarField } from "@/components/StarField"
import { ChevronDown, Send, Sparkles, TrendingUp, Eye, Crown, Lock, Star, ArrowRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const TG_LINK = "https://t.me/+HJYYu2Us075jMzk6"

const QUIZ_QUESTIONS = [
  "Ты знаешь свой фототип и как с ним работать?",
  "У тебя есть чёткая утренняя рутина ухода?",
  "Ты знаешь, какая стрижка подходит форме твоего лица?",
  "Ты следишь за осанкой и языком тела?",
  "Знаешь, какой стиль одежды усиливает твою внешность?",
]

const REVIEWS = [
  { name: "Артём, 19", text: "За месяц полностью переосмыслил подход к внешности. Кожа, стиль, осанка — всё изменилось.", stars: 5 },
  { name: "Никита, 22", text: "Гайды конкретные, без воды. Реально применяешь и видишь результат уже через 2 недели.", stars: 5 },
  { name: "Иван, 17", text: "Наконец-то нашёл место, где объясняют как работает лукмаксинг на практике, а не теория.", stars: 5 },
  { name: "Даниил, 21", text: "Стрижку поменял по гайду из канала — реакция знакомых удивила. Теперь изучаю уход за кожей.", stars: 5 },
]

const TIPS = [
  { icon: "💧", title: "Увлажнение", text: "98% парней не увлажняют кожу. Это меняет внешность за 2 недели." },
  { icon: "🧴", title: "SPF каждый день", text: "Солнце старит кожу быстрее всего. Крем с SPF — обязательный минимум." },
  { icon: "✂️", title: "Стрижка раз в 3 недели", text: "Свежая стрижка даёт +2 балла моментально. Не тяни до 2 месяцев." },
  { icon: "🧍", title: "Осанка решает", text: "Прямая спина визуально делает тебя выше и увереннее. Тренируй каждый день." },
]

function CountUp({ to, duration = 2000, suffix = "" }: { to: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          setCount(Math.floor(p * to))
          if (p < 1) requestAnimationFrame(tick)
          else setCount(to)
        }
        requestAnimationFrame(tick)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function Index() {
  const [blurAmount, setBlurAmount] = useState(0)
  const [initialHeight, setInitialHeight] = useState(0)
  const [quizStep, setQuizStep] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)

  const [isAboutVisible, setIsAboutVisible] = useState(false)
  const [isServicesVisible, setIsServicesVisible] = useState(false)
  const [isServicesTitleVisible, setIsServicesTitleVisible] = useState(false)
  const [isReviewsVisible, setIsReviewsVisible] = useState(false)
  const [isCtaVisible, setIsCtaVisible] = useState(false)

  const aboutSectionRef = useRef<HTMLElement>(null)
  const aboutContentRef = useRef<HTMLDivElement>(null)
  const servicesSectionRef = useRef<HTMLElement>(null)
  const servicesContentRef = useRef<HTMLDivElement>(null)
  const servicesTitleRef = useRef<HTMLHeadingElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLElement>(null)
  const scrollRef = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    if (initialHeight === 0) setInitialHeight(window.innerHeight)
  }, [initialHeight])

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const maxBlur = 8
          setBlurAmount(Math.min(maxBlur, (scrollRef.current / (initialHeight * 1.2)) * maxBlur))
          ticking.current = false
        })
        ticking.current = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [initialHeight])

  useEffect(() => {
    const pairs: [React.RefObject<Element>, (v: boolean) => void][] = [
      [aboutContentRef, setIsAboutVisible],
      [servicesContentRef, setIsServicesVisible],
      [servicesTitleRef, setIsServicesTitleVisible],
      [reviewsRef, setIsReviewsVisible],
      [ctaRef as React.RefObject<Element>, setIsCtaVisible],
    ]
    const instances = pairs.map(([ref, set]) => {
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { set(true); obs.disconnect() } }, { threshold: 0.1 })
      if (ref.current) obs.observe(ref.current)
      return obs
    })
    return () => instances.forEach(o => o.disconnect())
  }, [])

  const scaleFactor = 1 + blurAmount / 16
  const heroStyle = { height: initialHeight ? `${initialHeight}px` : "100vh" }
  const scrollToAbout = () => aboutSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })

  const handleQuiz = (yes: boolean) => {
    if (yes) setQuizScore(s => s + 1)
    if (quizStep + 1 >= QUIZ_QUESTIONS.length) setQuizDone(true)
    else setQuizStep(s => s + 1)
  }

  const getQuizResult = () => {
    if (quizScore >= 4) return { emoji: "🏆", label: "Эксперт", text: "Ты уже знаешь основы. В канале — продвинутые техники и детали, которых нет нигде.", color: "text-green-400", border: "border-green-500" }
    if (quizScore >= 2) return { emoji: "⚡", label: "Средний уровень", text: "Хорошая база, но есть много пробелов. Канал закроет их за пару недель.", color: "text-amber-400", border: "border-amber-500" }
    return { emoji: "🚀", label: "Начинающий", text: "Огромный потенциал роста. Именно для тебя и создан этот канал — старт с нуля.", color: "text-blue-400", border: "border-blue-500" }
  }

  return (
    <div className="min-h-screen bg-black">

      {/* STICKY TOP BAR */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-400 text-black text-center text-sm font-bold py-2 px-4">
        🔒 Закрытый канал · Гайды по лукмаксингу ·{" "}
        <a href={TG_LINK} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
          Вступить сейчас →
        </a>
      </div>

      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-black pt-8" style={heroStyle}>
        <div className="absolute top-14 right-6 z-10">
          <a href={TG_LINK} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md border border-white bg-transparent text-white text-sm transition-colors hover:bg-white hover:text-black">
            <Send className="h-4 w-4" /> Telegram
          </a>
        </div>
        <div className="absolute inset-0" style={{ transform: `scale(${scaleFactor})`, transition: "transform 0.2s ease-out" }}>
          <StarField blurAmount={blurAmount} />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center px-4">
            <div className="backdrop-blur-sm px-6 py-8 rounded-2xl inline-block max-w-2xl"
              style={{ background: "radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.2) 100%)" }}>
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/50 rounded-full px-4 py-1 mb-4">
                <Lock className="h-3 w-3 text-amber-400" />
                <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">Закрытый канал</span>
              </div>
              <h1 className="text-4xl font-bold text-white md:text-6xl font-heading leading-tight">
                Стань <span className="text-amber-400">лучшей версией</span> себя
              </h1>
              <p className="mt-4 text-gray-300 md:text-lg max-w-md mx-auto">
                Системные гайды по лукмаксингу — кожа, стиль, стрижка, тело. Только то, что реально работает.
              </p>
              {/* социальное доказательство прямо в hero */}
              <div className="flex items-center justify-center gap-1 mt-4 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                <span className="text-gray-300 text-sm ml-2">500+ участников уже внутри</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={TG_LINK} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-400 text-black font-bold text-base transition-all hover:bg-amber-300 hover:scale-105 shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                  <Send className="h-5 w-5" /> Войти в канал
                </a>
                <Button onClick={scrollToAbout} variant="outline" size="sm"
                  className="bg-transparent text-white border-white/40 hover:bg-white hover:text-black transition-colors px-8 py-3 h-auto text-base rounded-xl">
                  Посмотреть что внутри
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 animate-bounce cursor-pointer" onClick={scrollToAbout}
            role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") scrollToAbout() }}>
            <ChevronDown className="h-8 w-8 text-white/60" />
          </div>
        </div>
      </section>

      {/* БЫСТРЫЕ СОВЕТЫ — бесплатная ценность */}
      <section className="py-16 bg-gray-950 text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-center text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3">Бесплатно</p>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-center mb-10">4 вещи, которые меняют внешность прямо сейчас</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {TIPS.map((tip, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-3">{tip.icon}</div>
                <h3 className="font-bold text-white mb-2">{tip.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-8">
            Это лишь малая часть. В канале — <span className="text-amber-400 font-semibold">40+ детальных гайдов</span>
          </p>
        </div>
      </section>

      {/* СТАТЫ */}
      <section className="py-14 bg-black text-white border-y border-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { label: "Гайдов в канале", to: 40, suffix: "+", icon: "📋" },
              { label: "Тем по лукмаксингу", to: 12, suffix: "", icon: "✨" },
              { label: "Дней до заметного результата", to: 30, suffix: "", icon: "⚡" },
              { label: "Участников", to: 500, suffix: "+", icon: "👤" },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-3xl font-bold text-amber-400 font-heading">
                  <CountUp to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-gray-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* О КАНАЛЕ */}
      <section ref={aboutSectionRef} id="about" className="py-20 bg-gradient-to-b from-black to-gray-950 text-white">
        <div className="container mx-auto px-4">
          <div ref={aboutContentRef} className={cn("max-w-4xl mx-auto transition-all duration-1000 ease-out",
            isAboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                  <img
                    src="https://cdn.poehali.dev/projects/b0d40530-9cee-4726-bad5-d79a9df23b5a/bucket/24109ea0-b666-49d0-aed2-256b407b5cd4.png"
                    alt="Автор"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "50% 20%" }}
                  />
                </div>
                <span className="text-xs text-amber-400 font-semibold tracking-widest uppercase">Автор канала</span>
              </div>
              <div className="space-y-4 text-center md:text-left px-4 md:px-0">
                <h2 className="text-3xl font-bold font-heading">О канале</h2>
                <div className="space-y-3 max-w-2xl">
                  <p className="text-gray-300">Лукмаксинг — это системный подход к улучшению внешности. Не советы из журнала, а реальные техники, которые работают.</p>
                  <p className="text-gray-300">В закрытом канале собраны детальные гайды: уход за кожей, причёска, стиль, осанка, язык тела и всё, что влияет на восприятие.</p>
                  <p className="text-gray-300">Только практика, только проверенные методы — без воды и рекламы.</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                  {["Кожа", "Стиль", "Стрижка", "Осанка", "Питание", "Рутина"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-300">{tag}</span>
                  ))}
                </div>
                <a href={TG_LINK} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-sm hover:bg-amber-300 transition-all mt-2">
                  <Send className="h-4 w-4" /> Вступить бесплатно
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ЧТО ВНУТРИ */}
      <section ref={servicesSectionRef} id="guides" className="py-20 bg-gray-950 text-white">
        <div className="container mx-auto px-4">
          <h2 ref={servicesTitleRef} className={cn("mb-2 text-center text-3xl font-bold font-heading transition-all duration-1000 ease-out",
            isServicesTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            Что внутри канала
          </h2>
          <p className={cn("text-center text-gray-400 mb-12 transition-all duration-1000 ease-out delay-200",
            isServicesTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            Закрытые гайды с реальными результатами
          </p>
          <div ref={servicesContentRef} className={cn("max-w-5xl mx-auto transition-all duration-1000 ease-out",
            isServicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <Sparkles className="h-6 w-6 text-amber-400" />, title: "Уход за кожей", desc: "Пошаговые рутины, разбор составов, советы по типам кожи. Чистая кожа — основа внешности.", progress: 95, count: "12 гайдов" },
                { icon: <Crown className="h-6 w-6 text-amber-400" />, title: "Стиль и образ", desc: "Как одеваться по типу фигуры и лица. Что реально улучшает внешность, а что нет.", progress: 88, count: "8 гайдов" },
                { icon: <TrendingUp className="h-6 w-6 text-amber-400" />, title: "Тело и осанка", desc: "Тренировки, постановка осанки, язык тела. Всё, что меняет то, как тебя воспринимают.", progress: 80, count: "10 гайдов" },
                { icon: <Eye className="h-6 w-6 text-amber-400" />, title: "Причёска и стрижка", desc: "Выбор стрижки под форму лица, уход за волосами и укладки, которые реально работают.", progress: 92, count: "10 гайдов" },
              ].map((item, i) => (
                <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <h3 className="text-lg font-semibold font-heading">{item.title}</h3>
                    </div>
                    <span className="text-xs text-amber-400 font-semibold bg-amber-400/10 px-2 py-1 rounded-full">{item.count}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{item.desc}</p>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-1500 ease-out"
                      style={{ width: isServicesVisible ? `${item.progress}%` : "0%", transitionDuration: "1.5s" }} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{item.progress}% участников отмечают улучшение</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <a href={TG_LINK} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-all hover:scale-105">
                <Lock className="h-4 w-4" /> Получить доступ ко всем гайдам
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ТЕСТ */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 max-w-lg">
          <p className="text-center text-amber-400 text-xs font-semibold tracking-widest uppercase mb-2">Тест</p>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-center mb-2">Какой у тебя уровень?</h2>
          <p className="text-gray-400 text-center mb-10 text-sm">5 вопросов — узнай, с чего начать в канале</p>

          {!quizDone ? (
            <div className="bg-gray-950 rounded-2xl p-8 border border-gray-800">
              <div className="flex gap-1.5 mb-6">
                {QUIZ_QUESTIONS.map((_, i) => (
                  <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all duration-500",
                    i < quizStep ? "bg-amber-400" : i === quizStep ? "bg-amber-400/40" : "bg-gray-800")} />
                ))}
              </div>
              <p className="text-lg font-semibold mb-8 text-center leading-snug">{QUIZ_QUESTIONS[quizStep]}</p>
              <div className="flex gap-4">
                <button onClick={() => handleQuiz(true)}
                  className="flex-1 py-3.5 rounded-xl border border-green-500/60 text-green-400 font-semibold hover:bg-green-500 hover:text-black hover:border-green-500 transition-all active:scale-95">
                  Да ✓
                </button>
                <button onClick={() => handleQuiz(false)}
                  className="flex-1 py-3.5 rounded-xl border border-red-500/60 text-red-400 font-semibold hover:bg-red-500 hover:text-black hover:border-red-500 transition-all active:scale-95">
                  Нет ✗
                </button>
              </div>
              <p className="text-gray-700 text-xs text-center mt-5">Вопрос {quizStep + 1} из {QUIZ_QUESTIONS.length}</p>
            </div>
          ) : (
            <div className={cn("bg-gray-950 rounded-2xl p-8 border text-center", getQuizResult().border)}>
              <div className="text-5xl mb-3">{getQuizResult().emoji}</div>
              <p className="text-sm text-gray-400 mb-1 uppercase tracking-widest">{getQuizResult().label}</p>
              <p className="text-2xl font-bold mb-1">{quizScore} / 5</p>
              <p className={cn("text-base mb-6 leading-relaxed", getQuizResult().color)}>{getQuizResult().text}</p>
              <a href={TG_LINK} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-400 text-black font-bold hover:bg-amber-300 transition-all w-full justify-center">
                <Send className="h-5 w-5" /> Открыть гайды под мой уровень
              </a>
              <button onClick={() => { setQuizStep(0); setQuizScore(0); setQuizDone(false) }}
                className="block w-full mt-3 text-gray-600 text-sm hover:text-gray-400 transition-colors">
                Пройти заново
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section className="py-20 bg-gray-950 text-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-amber-400 text-xs font-semibold tracking-widest uppercase mb-2">Отзывы</p>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-center mb-12">Что говорят участники</h2>
          <div ref={reviewsRef} className={cn("grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto transition-all duration-1000 ease-out",
            isReviewsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-amber-400/40 transition-all duration-300"
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(r.stars)].map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{r.text}"</p>
                <p className="text-amber-400 text-sm font-semibold">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ФИНАЛЬНЫЙ CTA */}
      <section ref={ctaRef} id="cta" className="py-28 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)" }} />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className={cn("max-w-2xl mx-auto text-center transition-all duration-1000 ease-out",
            isCtaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1.5 mb-6">
              <Lock className="h-3 w-3 text-amber-400" />
              <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">Закрытый доступ</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 leading-tight">
              Готов стать <span className="text-amber-400">лучше?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-4">
              500+ человек уже улучшают свою внешность с гайдами канала
            </p>
            <p className="text-gray-500 text-sm mb-10">Вступи и получи доступ ко всем материалам прямо сейчас</p>
            <a href={TG_LINK} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-12 py-5 rounded-2xl bg-amber-400 text-black font-bold text-xl transition-all hover:bg-amber-300 hover:scale-105 shadow-[0_0_40px_rgba(251,191,36,0.5)]">
              <Send className="h-6 w-6" /> Войти в канал
              <ArrowRight className="h-5 w-5" />
            </a>
            <div className="flex items-center justify-center gap-6 mt-8 text-gray-600 text-xs">
              <span>✓ Бесплатный вход</span>
              <span>✓ 40+ гайдов сразу</span>
              <span>✓ Обновления каждую неделю</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
