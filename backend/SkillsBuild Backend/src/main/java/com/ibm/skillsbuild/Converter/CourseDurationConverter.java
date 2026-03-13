package com.ibm.skillsbuild.Converter;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.ibm.skillsbuild.Model.CourseDuration;

@Converter(autoApply = false)
public class CourseDurationConverter implements AttributeConverter<CourseDuration, Long> {

    @Override
    public Long convertToDatabaseColumn(CourseDuration attribute) {
        return attribute == null ? 0L : attribute.getMinutes();
    }

    @Override
    public CourseDuration convertToEntityAttribute(Long dbData) {
        return dbData == null ? CourseDuration.zero() : CourseDuration.ofMinutes(dbData);
    }
}

