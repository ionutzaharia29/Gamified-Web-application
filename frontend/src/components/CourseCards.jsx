import { useEffect, useState } from "react";
import { getAllCourses } from "../api/courses";
import {
    Card, CardContent, Typography, Button, Grid, Link
} from "@mui/material";

export default function CourseCards() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        getAllCourses().then(setCourses);
    }, []);

    return (
        <Grid container spacing={2} sx={{ mt: 3 }}>
            {courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                    <Card variant="outlined" sx={{ p: 1 }}>
                        <CardContent>
                            <Typography variant="subtitle1">{course.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {course.category}
                            </Typography>

                            <Button
                                variant="contained"
                                size="small"
                                sx={{ mt: 1 }}
                                component={Link}
                                href={course.url}
                                target="_blank"
                            >
                                Open
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}