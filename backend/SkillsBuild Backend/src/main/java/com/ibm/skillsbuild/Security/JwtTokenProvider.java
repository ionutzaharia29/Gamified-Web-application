package com.ibm.skillsbuild.Security;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public String generateToken(String email) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + jwtExpiration);

        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder().setSubject(email).setIssuedAt(now).setExpiration(expirationDate).signWith(key, SignatureAlgorithm.HS256).compact();
    }

    public String getEmailFromToken(String token){
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }
    public boolean validateToken(String token) {
        try {
            Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

            Jwts.parser().setSigningKey(key).build().parseClaimsJws(token);

            return true;

        }catch (SecurityException | MalformedJwtException e){
            System.out.println("Invalid JWT Token: " + e.getMessage());

        }catch (ExpiredJwtException e){
            System.out.println("Expired JWT Token: " + e.getMessage());
        }catch (UnsupportedJwtException e){
            System.out.println("Unsupported JWT Token: " + e.getMessage());

        }catch (IllegalArgumentException e){
            System.out.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }
}
