import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Collapse, Box, Typography, Link, TableSortLabel
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { getAllCourses } from "../api/courses";

export default function CourseTable() {
    const [courses, setCourses] = useState([]);
    const [openRow, setOpenRow] = useState(null);
    const [order, setOrder] = useState("asc");

    useEffect(() => {
        getAllCourses().then(setCourses);
    }, []);

    const sortByTitle = () => {
        const sorted = [...courses].sort((a, b) =>
            order === "asc"
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title)
        );
        setCourses(sorted);
        setOrder(order === "asc" ? "desc" : "asc");
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>
                            <TableSortLabel
                                active
                                direction={order}
                                onClick={sortByTitle}
                            >
                                Title
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Open</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {courses.map((course) => (
                        <>
                            <TableRow key={course.id}>
                                <TableCell>
                                    <IconButton onClick={() =>
                                        setOpenRow(openRow === course.id ? null : course.id)
                                    }>
                                        {openRow === course.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                </TableCell>

                                <TableCell>{course.title}</TableCell>
                                <TableCell>{course.category}</TableCell>

                                <TableCell>
                                    <Link
                                        href={course.url}
                                        target="_blank"
                                        rel="noopener"
                                        underline="hover"
                                    >
                                        Open Link
                                    </Link>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={4} sx={{ p: 0 }}>
                                    <Collapse in={openRow === course.id}>
                                        <Box sx={{ p: 2 }}>
                                            <Typography
                                                variant="body2"
                                                sx={{ mt: 2, whiteSpace: "pre-line" }}
                                            >
                                                <strong>Description:</strong>
                                                <br />
                                                {course.notes}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                <strong>URL:</strong>{" "}
                                                <Link href={course.url} target="_blank" rel="noopener">
                                                    {course.url}
                                                </Link>
                                            </Typography>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}