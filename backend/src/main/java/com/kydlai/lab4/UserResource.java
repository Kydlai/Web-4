package com.kydlai.lab4;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("/user")
public class UserResource {
    @Inject
    private UserRepository userRepository;

    @POST
    @Path("/login")
    public void login(@HeaderParam("Authorization") String authorization) {
        userRepository.checkCredentials(authorization);
    }

    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void register(@FormParam("login") String login, @FormParam("password") String password) {
        userRepository.register(login, password);
    }
}
