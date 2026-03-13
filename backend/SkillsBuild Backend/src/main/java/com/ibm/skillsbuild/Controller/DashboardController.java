package com.ibm.skillsbuild.Controller;

import com.ibm.skillsbuild.dto.DashboardSummaryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(Principal principal) {
        String userEmail = (principal != null) ? principal.getName() : "Unknown User";

        // TODO: Later will use userEmail to query UserRepository and ProgressRepository

        DashboardSummaryResponse dummySummary = new DashboardSummaryResponse();
        dummySummary.setCurrentLevel(1);
        dummySummary.setTotalXp(0);
        dummySummary.setCoursesCompleted(0);
        dummySummary.setBadgesEarned(0);

        return ResponseEntity.ok(dummySummary);
    }


}