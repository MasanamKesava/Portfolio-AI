import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Mail,
  Linkedin,
  Phone,
  Award,
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";

const SamplePortfolio = () => {
  const { id } = useParams();

  // Small CSS helper for a hexagon avatar
  const HexCSS = () => (
    <style>{`
      .hex-mask {
        clip-path: polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0 50%);
      }
    `}</style>
  );

  // Updated portfolio data
  const portfolioData = {
    1: {
      name: "Harshini Adusumilli",
      role: "Full Stack Developer",
      location: "Hyderabad, IN",
      email: "kathyaini.dev@example.com",
      phone: "+91 90000 00001",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=640&h=640&fit=crop&crop=faces",
      bio:
        "Modern dark-theme portfolio with a hexagonal profile image and clean layout. Features responsive design and smooth animations. Full-stack engineer focusing on scalable web apps with .NET 8 and React.",
      skills: [
        { name: ".NET 8 / ASP.NET", level: 92 },
        { name: "React", level: 90 },
        { name: "Node.js", level: 86 },
        { name: "MongoDB", level: 84 },
        { name: "C#", level: 92 },
        { name: "Azure", level: 82 },
        { name: "Kafka", level: 78 },
        { name: "EF Core", level: 88 },
        { name: "OAuth2", level: 80 },
        { name: "Angular", level: 70 },
      ],
      experience: [
        {
          title: "Senior Full Stack Developer",
          company: "Contoso Systems",
          duration: "Jan 2023 - Present",
          description:
            "Built microservices with .NET 8 + EF Core, React frontends, and Kafka-based event pipelines; reduced page TTI by 35%.",
        },
        {
          title: "Software Engineer",
          company: "Northwind Tech",
          duration: "Aug 2020 - Dec 2022",
          description:
            "Developed secure OAuth2 flows, optimized MongoDB queries, and led Azure deployments.",
        },
      ],
      projects: [
        {
          name: "E-Commerce Suite",
          description:
            "Modular e-commerce with .NET 8 APIs, React storefront, Kafka events, and MongoDB product catalogs.",
          technologies: ["React", "ASP.NET", ".NET 8", "Kafka", "MongoDB", "EF Core"],
         // github: "https://github.com",
          //live: "https://example.com",
        },
        {
          name: "Real-time Dashboard",
          description:
            "SignalR + React dashboard with role-based access and OAuth2; deployed on Azure App Service.",
          technologies: ["React", "SignalR", "Azure", "OAuth2"],
          //github: "https://github.com",
          //live: "https://example.com",
        },
      ],
      achievements: [
        "Speaker – Azure Developer Community (2024)",
        "Implemented SSO via OAuth2 across 5 services",
        "Cut infra cost 18% with Azure autoscale",
        "Mentored 8 junior devs",
      ],
      education: [
        {
          degree: "B.Tech, Computer Science",
          school: "JNTU Hyderabad",
          year: "2020",
          gpa: "8.6/10",
        },
      ],
    },
    2: {
      name: "Priya",
      role: "Database Administrator",
      location: "Bengaluru, IN",
      email: "priya.dba@example.com",
      phone: "+91 90000 00002",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=640&h=640&fit=crop&crop=faces",
      bio:
        "Creative and colorful portfolio showcasing design-minded data systems with interactive elements and beautiful typography. Passionate about performance, reliability, and data governance.",
      skills: [
        { name: "SQL / PL/SQL", level: 94 },
        { name: "Python", level: 85 },
        { name: "Hadoop", level: 82 },
        { name: "Hive", level: 80 },
        { name: "Spark", level: 78 },
        { name: "Pandas/Numpy", level: 84 },
        { name: "Matplotlib", level: 76 },
      ],
      experience: [
        {
          title: "Database Administrator",
          company: "DataCraft Labs",
          duration: "Feb 2022 - Present",
          description:
            "Owned performance tuning and backup/DR; implemented partitioning and CDC pipelines.",
        },
        {
          title: "Data Engineer",
          company: "InsightWorks",
          duration: "Jul 2019 - Jan 2022",
          description:
            "Built Hive/Spark ETL and warehouse models; automated quality checks with Python.",
        },
      ],
      projects: [
        {
          name: "DW Modernization",
          description:
            "Migrated on-prem warehouse to Hive/Spark with Python orchestration; 40% faster analytics.",
          technologies: ["Python", "SQL", "Hive", "Spark"],
        //  github: "https://github.com",
          //live: "https://example.com",
        },
        {
          name: "Monitoring & Alerting",
          description:
            "Custom DB health dashboards and anomaly detection using Pandas and Matplotlib.",
          technologies: ["Python", "Pandas", "Matplotlib"],
         // github: "https://github.com",
          //live: "https://example.com",
        },
      ],
      achievements: [
        "Restored critical DB in <10 min RTO",
        "Cut query costs by 25% via indexing/partitioning",
        "Authored internal DBA playbook",
        "Trained 30+ analysts on SQL best practices",
      ],
      education: [
        {
          degree: "B.E., Information Science",
          school: "BMS College of Engineering",
          year: "2019",
          gpa: "8.4/10",
        },
      ],
    },
    3: {
      name: "Sai Ram",
      role: "Frontend Developer",
      location: "Chennai, IN",
      email: "sairam.ui@example.com",
      phone: "+91 90000 00003",
      image:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=640&h=640&fit=crop&crop=faces",
      bio:
        "Clean, minimalist portfolio with professional presentation and smooth UX. Perfect for showcasing web projects and component craftsmanship.",
      skills: [
        { name: "HTML", level: 95 },
        { name: "CSS", level: 92 },
        { name: "Python", level: 70 },
        { name: "C Programming", level: 68 },
      ],
      experience: [
        {
          title: "Frontend Developer",
          company: "PixelForge",
          duration: "Apr 2023 - Present",
          description:
            "Built accessible UI kits and high-performance pages; improved Lighthouse scores to 95+.",
        },
        {
          title: "Web Developer (Intern)",
          company: "WebWorks",
          duration: "Jan 2022 - Mar 2023",
          description:
            "Implemented layouts and animations; collaborated with designers for pixel-perfect UIs.",
        },
      ],
      projects: [
        {
          name: "Portfolio System",
          description:
            "Static-site generator and components library for quick personal portfolios.",
          technologies: ["HTML", "CSS"],
          //github: "https://github.com",
          live: "https://example.com",
        },
        {
          name: "UI Playground",
          description:
            "Showcase of CSS animations and interaction patterns with minimal JS.",
          technologies: ["CSS", "HTML"],
         // github: "https://github.com",
          //live: "https://example.com",
        },
      ],
      achievements: [
        "Top 5 in Campus UI Hackathon",
        "Built internal CSS utility library",
        "Accessibility champion (WCAG focus)",
      ],
      education: [
        {
          degree: "B.Sc., Computer Science",
          school: "Loyola College",
          year: "2022",
          gpa: "8.2/10",
        },
      ],
    },
  } as const;

  const portfolio =
    portfolioData[(Number(id) as 1 | 2 | 3) || 1] ?? portfolioData[1];

  return (
    <div className="min-h-screen">
      <Navbar />
      <HexCSS />

      <div className="pt-20 pb-16">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Link to="/products">
            <Button variant="outline" className="glass-button">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolios
            </Button>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="glass-card border-0">
                <CardContent className="p-6 text-center">
                  {/* Hexagonal avatar */}
                  <img
                    src={portfolio.image}
                    alt={portfolio.name}
                    className="w-32 h-32 object-cover hex-mask mx-auto mb-4"
                    style={{
                      filter: "drop-shadow(0 10px 22px rgba(124,58,237,.35))",
                    }}
                  />
                  <h1 className="text-2xl font-bold mb-2">{portfolio.name}</h1>
                  <p className="text-lg text-primary mb-4">{portfolio.role}</p>
                  <div className="flex items-center justify-center text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {portfolio.location}
                  </div>

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="glass-button"
                    >
                      <a href={`mailto:${portfolio.email}`}>
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="glass-button"
                    >
                      <a href={`tel:${portfolio.phone.replace(/\s/g, "")}`}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass-button"
                    >
                      <Github className="h-4 w-4 mr-1" />
                      GitHub
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="glass-button"
                    >
                      <Linkedin className="h-4 w-4 mr-1" />
                      LinkedIn
                    </Button>
                  </div>

                  <Button className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-glow">
                    Download Resume
                  </Button>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-xl">Technical Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {portfolio.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Award className="mr-2 h-5 w-5 text-primary" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {portfolio.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-sm">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl">About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {portfolio.bio}
                  </p>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl">Work Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {portfolio.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-primary/20 pl-6 relative"
                    >
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full" />
                      <h3 className="text-lg font-semibold">{exp.title}</h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                      <div className="flex items-center text-muted-foreground text-sm mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {exp.duration}
                      </div>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Projects */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl">Featured Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {portfolio.projects.map((project, index) => (
                      <div
                        key={index}
                        className="neo-card p-6 rounded-xl hover-lift"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-semibold">
                            {project.name}
                          </h3>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="glass-button"
                            >
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="glass-button"
                            >
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <Badge
                              key={techIndex}
                              variant="secondary"
                              className="glass-button"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl">Education</CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolio.education.map((edu, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-primary/20 pl-6 relative"
                    >
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full" />
                      <h3 className="text-lg font-semibold">{edu.degree}</h3>
                      <p className="text-primary font-medium">{edu.school}</p>
                      <div className="flex items-center justify-between text-muted-foreground text-sm">
                        <span>Class of {edu.year}</span>
                        <span>GPA: {edu.gpa}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Tech Stack */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-2xl">Built With Modern Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Our portfolios are crafted using cutting-edge web technologies to ensure fast performance, beautiful design, and seamless user experience.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all">
                      <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/>
                      </svg>
                      <span className="font-semibold text-sm">Next.js</span>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all">
                      <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/>
                      </svg>
                      <span className="font-semibold text-sm">React.js</span>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all">
                      <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
                      </svg>
                      <span className="font-semibold text-sm">Tailwind CSS</span>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all">
                      <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.934 8.519a1.044 1.044 0 0 1 .303.23l2.349 2.349a.666.666 0 0 1 0 .942l-2.35 2.349a1.047 1.047 0 0 1-1.474-1.474l1.05-1.05H10.47a1.047 1.047 0 1 1 0-2.095h6.342l-1.05-1.05a1.047 1.047 0 0 1 1.171-1.701zm-9.868 0a1.047 1.047 0 0 1 1.474 1.474l-1.05 1.05h6.342a1.047 1.047 0 1 1 0 2.095H7.49l1.05 1.05a1.047 1.047 0 1 1-1.474 1.474l-2.35-2.349a.666.666 0 0 1 0-.942l2.35-2.349a1.044 1.044 0 0 1 .23-.303zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 1.5c5.799 0 10.5 4.701 10.5 10.5S17.799 22.5 12 22.5 1.5 17.799 1.5 12 6.201 1.5 12 1.5z"/>
                      </svg>
                      <span className="font-semibold text-sm">Vercel</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all">
                      <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.13 9.68a4.69 4.69 0 0 1-1.17-.15 4.62 4.62 0 0 1-.8-.34 3.48 3.48 0 0 1-.73-.52l4.3-2.48a4.75 4.75 0 0 1-1.6 3.49zM12 15.45a3.46 3.46 0 0 1-3.45-3.45 3.45 3.45 0 0 1 6.63-1.5l-4.3 2.48a3.44 3.44 0 0 1 1.12 2.47zM23.19 12c0 .35-.03.7-.08 1.05a11.9 11.9 0 0 1-.95 3.14c-.11.26-.23.52-.36.77a11.83 11.83 0 0 1-3.14 3.86 11.92 11.92 0 0 1-6.66 2.05c-1.55 0-3.04-.3-4.41-.84A11.83 11.83 0 0 1 .96 13.2 12 12 0 0 1 12 0c3.11 0 5.94 1.19 8.07 3.13a11.9 11.9 0 0 1 3.12 8.87zm-11.82 5.3c.53 0 1.04-.07 1.54-.2l4.3-2.48a5.9 5.9 0 0 1-2.32 2.04 5.88 5.88 0 0 1-3.52.64zm.57-14.05c-.54 0-1.06.07-1.56.2L5.98 5.93a5.88 5.88 0 0 1 5.96-2.68z"/>
                      </svg>
                      <span className="font-semibold text-sm">Netlify</span>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all">
                      <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.25 5l6.5 6.5-6.5 6.5-6.5-6.5L12.25 5z"/>
                      </svg>
                      <span className="font-semibold text-sm">Lucide Icons</span>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all">
                      <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.312l-1.658-1.506C4.278 14.94 0 11.096 0 6.5 0 2.92 2.92 0 6.5 0c2.062 0 4.04 1.017 5.5 2.625C13.46 1.017 15.438 0 17.5 0 21.08 0 24 2.92 24 6.5c0 4.596-4.278 8.44-10.342 13.306L12 21.312z"/>
                      </svg>
                      <span className="font-semibold text-sm">Dark/Light Mode</span>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-background to-muted/20 hover:shadow-lg transition-all">
                      <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="font-semibold text-sm">Responsive</span>
                    </div>
                  </div>
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <p className="text-sm text-center flex items-center justify-center gap-2">
                      <span className="text-amber-500 text-lg">⭐</span>
                      <span className="font-medium">Prices are negotiable according to portfolio requirements and features</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="glass-card border-0 bg-gradient-primary/10">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">
                    Want a Portfolio Like This?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Get your own professional portfolio designed with AI-powered
                    tools and expert guidance.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
                      Start Building Now
                    </Button>
                    <Link to="/contact">
                      <Button variant="outline" className="glass-button">
                        Get Custom Portfolio
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SamplePortfolio;



