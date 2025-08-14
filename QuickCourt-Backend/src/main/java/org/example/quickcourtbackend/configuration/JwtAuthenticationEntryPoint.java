package org.example.quickcourtbackend.configuration;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String jsonResponse = """
            {
                "error": "Unauthorized",
                "message": "Authentication required to access this resource",
                "timestamp": "%s",
                "path": "%s"
            }
            """.formatted(Instant.now().toString(), request.getRequestURI());

        response.getWriter().write(jsonResponse);
    }
}