package com.ibm.skillsbuild.Config;

import com.ibm.skillsbuild.Model.Category;
import com.ibm.skillsbuild.Model.Course;
import com.ibm.skillsbuild.Model.CourseDuration;
import com.ibm.skillsbuild.Model.Difficulty;
import com.ibm.skillsbuild.Repository.CategoryRepository;
import com.ibm.skillsbuild.Repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements ApplicationRunner {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (courseRepository.count() > 0) return; // skip if DB already has courses

        // ── Create Categories ──────────────────────────────────────────
        Category ai       = getOrCreateCategory("Artificial Intelligence", "AI and Machine Learning courses", "#4f46e5");
        Category capstone = getOrCreateCategory("Capstone",                "Capstone project courses",         "#f59e0b");
        Category data     = getOrCreateCategory("Data Science",            "Data and analytics courses",       "#10b981");
        Category automat  = getOrCreateCategory("IBM Automation",          "IBM RPA and automation courses",   "#6366f1");
        Category cyber    = getOrCreateCategory("CyberSecurity",           "Security and threat courses",      "#ef4444");
        Category ibmz     = getOrCreateCategory("IBM Z",                   "IBM Z mainframe courses",          "#8b5cf6");
        Category quantum  = getOrCreateCategory("Quantum Computing",       "Quantum information courses",      "#0ea5e9");
        Category redhat   = getOrCreateCategory("Red Hat Academy",         "Red Hat Linux and Java courses",   "#dc2626");
        Category cloud    = getOrCreateCategory("Cloud",                   "Cloud computing courses",          "#0284c7");

        // ── Artificial Intelligence ────────────────────────────────────
        saveCourse("Getting started with Artificial Intelligence",
                "https://skills.yourlearning.ibm.com/activity/PLAN-E624C2604060?ngo-id=0302",
                "Covers history of AI, structured/unstructured data, machine learning, LLMs, transformers, generative AI, and effective prompting.",
                Difficulty.BEGINNER, 4, ai, 100, 50);

        saveCourse("Artificial Intelligence Fundamentals",
                "https://skills.yourlearning.ibm.com/activity/PLAN-7913EE1DB030?ngo-id=0302",
                "Covers AI history, machine learning, how AI understands language and images, neural networks, generative AI, and IBM Watson Studio.",
                Difficulty.BEGINNER, 6, ai, 150, 75);

        saveCourse("Foundations of Sustainability and Technology",
                "https://skills.yourlearning.ibm.com/activity/PLAN-BE0E24A0BA5C?ngo-id=0302",
                "Covers sustainability, ESG pillars, data analytics for sustainability, AI and hybrid cloud sustainability applications.",
                Difficulty.BEGINNER, 5, ai, 120, 60);

        saveCourse("Building AI Solutions Using Advanced Algorithms and Open Source Frameworks",
                "https://skills.yourlearning.ibm.com/activity/PLAN-3C28E1067B08?ngo-id=0302",
                "Covers internal building blocks of AI solutions, algorithms, neural network structures, and open source frameworks.",
                Difficulty.INTERMEDIATE, 8, ai, 200, 100);

        // ── Capstone ───────────────────────────────────────────────────
        saveCourse("Getting started with Threat Intelligence and Hunting",
                "https://skills.yourlearning.ibm.com/activity/PLAN-D5ED0773935F?ngo-id=0302",
                "Covers cybersecurity hardening practices, roles, technologies, and processes security teams use to tackle real-world cyber-attacks.",
                Difficulty.INTERMEDIATE, 6, capstone, 150, 75);

        saveCourse("Getting started with Data",
                "https://skills.yourlearning.ibm.com/activity/PLAN-14F2691E3A32?ngo-id=0302",
                "Covers importance of data, data types, five V's of big data, data analytics, data visualization, and Tableau Desktop.",
                Difficulty.BEGINNER, 4, capstone, 100, 50);

        saveCourse("Getting started with CyberSecurity",
                "https://skills.yourlearning.ibm.com/activity/PLAN-14F2691E3A32?ngo-id=0302",
                "Introduction to cybersecurity concepts, data types, analytics processes, visualization tools, and data science roles.",
                Difficulty.BEGINNER, 4, capstone, 100, 50);

        // ── Data Science ───────────────────────────────────────────────
        saveCourse("Enterprise Data Science in Practice",
                "https://skills.yourlearning.ibm.com/activity/PLAN-0D62D9A52C35?ngo-id=0302",
                "Assists individuals in gaining better positioning in the job marketplace through skills in Data Science.",
                Difficulty.INTERMEDIATE, 8, data, 200, 100);

        saveCourse("Machine Learning for Data Science Projects",
                "https://skills.yourlearning.ibm.com/activity/PLAN-D8E7C82C1D76?ngo-id=0302",
                "Assists individuals in gaining better positioning in the job marketplace through skills in Data Science and machine learning.",
                Difficulty.INTERMEDIATE, 8, data, 200, 100);

        saveCourse("Data Fundamentals",
                "https://skills.yourlearning.ibm.com/activity/PLAN-BC0FAEE8E439?ngo-id=0302",
                "Covers fundamental data concepts, data science methodologies, industry applications, analyst/scientist/engineer roles, and IBM Watson Studio.",
                Difficulty.BEGINNER, 5, data, 120, 60);

        // ── IBM Automation ─────────────────────────────────────────────
        saveCourse("IBM Robotic Process Automation Basic I",
                "https://learn.ibm.com/course/view.php?id=8373",
                "Covers basic functions of IBM RPA, IBM RPA Studio, script publishing, variables, files, texts, arrays, and conditional structures.",
                Difficulty.BEGINNER, 5, automat, 120, 60);

        saveCourse("IBM Robotic Process Automation Basic II",
                "https://learn.ibm.com/course/view.php?id=8382",
                "Covers assets, parameters, PDF manipulation, data tables, and databases with IBM RPA Studio.",
                Difficulty.INTERMEDIATE, 5, automat, 150, 75);

        // ── CyberSecurity ──────────────────────────────────────────────
        saveCourse("CyberSecurity Fundamentals",
                "https://skills.yourlearning.ibm.com/activity/PLAN-4FB8400F05FC?ngo-id=0302",
                "Assists individuals in gaining better positioning in the job marketplace through skills in CyberSecurity.",
                Difficulty.BEGINNER, 6, cyber, 150, 75);

        saveCourse("Enterprise Security in Practice",
                "https://skills.yourlearning.ibm.com/activity/PLAN-BBCABF0CF5B0?ngo-id=0302",
                "Covers cybersecurity challenges faced by the enterprise, security practices, and tools available in the market.",
                Difficulty.INTERMEDIATE, 8, cyber, 200, 100);

        // ── IBM Z ──────────────────────────────────────────────────────
        saveCourse("z/OS Introduction",
                "https://www.redbooks.ibm.com/abstracts/crse0304.html",
                "Introduces IBM Z hardware and operating systems, focuses on z/OS, and outlines z/OS documentation sources.",
                Difficulty.BEGINNER, 4, ibmz, 100, 50);

        saveCourse("IBM Z System Administrator",
                "https://www.ibm.com/training/learning-path/ibm-z-system-administrator-306",
                "Build knowledge and skills in IBM Z, a platform used in the world's most critical businesses.",
                Difficulty.INTERMEDIATE, 10, ibmz, 250, 125);

        // ── Quantum Computing ──────────────────────────────────────────
        saveCourse("Basics of Quantum Information",
                "https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information",
                "Covers mathematics of quantum information, single and multiple quantum systems, and quantum circuits.",
                Difficulty.INTERMEDIATE, 8, quantum, 200, 100);

        // ── Red Hat Academy ────────────────────────────────────────────
        saveCourse("Red Hat System Administration",
                "https://www.redhat.com/en/services/training/rh124-red-hat-system-administration-i",
                "Designed for IT professionals without previous Linux experience. Covers core administration tasks and key command-line concepts.",
                Difficulty.BEGINNER, 10, redhat, 200, 100);

        saveCourse("Red Hat Application Development I: Programming in Java EE",
                "https://www.redhat.com/en/services/training/ad183-red-hat-application-development-i-programming-java-ee",
                "Covers Java EE specifications including EJB, JPA, JMS, JAX-RS, CDI, and JAAS through hands-on labs.",
                Difficulty.ADVANCED, 12, redhat, 300, 150);

        // ── Cloud ──────────────────────────────────────────────────────
        saveCourse("Cloud Computing Fundamentals",
                "https://skills.yourlearning.ibm.com/activity/PLAN-2EC3A305F2C3?ngo-id=0302",
                "Covers cloud computing characteristics, service models, deployment models, containers, microservices, Docker, cloud security, and IAM.",
                Difficulty.BEGINNER, 6, cloud, 150, 75);

        System.out.println("✅ DataLoader: All courses and categories seeded successfully.");
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private Category getOrCreateCategory(String name, String description, String color) {
        return categoryRepository.findByCategoryName(name)
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setCategoryName(name);
                    c.setCategoryDescription(description);
                    c.setDisplayColor(color);
                    return categoryRepository.save(c);
                });
    }

    private void saveCourse(String title, String url, String description,
                            Difficulty difficulty, int hours,
                            Category category, int xp, int score) {
        Course course = new Course();
        course.setCourseTitle(title);
        course.setUrl(url);
        course.setDescription(description);
        course.setDifficulty(difficulty);
        course.setDuration(CourseDuration.ofHours(hours));
        course.setCourseCategory(category);
        course.setXpReward(xp);
        course.setScoreReward(score);
        course.setTotalEnrollments(0);
        course.setTotalCompleted(0);
        courseRepository.save(course);
    }
}