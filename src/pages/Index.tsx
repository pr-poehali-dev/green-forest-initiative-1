import { StarField } from "@/components/StarField"
import { ChevronDown, Send, Sparkles, TrendingUp, Eye, Crown, Zap, CheckCircle } from "lucide-react"
import { ChatbotModal } from "@/components/ChatbotModal"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const TG_LINK = "https://t.me/+HJYYu2Us075jMzk6"

const QUIZ_QUESTIONS = [
  { q: "Ты знаешь свой тип кожи?", yes: "Кожа", no: "Кожа" },
  { q: "У тебя есть утренняя рутина ухода?", yes: "Рутина", no: "Рутина" },
  { q: "Ты знаешь, какая стрижка подходит форме твоего лица?", yes: "Стрижка", no: "Стрижка" },
  { q: "Ты следишь за осанкой?", yes: "Осанка", no: "Осанка" },
]

export default function Index() {
  const [isHeadingVisible, setIsHeadingVisible] = useState(false)
  const [isAboutVisible, setIsAboutVisible] = useState(false)
  const [isServicesVisible, setIsServicesVisible] = useState(false)
  const [isServicesTitleVisible, setIsServicesTitleVisible] = useState(false)
  const [blurAmount, setBlurAmount] = useState(0)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [initialHeight, setInitialHeight] = useState(0)
  const [quizStep, setQuizStep] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const aboutSectionRef = useRef<HTMLElement>(null)
  const aboutContentRef = useRef<HTMLDivElement>(null)
  const servicesSectionRef = useRef<HTMLElement>(null)
  const servicesContentRef = useRef<HTMLDivElement>(null)
  const servicesTitleRef = useRef<HTMLHeadingElement>(null)
  const ctaSectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
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
          const triggerHeight = initialHeight * 1.2
          setBlurAmount(Math.min(maxBlur, (scrollRef.current / triggerHeight) * maxBlur))
          ticking.current = false
        })
        ticking.current = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [initialHeight])

  useEffect(() => {
    const observers = [
      { ref: headingRef, set: setIsHeadingVisible },
      { ref: aboutContentRef, set: setIsAboutVisible },
      { ref: servicesContentRef, set: setIsServicesVisible },
      { ref: servicesTitleRef, set: setIsServicesTitleVisible },
    ]
    const instances = observers.map(({ ref, set }) => {
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { set(true); obs.disconnect() } }, { threshold: 0.1 })
      if (ref.current) obs.observe(ref.current)
      return obs
    })

    const statsObs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsVisible(true); statsObs.disconnect() } }, { threshold: 0.1 })
    if (statsRef.current) statsObs.observe(statsRef.current)

    return () => { instances.forEach(o => o.disconnect()); statsObs.disconnect() }
  }, [])

  const scaleFactor = 1 + blurAmount / 16
  const warpSpeedStyle = { transform: `scale(${scaleFactor})`, transition: "transform 0.2s ease-out" }
  const heroStyle = { height: initialHeight ? `${initialHeight}px` : "100vh" }

  const scrollToAbout = () => aboutSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })

  const handleQuiz = (yes: boolean) => {
    if (yes) setQuizScore(s => s + 1)
    if (quizStep + 1 >= QUIZ_QUESTIONS.length) setQuizDone(true)
    else setQuizStep(s => s + 1)
  }

  const getQuizResult = () => {
    if (quizScore === 4) return { text: "Ты уже на пути 💪 В канале найдёшь продвинутые техники", color: "text-green-400" }
    if (quizScore >= 2) return { text: "Есть база, но потенциал огромный. Канал ускорит прогресс в разы", color: "text-amber-400" }
    return { text: "Самое время начать. В канале — всё с нуля и по делу", color: "text-red-400" }
  }

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-black" style={heroStyle}>
        <div className="absolute top-6 right-6 z-10">
          <a href={TG_LINK} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md border border-white bg-transparent text-white text-sm transition-colors hover:bg-white hover:text-black">
            <Send className="h-4 w-4" /> Telegram
          </a>
        </div>
        <div className="absolute inset-0" style={warpSpeedStyle}>
          <StarField blurAmount={blurAmount} />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="backdrop-blur-sm px-6 py-6 rounded-lg inline-block"
              style={{ background: "radial-gradient(circle, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)" }}>
              <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Закрытый канал</p>
              <h1 className="text-4xl font-bold text-white md:text-6xl font-heading leading-tight">
                Стань лучшей <span className="text-amber-400">версией себя</span>
              </h1>
              <p className="mt-4 text-lg text-gray-300 md:text-xl px-4 max-w-sm mx-auto md:max-w-none">
                Гайды, техники и инсайты по лукмаксингу — только для своих
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
                <a href={TG_LINK} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-md bg-amber-400 text-black font-bold text-base transition-all hover:bg-amber-300 hover:scale-105">
                  <Send className="h-5 w-5" /> Войти в канал
                </a>
                <Button onClick={scrollToAbout} variant="outline" size="sm"
                  className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors px-8 py-3 h-auto text-base">
                  Узнать больше
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-20 animate-bounce cursor-pointer" onClick={scrollToAbout}
            role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") scrollToAbout() }}>
            <ChevronDown className="h-8 w-8 text-white" />
          </div>
        </div>
      </section>

      {/* О КАНАЛЕ */}
      <section ref={aboutSectionRef} id="about" className="py-20 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div ref={aboutContentRef} className={cn("max-w-4xl mx-auto transition-all duration-1000 ease-out",
            isAboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* маленький аватар */}
              <div className="flex-shrink-0 flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400">
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
                <div className="space-y-4 max-w-2xl">
                  <p className="text-gray-300">Лукмаксинг — это системный подход к улучшению внешности. Не советы из журнала, а реальные техники, которые работают.</p>
                  <p className="text-gray-300">В закрытом канале собраны детальные гайды: уход за кожей, причёска, стиль, осанка, язык тела.</p>
                  <p className="text-gray-300">Только практика, только проверенные методы — без воды и рекламы.</p>
                </div>
                <a href={TG_LINK} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-amber-400 text-black font-bold text-sm hover:bg-amber-300 transition-all mt-2">
                  <Send className="h-4 w-4" /> Вступить
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* СТАТИСТИКА */}
      <section className="py-16 bg-gray-900 text-white border-y border-gray-800">
        <div ref={statsRef} className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { label: "Гайдов в канале", value: "40+", icon: "📋" },
              { label: "Тем по лукмаксингу", value: "12", icon: "✨" },
              { label: "Дней до результата", value: "30", icon: "⚡" },
              { label: "Участников", value: "500+", icon: "👤" },
            ].map((s, i) => (
              <div key={i} className={cn("transition-all duration-700 ease-out", statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}
                style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-3xl font-bold text-amber-400 font-heading">{s.value}</div>
                <div className="text-gray-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ЧТО ВНУТРИ */}
      <section ref={servicesSectionRef} id="guides" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 ref={servicesTitleRef} className={cn("mb-4 text-center text-3xl font-bold font-heading transition-all duration-1000 ease-out",
            isServicesTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            Что внутри канала
          </h2>
          <p className={cn("text-center text-gray-400 mb-12 transition-all duration-1000 ease-out delay-200",
            isServicesTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            Закрытые гайды, которых нет в открытом доступе
          </p>
          <div ref={servicesContentRef} className={cn("max-w-5xl mx-auto transition-all duration-1000 ease-out",
            isServicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: <Sparkles className="h-7 w-7 text-amber-400" />, title: "Уход за кожей", desc: "Пошаговые рутины, разбор составов, советы по типам кожи. Чистая кожа — основа внешности.", progress: 95 },
                { icon: <Crown className="h-7 w-7 text-amber-400" />, title: "Стиль и образ", desc: "Как одеваться по типу фигуры и лица. Что реально улучшает внешность, а что — нет.", progress: 88 },
                { icon: <TrendingUp className="h-7 w-7 text-amber-400" />, title: "Тело и осанка", desc: "Тренировки, постановка осанки, язык тела. Всё, что меняет восприятие окружающих.", progress: 80 },
                { icon: <Eye className="h-7 w-7 text-amber-400" />, title: "Причёска и стрижка", desc: "Выбор стрижки под форму лица, уход за волосами и укладки, которые работают.", progress: 92 },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-amber-400 transition-all duration-300 hover:bg-gray-700">
                  <div className="flex items-center mb-4">
                    {item.icon}
                    <h3 className="text-xl font-semibold font-heading ml-4">{item.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-4">{item.desc}</p>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: isServicesVisible ? `${item.progress}%` : "0%" }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.progress}% участников отмечают улучшение</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ТЕСТ */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-center mb-2">Проверь себя</h2>
          <p className="text-gray-400 text-center mb-10">4 быстрых вопроса — узнай, с чего начать</p>

          {!quizDone ? (
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <div className="flex gap-1 mb-6">
                {QUIZ_QUESTIONS.map((_, i) => (
                  <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-500",
                    i < quizStep ? "bg-amber-400" : i === quizStep ? "bg-amber-400/50" : "bg-gray-700")} />
                ))}
              </div>
              <p className="text-lg font-semibold mb-8 text-center">{QUIZ_QUESTIONS[quizStep].q}</p>
              <div className="flex gap-4">
                <button onClick={() => handleQuiz(true)}
                  className="flex-1 py-3 rounded-xl border border-green-500 text-green-400 font-semibold hover:bg-green-500 hover:text-black transition-all">
                  Да ✓
                </button>
                <button onClick={() => handleQuiz(false)}
                  className="flex-1 py-3 rounded-xl border border-red-500 text-red-400 font-semibold hover:bg-red-500 hover:text-black transition-all">
                  Нет ✗
                </button>
              </div>
              <p className="text-gray-600 text-xs text-center mt-4">Вопрос {quizStep + 1} из {QUIZ_QUESTIONS.length}</p>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-2xl p-8 border border-amber-400 text-center">
              <div className="text-5xl mb-4">{quizScore === 4 ? "🏆" : quizScore >= 2 ? "⚡" : "🚀"}</div>
              <p className="text-2xl font-bold mb-2">{quizScore} / 4</p>
              <p className={cn("text-lg mb-6", getQuizResult().color)}>{getQuizResult().text}</p>
              <a href={TG_LINK} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-amber-400 text-black font-bold hover:bg-amber-300 transition-all">
                <Send className="h-5 w-5" /> Открыть гайды
              </a>
              <button onClick={() => { setQuizStep(0); setQuizScore(0); setQuizDone(false) }}
                className="block w-full mt-3 text-gray-500 text-sm hover:text-gray-300 transition-colors">
                Пройти заново
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaSectionRef} id="cta" className="py-24 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className={cn("max-w-2xl mx-auto text-center transition-all duration-1000 ease-out",
            isHeadingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <h2 ref={headingRef} className="text-3xl md:text-5xl font-bold font-heading mb-6">
              Готов стать <span className="text-amber-400">лучше?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Вступай в закрытый Telegram-канал и получи доступ ко всем гайдам прямо сейчас
            </p>
            <a href={TG_LINK} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-md bg-amber-400 text-black font-bold text-lg transition-all hover:bg-amber-300 hover:scale-105 shadow-[0_0_30px_rgba(251,191,36,0.4)]">
              <Send className="h-6 w-6" /> Войти в канал
            </a>
            <p className="text-gray-500 text-sm mt-6">Закрытый доступ · Только проверенные методы</p>
          </div>
        </div>
      </section>

      <ChatbotModal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  )
}