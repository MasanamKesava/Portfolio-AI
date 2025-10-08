
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  FileText,
  Download,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";

/** Lightweight, dependency-free carousel */
function Carousel<T>({
  items,
  renderItem,
  autoPlayMs = 3500,
  className = "",
  ariaLabel = "carousel",
}: {
  items: T[];
  renderItem: (item: T, idx: number) => React.ReactNode;
  autoPlayMs?: number;
  className?: string;
  ariaLabel?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = items.length;
  const containerRef = useRef<HTMLDivElement>(null);

  const go = (n: number) => setIdx((p) => (p + n + len) % len);
  const goTo = (n: number) => setIdx(((n % len) + len) % len);

  useEffect(() => {
    if (paused || len <= 1) return;
    const t = setInterval(() => go(1), autoPlayMs);
    return () => clearInterval(t);
  }, [paused, len, autoPlayMs]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {items.map((item, i) => (
          <div key={i} className="min-w-full">
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      {len > 1 && (
        <>
          <button
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 glass-card p-2 rounded-full hover:opacity-90"
            onClick={() => go(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 glass-card p-2 rounded-full hover:opacity-90"
            onClick={() => go(1)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {len > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i === idx ? "bg-primary w-6" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Gallery card that opens a preview dialog */
function GalleryCard({
  title,
  image,
  tag,
  driveUrl,
  onPreview,
}: {
  title: string;
  image: string;
  tag?: string;
  driveUrl: string;
  onPreview: () => void;
}) {
  return (
    <div className="group">
      <Card className="glass-card border-0 overflow-hidden h-full hover-lift cursor-pointer" onClick={onPreview}>
        <div className="relative h-48">
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.onerror = null;
              el.src =
                "https://via.placeholder.com/800x500?text=Resume+Example";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          {tag && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-primary text-white">{tag}</Badge>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="text-white text-sm font-medium mb-2">{title}</div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview();
                }}
              >
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <a href={driveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

const ResumeBuilder = () => {
  const [previewImage, setPreviewImage] = useState<{ title: string; image: string } | null>(null);

  // Centralized Google Drive link
  const driveUrl =
    "https://drive.google.com/drive/folders/1tbzQFRj5RSbcdUdDYDnqLH8--n0G36Ih?usp=drive_link";

  // UPDATED: Use your Cloudinary images for Popular Templates
  const resumeTemplates = useMemo(
    () => [
      {
        id: 1,
        name: "ATS-Friendly Professional",
        category: "ATS Optimized",
        image:
          "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758574498/imgi_321_latex_templates_resumelab_11_hsyccb.jpg",
        description:
          "Clean, professional resume optimized for ATS with high success rate.",
        features: [
          "ATS Compatible",
          "Clean Layout",
          "Industry Standard",
          "Easy Editing",
        ],
        rating: 4.9,
        downloads: 15000,
        gradient: "from-blue-500 to-cyan-600",
      },
      {
        id: 2,
        name: "Creative Designer",
        category: "Creative",
        image:
          "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758574495/imgi_286_canva-modern-professional-cv-resume-zveo1XzOLKo_zw1x4a.jpg",
        description:
          "Modern creative resume template for designers and visual roles.",
        features: [
          "Visual Appeal",
          "Color Schemes",
          "Portfolio Integration",
          "Creative Layout",
        ],
        rating: 4.8,
        downloads: 8500,
        gradient: "from-purple-500 to-pink-600",
      },
      {
        id: 3,
        name: "Tech Professional",
        category: "Technology",
        image:
          "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758574486/imgi_97_ajRjLmpwZw_j5gmil.webp",
        description:
          "Technical resume template showcasing skills and projects effectively.",
        features: [
          "Skills Highlight",
          "Project Showcase",
          "GitHub Integration",
          "Tech Stack",
        ],
        rating: 4.9,
        downloads: 12000,
        gradient: "from-green-500 to-teal-600",
      },
      {
        id: 4,
        name: "Executive Level",
        category: "Executive",
        image:
          "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758574496/imgi_289_resume_executive_assistant_xg742k.png",
        description:
          "Premium executive resume for senior/leadership positions.",
        features: [
          "Executive Format",
          "Achievement Focus",
          "Leadership Skills",
          "Premium Design",
        ],
        rating: 4.7,
        downloads: 6500,
        gradient: "from-orange-500 to-red-600",
      },
    ],
    []
  );

  // Map template -> sample portfolio page
  const templatePortfolioMap: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 1,
  };

  const gallery = useMemo(
    () => [
      {
        title: "Latex Professional",
        image:
          "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758574498/imgi_321_latex_templates_resumelab_11_hsyccb.jpg",
        tag: "ATS",
      },
      {
        title: "Executive Assistant",
        image:
          "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758574496/imgi_289_resume_executive_assistant_xg742k.png",
        tag: "Executive",
      },
      {
        title: "Modern Professional (1)",
        image:
          "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758574495/imgi_286_canva-modern-professional-cv-resume-zveo1XzOLKo_zw1x4a.jpg",
        tag: "Modern",
      },
      {
        title: "Modern Professional (2)",
        image:
          "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758574493/imgi_281_canva-modern-professional-cv-resume-RZAonb9ZjgE_kw43vb.jpg",
        tag: "Modern",
      },
      {
        title: "ATS Clean Layout",
        image:
          "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758574491/imgi_193_68cd086b8c2ec2e8c2c54480_Screenshot_2025-09-19_at_1.05.12_PM_advqoe.png",
        tag: "ATS",
      },
      {
        title: "Minimalist (WebP 1)",
        image:
          "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758574487/imgi_119_LmpwZWc_m8xbxn.webp",
        tag: "Minimal",
      },
      {
        title: "Minimalist (WebP 2)",
        image:
          "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758574486/imgi_97_ajRjLmpwZw_j5gmil.webp",
        tag: "Minimal",
      },
      {
        title: "Sleek Monochrome",
        image:
          "https://res.cloudinary.com/dswrgvg3c/image/upload/v1758574484/imgi_81_MTJiNmQzOGE_trwbky.webp",
        tag: "Sleek",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Resume Builder
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Create ATS-friendly resumes that get you noticed. Pick a template,
            customize, and ship in minutes.
          </p>

          {/* Google Drive Button */}
          <div className="glass-card p-6 rounded-2xl max-w-3xl mx-auto mb-10">
            <h3 className="text-xl font-semibold mb-2">
              📁 Browse All Resume Examples
            </h3>
            <p className="text-muted-foreground mb-4">
              See full examples, variations, and formats stored on Google Drive.
            </p>
            <Button
              asChild
              className="bg-gradient-primary hover:opacity-90 text-white shadow-glow"
            >
              <a href={driveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Resume Examples (Google Drive)
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Templates Carousel */}
      <section className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Popular Templates</h2>
          <Carousel
            items={resumeTemplates}
            ariaLabel="Resume templates carousel"
            renderItem={(template) => (
              <Card className="glass-card border-0 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-72 lg:h-[26rem]">
                    <img
                      src={template.image}
                      alt={template.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        el.onerror = null;
                        el.src =
                          "https://via.placeholder.com/1200x800?text=Template+Preview";
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`bg-gradient-to-r ${template.gradient} text-white`}
                      >
                        {template.category}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 glass-card p-2 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">
                          {template.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 lg:p-8 flex flex-col justify-center">
                    <CardHeader className="p-0">
                      <CardTitle className="text-2xl font-bold mb-2">
                        {template.name}
                      </CardTitle>
                      <p className="text-muted-foreground mb-4">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          {template.downloads.toLocaleString()} downloads
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />5 min setup
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {template.features.map((f: string, i: number) => (
                          <Badge
                            key={`${template.id}-${i}`}
                            variant="outline"
                            className="glass-button border-primary/20 text-primary"
                          >
                            {f}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions: Use Template • View Sample Portfolio (new tab) • Drive */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button className="flex-1 bg-gradient-primary hover:opacity-90 text-white">
                          <FileText className="mr-2 h-4 w-4" />
                          Use Template
                          <a
                            href={driveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>

                        {/* <Button asChild variant="outline" className="glass-button flex-1 sm:flex-none">
                          <Link
                            to={`/sample-portfolio/${templatePortfolioMap[template.id] ?? 1}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Sample Portfolio
                          </Link>
                        </Button> */}

                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          className="glass-button"
                          title="Open examples on Drive"
                        >
                          <a
                            href={driveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            )}
          />
        </div>
      </section>

      {/* Mini Flip Gallery */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-3xl font-bold">Examples Gallery</h2>
            <Button
              asChild
              className="bg-gradient-primary hover:opacity-90 text-white shadow-glow"
            >
              <a href={driveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View All on Google Drive
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((g, i) => (
              <GalleryCard
                key={i}
                title={g.title}
                image={g.image}
                tag={g.tag}
                driveUrl={driveUrl}
                onPreview={() => setPreviewImage({ title: g.title, image: g.image })}
              />
            ))}
          </div>

          {/* Preview Dialog */}
          <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>{previewImage?.title}</DialogTitle>
              </DialogHeader>
              <div className="relative">
                <img
                  src={previewImage?.image}
                  alt={previewImage?.title}
                  className="w-full h-auto rounded-lg"
                />
                <div className="mt-4 flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setPreviewImage(null)}>
                    Close
                  </Button>
                  <Button asChild>
                    <a href={driveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Drive
                    </a>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 rounded-3xl">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Build Your Resume?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start with our AI-powered builder and create a resume that stands
              out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* <Button className="bg-gradient-primary hover:opacity-90 text-white shadow-glow text-lg px-8 py-4">
                Start Building Resume
              </Button> */}
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="glass-button text-lg px-8 py-4"
                >
                  Get Expert Help
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeBuilder;
