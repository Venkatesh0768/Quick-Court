FROM gradle:8.8-jdk21 AS build
WORKDIR /app


COPY build.gradle settings.gradle ./
COPY gradle gradle/


COPY src src/


RUN gradle clean build -x test


FROM openjdk:21-jdk-slim
WORKDIR /app


RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*


COPY --from=build /app/build/libs/*.jar app.jar


EXPOSE 8080


HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1


ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]