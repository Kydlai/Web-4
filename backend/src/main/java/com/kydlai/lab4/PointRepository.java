package com.kydlai.lab4;

import jakarta.ejb.LocalBean;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@Stateless
@LocalBean
public class PointRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public void addPoint(Point point) {
        point.setId(null);
        entityManager.persist(point);
    }

    public List<Point> getPointsByOwner(User owner) {
        var cb = entityManager.getCriteriaBuilder();
        var query = cb.createQuery(Point.class);
        var root = query.from(Point.class);
        query.select(root)
                .where(cb.equal(root.get("owner"), owner))
                .orderBy(cb.desc(root.get("creationTime")));
        return entityManager.createQuery(query).getResultList();
    }

    public void deletePointsByOwner(User owner) {
        var cb = entityManager.getCriteriaBuilder();
        var query = cb.createCriteriaDelete(Point.class);
        var root = query.from(Point.class);
        query.where(cb.equal(root.get("owner"), owner));
        entityManager.createQuery(query).executeUpdate();
    }
}
