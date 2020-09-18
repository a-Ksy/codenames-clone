package com.ozaksoftware.CodeNames.repository;

import com.ozaksoftware.CodeNames.domain.Card;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CardRepository extends CrudRepository<Card, Long> {
    Card findOneById(int id);
}
