import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { A11y, Keyboard, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import type { Project } from "../../data/projects";
import { usePreferences } from "../../hooks/usePreferences";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useReveal } from "../../hooks/useReveal";
import ProjectCard from "./ProjectCard";
import "swiper/css";
import "swiper/css/a11y";
import "./projects.css";

interface ProjectsCarouselProps {
  projects: readonly Project[];
  onVideo: (url: string, title: string) => void;
}

export default function ProjectsCarousel({ projects, onVideo }: ProjectsCarouselProps) {
  const { t, language } = usePreferences();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const { ref, entered } = useReveal<HTMLDivElement>();
  const previousRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [position, setPosition] = useState({ beginning: true, end: false, locked: false, snap: 0, count: 1 });

  const updatePosition = (swiper: SwiperInstance) => {
    const next = { beginning: swiper.isBeginning, end: swiper.isEnd, locked: swiper.isLocked, snap: swiper.snapIndex, count: Math.max(1, swiper.snapGrid.length) };
    setPosition((current) => current.beginning === next.beginning && current.end === next.end && current.locked === next.locked && current.snap === next.snap && current.count === next.count ? current : next);
  };
  const positionLabel = (pattern: string, index = position.snap + 1) => pattern.replace("{index}", String(index)).replace("{total}", String(position.count));

  return <div ref={ref} className="projects-carousel" data-entered={entered} role="region" aria-roledescription={t.projects.carousel} aria-labelledby="projects-carousel-title" onFocusCapture={() => swiperRef.current?.keyboard?.enable()} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) swiperRef.current?.keyboard?.disable(); }}>
    <div className="projects-heading">
      <div><h2 id="projects-carousel-title" className="section-title">{t.projects.title}</h2><p className="secondary-text">{t.projects.subtitle}</p></div>
      <div className="carousel-arrows">
        <button ref={previousRef} type="button" className="icon-button" aria-label={t.projects.previous} title={t.projects.previous} aria-controls="projects-carousel-slides" disabled={position.beginning || position.locked}><ArrowLeft size={20} aria-hidden="true" /></button>
        <button ref={nextRef} type="button" className="icon-button" aria-label={t.projects.next} title={t.projects.next} aria-controls="projects-carousel-slides" disabled={position.end || position.locked}><ArrowRight size={20} aria-hidden="true" /></button>
      </div>
    </div>
    <Swiper key={language}
      modules={[Navigation, Keyboard, A11y]} slidesPerView={1} slidesPerGroup={1}
      breakpoints={{ 768: { slidesPerView: 2, slidesPerGroup: 2 }, 1024: { slidesPerView: 3, slidesPerGroup: 3 } }}
      spaceBetween={20} speed={reducedMotion ? 0 : 450} watchOverflow watchSlidesProgress
      keyboard={{ enabled: false, onlyInViewport: true, pageUpDown: false }}
      navigation={{ prevEl: previousRef.current, nextEl: nextRef.current }}
      a11y={{ containerRoleDescriptionMessage: t.projects.carousel, itemRoleDescriptionMessage: t.projects.slideRole, prevSlideMessage: t.projects.previous, nextSlideMessage: t.projects.next, firstSlideMessage: t.projects.first, lastSlideMessage: t.projects.last, slideLabelMessage: t.projects.slide, id: "projects-carousel-slides" }}
      onBeforeInit={(swiper) => { const navigation = swiper.params.navigation; if (navigation && typeof navigation !== "boolean") { navigation.prevEl = previousRef.current; navigation.nextEl = nextRef.current; } }}
      onSwiper={(swiper) => { swiperRef.current = swiper; updatePosition(swiper); }}
      onSlideChange={updatePosition} onSnapIndexChange={updatePosition} onResize={updatePosition} onSlidesUpdated={updatePosition} onBreakpoint={updatePosition} onLock={updatePosition} onUnlock={updatePosition}
    >
      {projects.map((project, index) => <SwiperSlide key={project.id}>
        {({ isVisible }) => <div className="project-reveal" style={{ "--reveal-delay": `${Math.min(index, 2) * 70}ms` } as CSSProperties} inert={!isVisible}><ProjectCard project={project} onVideo={onVideo} /></div>}
      </SwiperSlide>)}
    </Swiper>
    <div className="carousel-pagination" role="group" aria-label={t.projects.pagination}>
      {Array.from({ length: position.count }, (_, index) => <button key={index} type="button" aria-label={positionLabel(t.projects.goTo, index + 1)} title={positionLabel(t.projects.goTo, index + 1)} aria-current={position.snap === index ? "true" : undefined} aria-controls="projects-carousel-slides" onClick={() => { const swiper = swiperRef.current; if (swiper) swiper.slideTo(index * Number(swiper.params.slidesPerGroup)); }}><span /></button>)}
      <span className="sr-only" role="status" aria-live="polite">{positionLabel(t.projects.position)}</span>
    </div>
  </div>;
}
