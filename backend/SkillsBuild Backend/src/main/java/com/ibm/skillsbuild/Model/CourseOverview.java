package com.ibm.skillsbuild.Model;

public class CourseOverview {
    private String id;
    private String category;
    private String title;
    private String url;
    private String notes;
    private CourseDuration duration;

    public CourseOverview() {}

    public CourseOverview(String id, String category, String title, String url, String notes) {
        this.id = id; this.category = category; this.title = title; this.url = url; this.notes = notes;
    }

    public CourseOverview(String id, String category, String title, String url, String notes, CourseDuration duration) {
        this(id, category, title, url, notes);
        this.duration = duration;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public CourseDuration getDuration() { return duration; }
    public void setDuration(CourseDuration duration) { this.duration = duration; }
}

