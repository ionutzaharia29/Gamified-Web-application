package com.ibm.skillsbuild.Service;

import com.ibm.skillsbuild.Model.Course;
import com.ibm.skillsbuild.Model.CourseDuration;
import com.ibm.skillsbuild.Model.CourseOverview;
import com.ibm.skillsbuild.Repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    private final List<CourseOverview> courses = new ArrayList<>();

    @PostConstruct
    public void initCourses() {
        courses.add(new CourseOverview(
                "ai-getting-started",
                "Artificial Intelligence",
                "Getting started with Artificial Intelligence",
                "https://skills.yourlearning.ibm.com/activity/PLAN-E624C2604060?ngo-id=0302",
                """
                What you'll learn
                After completing Getting Started with AI, you should be able to:
                -Describe the history of AI development
                -Define and describe structured, unstructured, and semi-structured data
                -Explain machine learning and how AI makes predictions from data
                -Describe three ways that AI analyzes data
                -Define large language models (LLMs)
                -Identify key LLM concepts such as transformers
                -Describe common applications of large language models
                -Explain generative AI and its impact in today's world
                -Identify rules for writing effective prompts
                -Create a playlist using a generative AI model
                """,
                CourseDuration.ofHours(5)
        ));

        courses.add(new CourseOverview(
                "ai-fundamentals",
                "Artificial Intelligence",
                "Artificial Intelligence Fundamentals",
                "https://skills.yourlearning.ibm.com/activity/PLAN-7913EE1DB030?ngo-id=0302",
                """
                After completing Artificial Intelligence Fundamentals, you should be able to:
                -Describe the history of AI development
                -Define and describe structured, unstructured, and semi-structured data, machine learning, and ways that AI makes predictions from data
                -Explain how AI understands human language
                -Explain how AI analyzes and creates images
                -Describe three ways that AI analyzes data
                -Describe how AI makes predictions using neural networks
                -Explain generative AI and the impact in today's world
                -Create an AI machine learning model using IBM Watson Studio
                -Describe ways that AI systems can be designed to minimize bias
                """,
                CourseDuration.ofHours(8)
        ));

        courses.add(new CourseOverview(
                "sustainability-foundations",
                "Artificial Intelligence",
                "Foundations of Sustainability and Technology",
                "https://skills.yourlearning.ibm.com/activity/PLAN-BE0E24A0BA5C?ngo-id=0302",
                """
                After completing the courses required for the Fundamentals of Sustainability and Technology credential, you should be able to:
                -Define sustainability
                -Identify ways that sustainability updates and extends the concept of conservation
                -Define the environmental, social, and governance (ESG) pillars
                -Explain how data analytics helps organizations identify and measure sustainability issues
                -Describe key sustainability applications of artificial intelligence and hybrid cloud
                """,
                CourseDuration.ofHours(4)
        ));

        courses.add(new CourseOverview(
                "ai-advanced-algorithms",
                "Artificial Intelligence",
                "Building AI Solutions Using Advanced Algorithms and Open Source Frameworks",
                "https://skills.yourlearning.ibm.com/activity/PLAN-3C28E1067B08?ngo-id=0302",
                "This course assists individuals in understanding the internal building blocks of an AI solution, focused on algorithms, neural network structures, and open source frameworks.",
                CourseDuration.ofHours(10)
        ));

        courses.add(new CourseOverview(
                "threat-intelligence",
                "Capstone",
                "Getting started with Threat Intelligence and Hunting",
                "https://skills.yourlearning.ibm.com/activity/PLAN-D5ED0773935F?ngo-id=0302",
                "This course assists individuals with an active interest in understanding cybersecurity hardening practices within the enterprise.",
                CourseDuration.ofHours(8)
        ));

        courses.add(new CourseOverview(
                "data-getting-started",
                "Capstone",
                "Getting started with Data",
                "https://skills.yourlearning.ibm.com/activity/PLAN-14F2691E3A32?ngo-id=0302",
                """
                After completing Getting Started with Data, you should be able to:
                -Explain the importance of data in a digital world
                -Differentiate between different data types
                -Describe the five V's of big data
                -Explain the types and processes for data analytics
                -Explore data visualization and various charts used for it
                """,
                CourseDuration.ofHours(5)
        ));

        courses.add(new CourseOverview(
                "cybersecurity-getting-started",
                "Capstone",
                "Getting started with CyberSecurity",
                "https://skills.yourlearning.ibm.com/activity/PLAN-14F2691E3A32?ngo-id=0302",
                "Introduction to cybersecurity concepts, data types, analytics, and visualization tools.",
                CourseDuration.ofHours(5)
        ));

        courses.add(new CourseOverview(
                "enterprise-data-science",
                "Data Science",
                "Enterprise Data Science in Practice",
                "https://skills.yourlearning.ibm.com/activity/PLAN-0D62D9A52C35?ngo-id=0302",
                "This course assists individuals with gaining better positioning in the job marketplace through skills in Data Science.",
                CourseDuration.ofHours(12)
        ));

        courses.add(new CourseOverview(
                "ml-data-science",
                "Data Science",
                "Machine Learning for Data Science Projects",
                "https://skills.yourlearning.ibm.com/activity/PLAN-D8E7C82C1D76?ngo-id=0302",
                "This course assists individuals with gaining better positioning in the job marketplace through skills in Data Science.",
                CourseDuration.ofHours(12)
        ));

        courses.add(new CourseOverview(
                "data-fundamentals",
                "Data Science",
                "Data Fundamentals",
                "https://skills.yourlearning.ibm.com/activity/PLAN-BC0FAEE8E439?ngo-id=0302",
                """
                After completing Data Fundamentals, you should be able to:
                -Describe fundamental data concepts including types of data, big data, analytics techniques
                -Identify widely adopted data science methodologies
                -Identify applications of data science across industries
                -Describe the role of a data analyst, data scientist, and data engineer
                -Clean, refine, and visualize data using IBM Watson Studio
                """,
                CourseDuration.ofHours(8)
        ));

        courses.add(new CourseOverview(
                "ibm-rpa-basic-1",
                "IBM Automation",
                "IBM Robotic Process Automation Basic I",
                "https://learn.ibm.com/course/view.php?id=8373",
                """
                After completing this course, you should be able to:
                -Use the basic functions of IBM Robotic Process Automation
                -Manipulate key functionality available in IBM RPA Studio
                -Publish scripts through IBM RPA Studio
                -Manipulate variables, files, texts, and arrays
                -Work with conditional structures and routines
                """,
                CourseDuration.ofHours(6)
        ));

        courses.add(new CourseOverview(
                "ibm-rpa-basic-2",
                "IBM Automation",
                "IBM Robotic Process Automation Basic II",
                "https://learn.ibm.com/course/view.php?id=8382",
                """
                After completing this course, you should be able to:
                -Define and use assets and parameters
                -Manipulate PDFs with the tools available in IBM RPA Studio
                -Manipulate data table and databases with IBM RPA Studio
                """,
                CourseDuration.ofHours(6)
        ));

        courses.add(new CourseOverview(
                "cybersecurity-fundamentals",
                "CyberSecurity",
                "CyberSecurity Fundamentals",
                "https://skills.yourlearning.ibm.com/activity/PLAN-4FB8400F05FC?ngo-id=0302",
                "This course assists individuals with gaining better positioning in the job marketplace through skills in CyberSecurity.",
                CourseDuration.ofHours(8)
        ));

        courses.add(new CourseOverview(
                "enterprise-security",
                "CyberSecurity",
                "Enterprise Security in Practice",
                "https://skills.yourlearning.ibm.com/activity/PLAN-BBCABF0CF5B0?ngo-id=0302",
                "This course assists individuals looking for jobs that benefit from an understanding of current cybersecurity challenges faced by the enterprise.",
                CourseDuration.ofHours(10)
        ));

        courses.add(new CourseOverview(
                "zos-introduction",
                "IBM Z",
                "z/OS Introduction",
                "https://www.redbooks.ibm.com/abstracts/crse0304.html",
                "This section introduces IBM Z hardware and operating systems, focuses on the flagship IBM Z operating system z/OS, and outlines z/OS documentation sources.",
                CourseDuration.ofHours(8)
        ));

        courses.add(new CourseOverview(
                "ibm-z-sysadmin",
                "IBM Z",
                "IBM Z System Administrator",
                "https://www.ibm.com/training/learning-path/ibm-z-system-administrator-306",
                "Build knowledge and skills in IBM Z, a platform used in the world's most critical businesses.",
                CourseDuration.ofHours(12)
        ));

        courses.add(new CourseOverview(
                "quantum-basics",
                "Quantum Computing",
                "Basics of Quantum Information",
                "https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information",
                """
                This course begins with an introduction to the mathematics of quantum information,
                including a description of quantum information for both single and multiple systems.
                It then moves on to quantum circuits, which provide a standard way to describe quantum computations.
                """,
                CourseDuration.ofHours(10)
        ));

        courses.add(new CourseOverview(
                "redhat-sysadmin",
                "Red Hat Academy",
                "Red Hat System Administration",
                "https://www.redhat.com/en/services/training/rh124-red-hat-system-administration-i",
                "Red Hat System Administration I is designed for IT professionals without previous Linux system administration experience, focusing on core administration tasks.",
                CourseDuration.ofHours(8)
        ));

        courses.add(new CourseOverview(
                "redhat-java-ee",
                "Red Hat Academy",
                "Red Hat Application Development I: Programming in Java EE",
                "https://www.redhat.com/en/services/training/ad183-red-hat-application-development-i-programming-java-ee",
                "In this course, you will learn about the various specifications that make up Java EE through hands-on labs, transforming a Java SE application into a multi-tiered enterprise application.",
                CourseDuration.ofHours(10)
        ));

        courses.add(new CourseOverview(
                "cloud-fundamentals",
                "Cloud",
                "Cloud Computing Fundamentals",
                "https://skills.yourlearning.ibm.com/activity/PLAN-2EC3A305F2C3?ngo-id=0302",
                """
                After completing Cloud Computing Fundamentals, you should be able to:
                -Define cloud computing and describe its characteristics
                -Identify characteristics of various cloud service models
                -Describe on-premises hosting, cloud migration plans, and cloud deployment models
                -Describe virtual resources, containers, microservices, and APIs in the cloud
                -Create, install an application, and test a Docker container
                -Build and deploy a Docker container to the cloud
                -Identify the importance of cloud security and IAM
                """,
                CourseDuration.ofHours(8)
        ));

        // Seed each course into the DB if it doesn't already exist
        for (CourseOverview overview : courses) {
            if (courseRepository.findByExternalId(overview.getId()).isEmpty()) {
                Course entity = new Course();
                entity.setExternalId(overview.getId());
                entity.setCourseTitle(overview.getTitle());
                entity.setUrl(overview.getUrl());
                entity.setDescription(overview.getNotes());
                entity.setDuration(overview.getDuration());
                courseRepository.save(entity);
            }
        }
    }

    public List<CourseOverview> findAll() {
        return Collections.unmodifiableList(courses);
    }

    public Optional<CourseOverview> findById(String id) {
        return courses.stream()
                .filter(c -> c.getId().equals(id))
                .findFirst();
    }

    public List<CourseOverview> searchByKeyword(String keyword) {
        String lower = keyword.toLowerCase();
        return courses.stream()
                .filter(c ->
                        c.getTitle().toLowerCase().contains(lower) ||
                                c.getCategory().toLowerCase().contains(lower) ||
                                (c.getNotes() != null && c.getNotes().toLowerCase().contains(lower))
                )
                .collect(Collectors.toList());
    }

    public void reload(List<CourseOverview> newCourses) {
        courses.clear();
        courses.addAll(newCourses);
    }
}
