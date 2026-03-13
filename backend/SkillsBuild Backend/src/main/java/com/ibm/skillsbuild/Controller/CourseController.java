package com.ibm.skillsbuild.Controller;

import com.ibm.skillsbuild.Model.CourseOverview;
import com.ibm.skillsbuild.Service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @GetMapping
    public List<CourseOverview> all() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseOverview> get(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<CourseOverview> search(@RequestParam String keyword) {
        return service.searchByKeyword(keyword);
    }

    @PostMapping("/reload")
    public ResponseEntity<Void> reload(@RequestBody List<CourseOverview> newCourses) {
        service.reload(newCourses);
        return ResponseEntity.ok().build();
    }
}