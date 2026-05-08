import { StarField } from "@/components/StarField"
import { ChevronDown, Send, Sparkles, BookOpen, TrendingUp, Eye, Crown } from "lucide-react"
import { ChatbotModal } from "@/components/ChatbotModal"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"

const TG_LINK = "https://t.me/+HJYYu2Us075jMzk6"

export default function Index() {
  const [isHeadingVisible, setIsHeadingVisible] = useState(false)
  const [isAboutVisible, setIsAboutVisible] = useState(false)
  const [isServicesVisible, setIsServicesVisible] = useState(false)
  const [isServicesTitleVisible, setIsServicesTitleVisible] = useState(false)
  const [blurAmount, setBlurAmount] = useState(0)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [initialHeight, setInitialHeight] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const aboutSectionRef = useRef<HTMLElement>(null)
  const aboutContentRef = useRef<HTMLDivElement>(null)
  const servicesSectionRef = useRef<HTMLElement>(null)
  const servicesContentRef = useRef<HTMLDivElement>(null)
  const servicesTitleRef = useRef<HTMLHeadingElement>(null)
  const ctaSectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef(0)
  const lastScrollRef = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    if (initialHeight === 0) {
      setInitialHeight(window.innerHeight)
    }
  }, [initialHeight])

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const maxBlur = 8
          const triggerHeight = initialHeight * 1.2
          const newBlurAmount = Math.min(maxBlur, (scrollRef.current / triggerHeight) * maxBlur)
          setBlurAmount(newBlurAmount)
          lastScrollRef.current = scrollRef.current
          ticking.current = false
        })
        ticking.current = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => { window.removeEventListener("scroll", handleScroll) }
  }, [initialHeight])

  useEffect(() => {
    const headingObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsHeadingVisible(true); if (headingRef.current) headingObserver.unobserve(headingRef.current) }
    }, { threshold: 0.1 })
    if (headingRef.current) headingObserver.observe(headingRef.current)

    const aboutObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsAboutVisible(true); if (aboutContentRef.current) aboutObserver.unobserve(aboutContentRef.current) }
    }, { threshold: 0.1 })
    if (aboutContentRef.current) aboutObserver.observe(aboutContentRef.current)

    const servicesObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsServicesVisible(true); if (servicesContentRef.current) servicesObserver.unobserve(servicesContentRef.current) }
    }, { threshold: 0.1 })
    if (servicesContentRef.current) servicesObserver.observe(servicesContentRef.current)

    const servicesTitleObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsServicesTitleVisible(true); if (servicesTitleRef.current) servicesTitleObserver.unobserve(servicesTitleRef.current) }
    }, { threshold: 0.1 })
    if (servicesTitleRef.current) servicesTitleObserver.observe(servicesTitleRef.current)

    return () => {
      if (headingRef.current) headingObserver.unobserve(headingRef.current)
      if (aboutContentRef.current) aboutObserver.unobserve(aboutContentRef.current)
      if (servicesContentRef.current) servicesObserver.unobserve(servicesContentRef.current)
      if (servicesTitleRef.current) servicesTitleObserver.unobserve(servicesTitleRef.current)
    }
  }, [])

  const scaleFactor = 1 + blurAmount / 16
  const warpSpeedStyle = { transform: `scale(${scaleFactor})`, transition: "transform 0.2s ease-out" }

  const scrollToAbout = () => {
    if (aboutSectionRef.current) aboutSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  const scrollToCta = () => {
    if (ctaSectionRef.current) ctaSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  const openChatbot = () => setIsChatbotOpen(true)
  const closeChatbot = () => setIsChatbotOpen(false)
  const heroStyle = { height: initialHeight ? `${initialHeight}px` : "100vh" }

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-black" style={heroStyle}>
        <div className="absolute top-6 right-6 z-10 flex space-x-3">
          <a
            href={TG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md border border-white bg-transparent text-white text-sm transition-colors hover:bg-white hover:text-black focus:outline-none"
          >
            <Send className="h-4 w-4" />
            Telegram
          </a>
        </div>

        <div className="absolute inset-0" style={warpSpeedStyle}>
          <StarField blurAmount={blurAmount} />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div
              className="backdrop-blur-sm px-6 py-6 rounded-lg inline-block relative"
              style={{ background: "radial-gradient(circle, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)" }}
            >
              <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Закрытый канал</p>
              <h1 className="text-4xl font-bold text-white md:text-6xl font-heading leading-tight">
                Стань лучшей{" "}
                <span className="text-amber-400">версией себя</span>
              </h1>
              <p className="mt-4 text-lg text-gray-300 md:text-xl px-4 max-w-sm mx-auto md:max-w-none">
                Гайды, техники и инсайты по лукмаксингу — только для своих
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
                <a
                  href={TG_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-md bg-amber-400 text-black font-bold text-base transition-all hover:bg-amber-300 hover:scale-105"
                >
                  <Send className="h-5 w-5" />
                  Войти в канал
                </a>
                <Button
                  onClick={scrollToAbout}
                  variant="outline"
                  size="sm"
                  className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors px-8 py-3 h-auto text-base"
                >
                  Узнать больше
                </Button>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-20 animate-bounce cursor-pointer"
            onClick={scrollToAbout}
            role="button"
            aria-label="Прокрутить вниз"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") scrollToAbout() }}
          >
            <ChevronDown className="h-8 w-8 text-white" />
          </div>
        </div>
      </section>

      {/* О КАНАЛЕ */}
      <section ref={aboutSectionRef} id="about" className="py-20 bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div
            ref={aboutContentRef}
            className={cn(
              "max-w-4xl mx-auto transition-all duration-1000 ease-out",
              isAboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-amber-400 flex-shrink-0">
                <img
                  src="https://cdn.poehali.dev/projects/b0d40530-9cee-4726-bad5-d79a9df23b5a/bucket/f3ddbde8-9b02-46c7-9fd9-8afb781ddc46.png"
                  alt="Автор канала"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="space-y-4 text-center md:text-left px-4 md:px-0">
                <h2 className="text-3xl font-bold font-heading">О канале</h2>
                <div className="space-y-4 max-w-2xl">
                  <p className="text-gray-300">
                    Лукмаксинг — это системный подход к улучшению внешности. Не советы из журнала, а реальные техники, которые работают.
                  </p>
                  <p className="text-gray-300">
                    В закрытом канале собраны детальные гайды: уход за кожей, причёска, стиль, осанка, язык тела и всё, что влияет на восприятие.
                  </p>
                  <p className="text-gray-300">
                    Только практика, только проверенные методы — без воды и рекламы.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center md:justify-start">
                  <a
                    href={TG_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-amber-400 text-black font-bold text-sm transition-all hover:bg-amber-300"
                  >
                    <Send className="h-4 w-4" />
                    Вступить
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ЧТО ВНУТРИ */}
      <section ref={servicesSectionRef} id="guides" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2
            ref={servicesTitleRef}
            className={cn(
              "mb-4 text-center text-3xl font-bold font-heading transition-all duration-1000 ease-out",
              isServicesTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            Что внутри канала
          </h2>
          <p
            className={cn(
              "text-center text-gray-400 mb-12 transition-all duration-1000 ease-out delay-200",
              isServicesTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            Закрытые гайды, которые недоступны нигде больше
          </p>
          <div
            ref={servicesContentRef}
            className={cn(
              "max-w-5xl mx-auto transition-all duration-1000 ease-out",
              isServicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-lg p-6 transition-all duration-300 hover:bg-gray-700 border border-gray-700 hover:border-amber-400">
                <div className="flex items-center mb-4">
                  <Sparkles className="h-7 w-7 text-amber-400 mr-4" />
                  <h3 className="text-xl font-semibold font-heading">Уход за кожей</h3>
                </div>
                <p className="text-gray-300">
                  Пошаговые рутины, разбор составов, советы по типам кожи. Чистая кожа — основа внешности.
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 transition-all duration-300 hover:bg-gray-700 border border-gray-700 hover:border-amber-400">
                <div className="flex items-center mb-4">
                  <Crown className="h-7 w-7 text-amber-400 mr-4" />
                  <h3 className="text-xl font-semibold font-heading">Стиль и образ</h3>
                </div>
                <p className="text-gray-300">
                  Как одеваться по типу фигуры и лица. Что реально улучшает внешность, а что — нет.
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 transition-all duration-300 hover:bg-gray-700 border border-gray-700 hover:border-amber-400">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-7 w-7 text-amber-400 mr-4" />
                  <h3 className="text-xl font-semibold font-heading">Тело и осанка</h3>
                </div>
                <p className="text-gray-300">
                  Тренировки, постановка осанки, язык тела. Всё, что меняет восприятие тебя окружающими.
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 transition-all duration-300 hover:bg-gray-700 border border-gray-700 hover:border-amber-400">
                <div className="flex items-center mb-4">
                  <Eye className="h-7 w-7 text-amber-400 mr-4" />
                  <h3 className="text-xl font-semibold font-heading">Причёска и стрижка</h3>
                </div>
                <p className="text-gray-300">
                  Гайды по выбору стрижки под форму лица, уход за волосами и укладки, которые работают.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaSectionRef} id="cta" className="py-24 bg-black text-white">
        <div className="container mx-auto px-4">
          <div
            className={cn(
              "max-w-2xl mx-auto text-center transition-all duration-1000 ease-out",
              isHeadingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            <h2
              ref={headingRef}
              className="text-3xl md:text-5xl font-bold font-heading mb-6"
            >
              Готов стать{" "}
              <span className="text-amber-400">лучше?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Вступай в закрытый Telegram-канал и получи доступ ко всем гайдам прямо сейчас
            </p>
            <a
              href={TG_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-md bg-amber-400 text-black font-bold text-lg transition-all hover:bg-amber-300 hover:scale-105 shadow-[0_0_30px_rgba(251,191,36,0.4)]"
            >
              <Send className="h-6 w-6" />
              Войти в канал
            </a>
            <p className="text-gray-500 text-sm mt-6">Закрытый доступ · Только проверенные методы</p>
          </div>
        </div>
      </section>

      <ChatbotModal isOpen={isChatbotOpen} onClose={closeChatbot} />
    </div>
  )
}