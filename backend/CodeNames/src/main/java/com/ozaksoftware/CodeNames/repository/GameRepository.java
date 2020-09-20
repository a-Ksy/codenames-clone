package com.ozaksoftware.CodeNames.repository;
import com.ozaksoftware.CodeNames.domain.Game;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends CrudRepository<Game,Long> {
    Game findOneById(int id);
}
