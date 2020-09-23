package com.ozaksoftware.CodeNames.service;

import com.ozaksoftware.CodeNames.DTO.mapper.GameMapper;
import com.ozaksoftware.CodeNames.DTO.model.CardDTO;
import com.ozaksoftware.CodeNames.DTO.model.GameDTO;
import com.ozaksoftware.CodeNames.domain.Card;
import com.ozaksoftware.CodeNames.domain.Game;
import com.ozaksoftware.CodeNames.domain.Player;
import com.ozaksoftware.CodeNames.enums.CardColor;
import com.ozaksoftware.CodeNames.enums.GameStatus;
import com.ozaksoftware.CodeNames.enums.PlayerType;
import com.ozaksoftware.CodeNames.enums.Team;
import com.ozaksoftware.CodeNames.repository.GameRepository;
import com.ozaksoftware.CodeNames.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

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

    /***Helper Methods***/
    private GameDTO setDTOCardsHidden(GameDTO gameDTO) {
        List<CardDTO> cardList = gameDTO.getCards();
        cardList.stream().forEach(cardDTO -> cardDTO.setCardColor(CardColor.HIDDEN));
        gameDTO.setCards(cardList);
        return gameDTO;
    }

    private GameDTO setDTOTeams(GameDTO gameDTO) {
        Map<String, List<Player>> redTeam = new HashMap<>();
        Map<String, List<Player>> blueTeam = new HashMap<>();
        List<Player> playerList = gameDTO.getPlayers();
        List<Player> redTeamOperativeList = new ArrayList<>();
        List<Player> blueTeamOperativeList = new ArrayList<>();
        List<Player> redTeamSpymasterList = new ArrayList<>();
        List<Player> blueTeamSpymasterList = new ArrayList<>();

        for(Player player : playerList) {
            if(player.getTeam() == Team.RED) {
                if(player.getPlayerType() == PlayerType.OPERATIVE) {
                    redTeamOperativeList.add(player);
                } else if (player.getPlayerType() == PlayerType.SPYMASTER) {
                    redTeamSpymasterList.add(player);
                }
            } else if(player.getTeam() == Team.BLUE){
                if(player.getPlayerType() == PlayerType.OPERATIVE) {
                    blueTeamOperativeList.add(player);
                } else if (player.getPlayerType() == PlayerType.SPYMASTER) {
                    blueTeamSpymasterList.add(player);
                }
            }
        }
        redTeam.put("operatives", redTeamOperativeList);
        redTeam.put("spymasters", redTeamSpymasterList);
        blueTeam.put("operatives", blueTeamOperativeList);
        blueTeam.put("spymasters", blueTeamSpymasterList);

        gameDTO.setRedTeam(redTeam);
        gameDTO.setBlueTeam(blueTeam);

        return gameDTO;
    }

    private GameDTO setDTOCardsRemaining(GameDTO gameDTO) {
        /*it should be called before hiding the cards*/
        List<CardDTO> cardList = gameDTO.getCards();
        for(CardDTO cardDTO : cardList) {
            if(cardDTO.getCardColor() == CardColor.RED) {
                gameDTO.setRedCardsLeft(gameDTO.getRedCardsLeft() + 1);
            } else if(cardDTO.getCardColor() == CardColor.BLUE) {
                gameDTO.setBlueCardsLeft(gameDTO.getBlueCardsLeft() + 1);
            }
        }
        return gameDTO;
    }

    private GameDTO createDTO(Game game) {
        GameDTO gameDTO = GameMapper.toGameDTO(game);

        gameDTO = setDTOTeams(gameDTO);

        gameDTO = setDTOCardsRemaining(gameDTO);

        gameDTO = setDTOCardsHidden(gameDTO);

        return gameDTO;
    }


    /***Controller Methods***/
    public GameDTO createNewGame(GameDTO gameDTO,Integer ownerId) {
        if(gameDTO == null || gameDTO.getGameName() == null || gameDTO.getGameName() == "") {
            return null;
        }

        //Initializing game data
        Game newGame = new Game();
        newGame.setGameName(gameDTO.getGameName());
        newGame.setGameStatus(GameStatus.WAITS_FOR_PLAYER);

        //Initializing owner
        Player owner = playerRepository.findOneById(ownerId);
        if(owner==null) return null;
        newGame.setOwner(owner);
        List<Player> players = new ArrayList<>();
        players.add(owner);
        newGame.setPlayers(players);
        newGame.setCards(cardService.generateCards());
        gameRepository.save(newGame);

        return createDTO(newGame);
    }

    public GameDTO resetGame(GameDTO gameDTO,Integer ownerId) {
        if(gameDTO == null) {
            return null;
        }

        Game game = gameRepository.findOneById(gameDTO.getId());
        if(game == null || game.getGameName() == null || game.getOwner() == null ||
                game.getOwner().getId() != ownerId)  {
            return null;
        }
        List<Player> updatedPlayers = new ArrayList<>();
        game.getPlayers().stream().forEach(player -> {
            Player updatedPlayer = playerRepository.findOneById(player.getId());
            updatedPlayer.setTeam(Team.SPECTATOR);
            updatedPlayer.setPlayerType(PlayerType.SPECTATOR);
            playerRepository.save(updatedPlayer);
            updatedPlayers.add(updatedPlayer);
        });
        game.setPlayers(updatedPlayers);
        game.setCards(cardService.generateCards());
        game.setGameStatus(GameStatus.IN_PROGRESS);

        gameRepository.save(game);

        return createDTO(game);
    }

    public GameDTO getGame(int gameId, int playerId) {
        Game game = gameRepository.findOneById(gameId);
        Player player = playerRepository.findOneById(playerId);
        if(game == null || player  == null) return null;

        //Adding player to the game if the player is not in the game.
        if(!game.getPlayers().stream().anyMatch(pl -> Objects.equals(pl.getId(), playerId))) {
            List<Player> playerList = game.getPlayers();
            playerList.add(player);
            game.setPlayers(playerList);
        }
        GameDTO gameDTO = GameMapper.toGameDTO(game);

        //Putting each player into teams.
        gameDTO = setDTOTeams(gameDTO);

        //Calculating the remaining cards for each team.
        gameDTO = setDTOCardsRemaining(gameDTO);

        //Mapping each card color to hidden if the player who sent the request is not the spymaster.
        if(player.getPlayerType() != PlayerType.SPYMASTER) gameDTO = setDTOCardsHidden(gameDTO);

        return gameDTO;
    }

    public List<GameDTO> listGameDTOs() {
        List<Game> games = (List<Game>) gameRepository.findAll();
        return GameMapper.toGameDTOList(games);
    }

    public GameDTO checkGame(int playerId, int gameId) {
        Game game = gameRepository.findOneById(gameId);
        if(game == null) return null;
        if(game.getPlayers().stream().anyMatch(pl -> Objects.equals(pl.getId(), playerId))) {
            Player player = playerRepository.findOneById(playerId);
            GameDTO gameDTO = GameMapper.toGameDTO(game);

            //Putting each player into teams.
            gameDTO = setDTOTeams(gameDTO);

            //Calculating the remaining cards for each team.
            gameDTO = setDTOCardsRemaining(gameDTO);

            //Mapping each card color to hidden if the player who sent the request is not the spymaster.
            if(player.getPlayerType() != PlayerType.SPYMASTER) gameDTO = setDTOCardsHidden(gameDTO);

            return gameDTO;
        }
        return null;
    }

    public GameDTO changePlayerType(GameDTO gameDTO, Integer playerId, PlayerType playerType, Team team) {
        Game game = gameRepository.findOneById(gameDTO.getId());
        if(game == null) return null;
        if(!game.getPlayers().stream().anyMatch(pl -> Objects.equals(pl.getId(), playerId))) return null;
        Player player = playerRepository.findOneById(playerId);
        if(player == null) return null;
        player.setPlayerType(playerType);
        player.setTeam(team);
        playerRepository.save(player);
        game = gameRepository.findOneById(gameDTO.getId());
        GameDTO updatedGameDTO = GameMapper.toGameDTO(game);
        //Putting each player into teams.
        updatedGameDTO = setDTOTeams(updatedGameDTO);

        //Calculating the remaining cards for each team.
        updatedGameDTO = setDTOCardsRemaining(updatedGameDTO);

        //Mapping each card color to hidden if the player who sent the request is not the spymaster.
        if(player.getPlayerType() != PlayerType.SPYMASTER) updatedGameDTO = setDTOCardsHidden(updatedGameDTO);
        return updatedGameDTO;
    }

}
