package com.ibm.skillsbuild.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100, unique = true)
    private String categoryName;

    @Column(length = 255)
    private String categoryDescription;

    @Column(length = 100, name = "icon_url")
    private String iconUrl;

    @Column(length = 7)
    private String displayColor;

    @OneToMany(mappedBy = "courseCategory" , cascade = CascadeType.ALL)
    private List<Course> coursesInCategory = new ArrayList<>();

}
