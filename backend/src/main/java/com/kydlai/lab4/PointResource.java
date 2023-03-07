package com.kydlai.lab4;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.Instant;
import java.util.List;

@Path("/points")
public class PointResource {
    @Inject
    private UserRepository userRepository;
    @Inject
    private PointRepository pointRepository;

    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Point addPoint(@HeaderParam("Authorization") String authorization,
                          @FormParam("x") double x, @FormParam("y") double y, @FormParam("r") double r) {
        var startTime = System.nanoTime();
        var user = userRepository.checkCredentials(authorization);
        var point = new Point(x, y, r);
        point.checkHit();
        point.setOwner(user);
        point.setCreationTime(Instant.now().getEpochSecond());
        point.setProcessingTime(System.nanoTime() - startTime);
        pointRepository.addPoint(point);
        return point;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Point> getPoints(@HeaderParam("Authorization") String authorization) {
        var user = userRepository.checkCredentials(authorization);
        return pointRepository.getPointsByOwner(user);
    }

    @DELETE
    public void deletePoints(@HeaderParam("Authorization") String authorization) {
        var user = userRepository.checkCredentials(authorization);
        pointRepository.deletePointsByOwner(user);
    }
}
