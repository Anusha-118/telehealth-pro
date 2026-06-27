# ============================================
# Stage 1: Build
# ============================================
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# ============================================
# Stage 2: Run
# ============================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S telehealth && adduser -S telehealth -G telehealth
USER telehealth

COPY --from=build /app/target/telehealth-pro-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
