package com.ibm.skillsbuild.Model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Duration;
import java.util.Objects;

@Embeddable
public final class CourseDuration implements Serializable, Comparable<CourseDuration> {

    private static final long serialVersionUID = 1L;

    @Column(name = "expected_duration_minutes", nullable = false)
    private long minutes;

    protected CourseDuration() {
        this.minutes = 0L;
    }

    private CourseDuration(long minutes) {
        this.minutes = minutes;
    }

    public static CourseDuration zero() {
        return new CourseDuration(0L);
    }

    public static CourseDuration ofMinutes(long minutes) {
        return new CourseDuration(minutes);
    }

    public static CourseDuration ofHours(long hours) {
        return new CourseDuration(hours * 60L);
    }

    public static CourseDuration of(long hours, long minutes) {
        return new CourseDuration(hours * 60L + minutes);
    }

    @JsonCreator
    public static CourseDuration fromString(String isoOrMinutes) {
        if (isoOrMinutes == null) return CourseDuration.zero();
        String s = isoOrMinutes.trim();
        try {
            long m = Long.parseLong(s);
            return CourseDuration.ofMinutes(m);
        } catch (NumberFormatException ignored) { }
        try {
            Duration d = Duration.parse(s);
            return CourseDuration.ofMinutes(d.toMinutes());
        } catch (Exception ignored) { }
        return CourseDuration.zero();
    }

    public long getMinutes() {
        return minutes;
    }

    @JsonValue
    public String toJsonValue() {
        return toHmsString();
    }

    public Duration toDuration() {
        return Duration.ofMinutes(minutes);
    }

    public long toHours() {
        return minutes / 60L;
    }

    public int getHoursPart() {
        return (int) (minutes / 60L);
    }

    public int getMinutesPart() {
        return (int) (minutes % 60L);
    }

    public boolean isZero() {
        return minutes == 0L;
    }

    public CourseDuration plusMinutes(long add) {
        return new CourseDuration(this.minutes + add);
    }

    public CourseDuration plusHours(long addHours) {
        return plusMinutes(addHours * 60L);
    }

    public CourseDuration minusMinutes(long sub) {
        return new CourseDuration(this.minutes - sub);
    }

    public String toHmsString() {
        long h = toHours();
        int m = getMinutesPart();
        return String.format("%d:%02d", h, m);
    }

    public String toIsoString() {
        return Duration.ofMinutes(minutes).toString();
    }

    @Override
    public String toString() {
        return "CourseDuration{" + toHmsString() + " / " + minutes + "m}";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CourseDuration)) return false;
        CourseDuration that = (CourseDuration) o;
        return minutes == that.minutes;
    }

    @Override
    public int hashCode() {
        return Objects.hash(minutes);
    }

    @Override
    public int compareTo(CourseDuration o) {
        return Long.compare(this.minutes, o.minutes);
    }
}