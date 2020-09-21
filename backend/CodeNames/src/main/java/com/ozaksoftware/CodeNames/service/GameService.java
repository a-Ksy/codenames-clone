package com.ozaksoftware.CodeNames.service;

import com.ozaksoftware.CodeNames.DTO.mapper.GameMapper;
import com.ozaksoftware.CodeNames.DTO.model.GameDTO;
import com.ozaksoftware.CodeNames.domain.Game;
import com.ozaksoftware.CodeNames.domain.Player;
import com.ozaksoftware.CodeNames.enums.GameStatus;
import com.ozaksoftware.CodeNames.repository.GameRepository;
import com.ozaksoftware.CodeNames.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class GameService {
    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;

    @Autowired
    CardService cardService;

    @Autowired
    public GameService(GameRepository gameRepository, PlayerRepository playerRepository) {
        this.gameRepository = gameRepository;
        this.playerRepository = playerRepository;
    }

    public GameDTO createNewGame(GameDTO gameDTO,Integer ownerId) {
        if(gameDTO == null || gameDTO.getGameName() == null || gameDTO.getGameName() == "") {
            return null;
        }
        Game newGame = new Game();
        newGame.setGameName(gameDTO.getGameName());
        newGame.setGameStatus(GameStatus.WAITS_FOR_PLAYER);
        Player owner = playerRepository.findOneById(ownerId);
        if(owner==null){
            return null;
        }
        newGame.setOwner(owner);
        List<Player> players = new ArrayList<Player>();
        players.add(owner);
        newGame.setPlayers(players);
        newGame.setCards(cardService.generateCards());
        gameRepository.save(newGame);
        gameDTO.setId(newGame.getId());
        gameDTO.setOwner(owner);
        return gameDTO;
    }

    public Game getGame(int id) {
        return gameRepository.findOneById(id);
    }

    public List<GameDTO> listGameDTOs() {
        List<Game> games = (List<Game>) gameRepository.findAll();
        return GameMapper.toGameDTOList(games);
    }

    public GameDTO checkGame(int userId, int gameId) {
        Game game = gameRepository.findOneById(gameId);
        if(game == null) return null;
        if(game.getPlayers().stream().anyMatch(player -> player.getId() == userId)) {
            return GameMapper.toGameDTO(game);
        }
        return null;
    }
}
