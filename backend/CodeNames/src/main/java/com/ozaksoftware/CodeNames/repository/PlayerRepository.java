package com.ozaksoftware.CodeNames.repository;
import com.ozaksoftware.CodeNames.domain.Player;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerRepository extends CrudRepository<Player, Long> {
    Player findOneById(int id);
}

