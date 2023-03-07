package com.kydlai.lab4;

import jakarta.ejb.LocalBean;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.ws.rs.WebApplicationException;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import static jakarta.ws.rs.core.Response.Status.*;

@Stateless
@LocalBean
public class UserRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public void addUser(User user) {
        entityManager.persist(user);
    }

    public User getUser(String login) {
        return entityManager.find(User.class, login);
    }

    public void register(String login, String password) {
        if (login == null || password == null || login.length() < 1 || password.length() < 1)
            throw new WebApplicationException(BAD_REQUEST);
        if (getUser(login) != null)
            throw new WebApplicationException(CONFLICT);
        var user = new User(login, getHash(password));
        addUser(user);
    }

    public User checkCredentials(String authorization) {
        if (authorization == null || !authorization.startsWith("Basic"))
            throw new WebApplicationException(BAD_REQUEST);

        String login, password;

        try {
            var base64 = authorization.substring(6).replaceAll("=", "");
            var credentials = new String(Base64.getDecoder().decode(base64)).split(":", 2);
            if (credentials.length < 2)
                throw new WebApplicationException(BAD_REQUEST);
            login = credentials[0];
            password = credentials[1];
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(BAD_REQUEST);
        }

        var user = getUser(login);
        if (user == null)
            throw new WebApplicationException(UNAUTHORIZED);

        if (!getHash(password).equals(user.getPasswordHash()))
            throw new WebApplicationException(UNAUTHORIZED);

        return user;
    }

    private static String getHash(String data) {
        try {
            var digest = MessageDigest.getInstance("SHA-256");
            var hash = digest.digest(data.getBytes());

            var hexBuilder = new StringBuilder();
            for (var b : hash) {
                var hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1)
                    hexBuilder.append('0');
                hexBuilder.append(hex);
            }
            return hexBuilder.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
