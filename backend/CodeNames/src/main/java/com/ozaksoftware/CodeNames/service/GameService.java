package com.ozaksoftware.CodeNames.service;

import com.ozaksoftware.CodeNames.DTO.mapper.GameMapper;
import com.ozaksoftware.CodeNames.DTO.model.CardDTO;
import com.ozaksoftware.CodeNames.DTO.model.GameDTO;
import com.ozaksoftware.CodeNames.DTO.model.PlayerDTO;
import com.ozaksoftware.CodeNames.domain.Card;
import com.ozaksoftware.CodeNames.domain.Game;
import com.ozaksoftware.CodeNames.domain.Player;
import com.ozaksoftware.CodeNames.enums.*;
import com.ozaksoftware.CodeNames.repository.GameRepository;
import com.ozaksoftware.CodeNames.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@EnableScheduling
public class GameService {
    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;

    @Autowired
    CardService cardService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public GameService(GameRepository gameRepository, PlayerRepository playerRepository, SimpMessagingTemplate simpMessagingTemplate) {
        this.gameRepository = gameRepository;
        this.playerRepository = playerRepository;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    /***Controller Methods***/
    public GameDTO createNewGame(GameDTO gameDTO,Integer ownerId, String password ,String token) {
        if(gameDTO == null || gameDTO.getGameName() == null || gameDTO.getGameName() == "") {
            return null;
        }

        //Initializing game data
        Game newGame = new Game();
        newGame.setGameName(gameDTO.getGameName());
        newGame.setGameStatus(GameStatus.BLUE_TEAM_SPYMASTER_ROUND);
        if(password != null) {
            newGame.setPassword(password);
        }
        //Initializing owner
        Player owner = playerRepository.findOneById(ownerId);
        if(owner==null) return null;
        if(!isValidPlayer(owner,token)) {
            return null;
        }

        newGame.setOwner(owner);
        List<Player> players = new ArrayList<>();
        players.add(owner);
        newGame.setLogs(new ArrayList<>());
        newGame.setPlayers(players);
        newGame.setCards(cardService.generateCards());
        newGame.setClueWord("");
        newGame.setBlackListPlayers(new ArrayList<>());

        gameRepository.save(newGame);
        return createDTO(newGame, false);
    }

    public GameDTO resetGame(GameDTO gameDTO,Integer ownerId, String token) {
        Game game = gameRepository.findOneById(gameDTO.getId());
        Player owner = playerRepository.findOneById(ownerId);
        if(game == null || owner == null || game.getGameName() == null || game.getOwner() == null ||
                game.getOwner().getId() != ownerId)  {
            return null;
        }
        if(!isValidPlayer(owner, token)) {
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
        game.setGameStatus(GameStatus.BLUE_TEAM_SPYMASTER_ROUND);
        game.setLogs(new ArrayList<>());
        game = removeAllHighlightedCards(game);
        gameRepository.save(game);

        return createDTO(game, false);
    }

    public  List<GameDTO> leaveGame(GameDTO gameDTO, int playerId, String token){
        Game game = gameRepository.findOneById(gameDTO.getId());

        if(game == null || game.getGameName() == null)  {
            return null;
        }

        if(!game.getPlayers().stream().anyMatch(pl -> Objects.equals(pl.getId(), playerId))){
            return null;
        }
        Player leftPlayer = playerRepository.findOneById(playerId);
        if(!isValidPlayer(leftPlayer, token)) {
            return null;
        }
        leftPlayer.setPlayerType(PlayerType.SPECTATOR);
        leftPlayer.setTeam(Team.SPECTATOR);
        playerRepository.save(leftPlayer);

        List<Player> updatedPlayers = game.getPlayers().stream().filter(player ->
                player.getId() != playerId).collect(Collectors.toList());

        if(updatedPlayers.size() == 0){
            gameRepository.delete(game);
            return listGameDTOs();
        }
        game.setPlayers(updatedPlayers);
        if(game.getOwner().getId() == playerId){
            game.setOwner(game.getPlayers().get(0));
        }
        game = removeHighlightedCardsById(game, leftPlayer.getId());
        gameRepository.save(game);
        return listGameDTOs();
    }

    public GameDTO getGame(int gameId, int playerId, String password,String token) {
        Game game = gameRepository.findOneById(gameId);
        Player player = playerRepository.findOneById(playerId);
        if(game == null || player  == null) return null;

        if(!isValidPlayer(player, token)) {
            return null;
        }
        if(game.getPassword() != null) {
            if(!game.getPassword().equals(password)) {
                GameDTO errorGameDTO = new GameDTO();
                errorGameDTO.setGameName(ErrorMessage.INVALID_PASSWORD.toString());
                return errorGameDTO;
            }
        }

        if(game.getBlackListPlayers().contains(player)) {
            GameDTO errorGameDTO = new GameDTO();
            errorGameDTO.setGameName(ErrorMessage.KICKED_FROM_GAME.toString());
            return errorGameDTO;
        }

        if(!game.getPlayers().stream().anyMatch(pl -> Objects.equals(pl.getId(), playerId))) {
            List<Player> playerList = game.getPlayers();
            playerList.add(player);
            game.setPlayers(playerList);
        }

        return createDTO(game,player.getPlayerType() == PlayerType.SPYMASTER);
    }

    public GameDTO giveClue(GameDTO gameDTO, int playerId, String token) {
        Game game = gameRepository.findOneById(gameDTO.getId());
        Player player = playerRepository.findOneById(playerId);
        if(!isValidPlayer(player, token)) {
            return null;
        }
        if(game == null || player  == null || player.getPlayerType() != PlayerType.SPYMASTER) return null;

        if(!game.getPlayers().stream().anyMatch(pl -> Objects.equals(pl.getId(), playerId))) {
            return null;
        }
        if(!isTurnValid(player,game)) return null;
        game.setClueWord(gameDTO.getClueWord());
        game.setClueNumber(gameDTO.getClueNumber());
        game.addHintLog(player.getNickName(),player.getTeam(),gameDTO.getClueWord(),gameDTO.getClueNumber());

        if(Team.RED.equals(player.getTeam())){
            game.setGameStatus(GameStatus.RED_TEAM_OPERATIVE_ROUND);
        }
        else {
            game.setGameStatus(GameStatus.BLUE_TEAM_OPERATIVE_ROUND);
        }

        gameRepository.save(game);

        return createDTO(game,player.getPlayerType() == PlayerType.SPYMASTER);
    }

    public List<GameDTO> listGameDTOs() {
        List<Game> games = (List<Game>) gameRepository.findAll();
        List<GameDTO> gameDTOS = GameMapper.toGameDTOList(games);
        gameDTOS = gameDTOS.stream().map(game -> setDTOCardsHidden(game)).collect(Collectors.toList());
        return gameDTOS;
    }

    public GameDTO checkGame(int playerId, int gameId, String token) {
        Game game = gameRepository.findOneById(gameId);
        if(game == null) return null;
        if(game.getPlayers().stream().anyMatch(pl -> Objects.equals(pl.getId(), playerId))) {
            Player player = playerRepository.findOneById(playerId);
            if(!isValidPlayer(player, token)) {
                return null;
            }
            return createDTO(game,player.getPlayerType() == PlayerType.SPYMASTER);
        }
        return null;
    }

    public GameDTO changePlayerType(GameDTO gameDTO, Integer playerId, PlayerType playerType, Team team, String token) {
        Game game = gameRepository.findOneById(gameDTO.getId());
        if(game == null) return null;
        if(!game.getPlayers().stream().anyMatch(pl -> Objects.equals(pl.getId(), playerId))) return null;
        Player player = playerRepository.findOneById(playerId);
        if(player == null) return null;
        if(!isValidPlayer(player,token)) {
            return null;
        }
        if(PlayerType.SPYMASTER.equals(playerType)) {
            GameDTO tempGameDTO = GameMapper.toGameDTO(game);
            tempGameDTO = setDTOTeams(tempGameDTO);
            if(Team.RED.equals(team) && tempGameDTO.getRedTeam().get("spymasters").size() >= 1 ) return null;
            if(Team.BLUE.equals(team) && tempGameDTO.getBlueTeam().get("spymasters").size() >= 1) return null;
        }
        player.setPlayerType(playerType);
        player.setTeam(team);
        playerRepository.save(player);
        return createDTO(game,player.getPlayerType() == PlayerType.SPYMASTER);
    }

    public GameDTO kickPlayer(GameDTO gameDTO, int playerId, String token){

        Game game = gameRepository.findOneById(gameDTO.getId());

        if(game == null || game.getGameName() == null)  {
            return null;
        }

        if(!game.getPlayers().stream().anyMatch(pl -> Objects.equals(pl.getId(), playerId))){
            return null;
        }
        if(!isValidPlayer(game.getOwner(),token)) {
            return null;
        }
        Player leftPlayer = playerRepository.findOneById(playerId);
        List<Player> updatedBlackListPlayers = game.getBlackListPlayers();
        updatedBlackListPlayers.add(leftPlayer);
        game.setBlackListPlayers(updatedBlackListPlayers);
        leftPlayer.setPlayerType(PlayerType.SPECTATOR);
        leftPlayer.setTeam(Team.SPECTATOR);
        playerRepository.save(leftPlayer);

        List<Player> updatedPlayers = game.getPlayers().stream().filter(player ->
                player.getId() != playerId).collect(Collectors.toList());


        game = removeHighlightedCardsById(game, playerId);
        game.setPlayers(updatedPlayers);
        gameRepository.save(game);
        return createDTO(game,game.getOwner().getPlayerType() == PlayerType.SPYMASTER);
    }

    public GameDTO highlightCard(GameDTO gameDTO, int playerId, int cardId, String token){
        Game game = gameRepository.findOneById(gameDTO.getId());
        Player player = playerRepository.findOneById(playerId);

        if(game == null || game.getGameName() == null || player == null)  {
            return null;
        }

        if(!game.getPlayers().stream().anyMatch(pl -> Objects.equals(pl.getId(), playerId))){
            return null;
        }
        if(!isValidPlayer(player,token)) {
            return null;
        }
        if(!isTurnValid(player,game)) return null;

        Optional<Card> selectedCardOptional = game.getCards().stream().filter(card -> card.getId() == cardId).findFirst();

        if(!selectedCardOptional.isPresent()){
            return null;
        }
        Card selectedCard = selectedCardOptional.get();
        if(CardStatus.OPEN.equals(selectedCard.getCardStatus())) {
            return null;
        }

        game.setCards(game.getCards().stream().map(card -> {
            if(card.getId() == cardId){
                if(card.getHighlighters().containsKey(playerId)) {
                    card.removeHighlighter(playerId);
                } else {
                    card.addHighlighter(playerId,player.getNickName());
                }
            }
            return card;
        }).collect(Collectors.toList()));

        gameRepository.save(game);
        return createDTO(game,player.getPlayerType() == PlayerType.SPYMASTER);
    }

    public GameDTO endGuess(GameDTO gameDTO, int playerId, String token) {
        Game game = gameRepository.findOneById(gameDTO.getId());

        if(game == null || game.getGameName() == null)  {
            return null;
        }

        if(!game.getPlayers().stream().anyMatch(pl -> Objects.equals(pl.getId(), playerId))){
            return null;
        }

        Player player = playerRepository.findOneById(playerId);

        if(player == null && !isTurnValid(player,game)) {
            return null;
        }

        if(!isValidPlayer(player, token)) {
            return null;
        }
        
        if(Team.BLUE.equals(player.getTeam())) {
            game.setGameStatus(GameStatus.RED_TEAM_SPYMASTER_ROUND);
        }
        else if(Team.RED.equals(player.getTeam())){
            game.setGameStatus(GameStatus.BLUE_TEAM_SPYMASTER_ROUND);
        }

        game = removeAllHighlightedCards(game);
        gameRepository.save(game);
        return createDTO(game,player.getPlayerType() == PlayerType.SPYMASTER);
    }

    public GameDTO selectCard(GameDTO gameDTO, int playerId, int cardId, String token){
        Game game = gameRepository.findOneById(gameDTO.getId());
        Player player = playerRepository.findOneById(playerId);

        if(game == null || game.getGameName() == null || player == null)  {
            return null;
        }

        if(!game.getPlayers().stream().anyMatch(pl -> Objects.equals(pl.getId(), playerId))){
            return null;
        }

        if(!isTurnValid(player,game)) return null;

        if(!isValidPlayer(player,token)) {
            return null;
        }

        Optional<Card> selectedCardOptional = game.getCards().stream().filter(card -> card.getId() == cardId).findFirst();

        if(!selectedCardOptional.isPresent()){
            return null;
        }
        Card selectedCard = selectedCardOptional.get();
        if(CardStatus.OPEN.equals(selectedCard.getCardStatus())) return null;

        game.setCards(game.getCards().stream().map(card -> {
            if(card.getId() == cardId){
                card.setCardStatus(CardStatus.OPEN);
                card.removeAllHighlighters();
            }
            return card;
        }).collect(Collectors.toList()));
        game.addCardLog(player.getNickName(),player.getTeam(),selectedCard);
        return changeGameStatus(game,player,selectedCard);
    }


    /***Helper Methods***/
    private GameDTO setDTOCardsHidden(GameDTO gameDTO) {
        List<CardDTO> cardList = gameDTO.getCards();
        cardList.stream().forEach(cardDTO -> {
            if(cardDTO.getCardStatus() == CardStatus.CLOSED) {
                cardDTO.setCardColor(CardColor.HIDDEN);
            }
        });
        gameDTO.setCards(cardList);
        return gameDTO;
    }

    private GameDTO setDTOTeams(GameDTO gameDTO) {
        Map<String, List<PlayerDTO>> redTeam = new HashMap<>();
        Map<String, List<PlayerDTO>> blueTeam = new HashMap<>();
        List<PlayerDTO> playerList = gameDTO.getPlayers();
        List<PlayerDTO> redTeamOperativeList = new ArrayList<>();
        List<PlayerDTO> blueTeamOperativeList = new ArrayList<>();
        List<PlayerDTO> redTeamSpymasterList = new ArrayList<>();
        List<PlayerDTO> blueTeamSpymasterList = new ArrayList<>();

        for(PlayerDTO player : playerList) {
            if(player.isOnline()) {
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
            if(CardStatus.CLOSED.equals(cardDTO.getCardStatus())) {
                if(cardDTO.getCardColor() == CardColor.RED) {
                    gameDTO.setRedCardsLeft(gameDTO.getRedCardsLeft() + 1);
                } else if(cardDTO.getCardColor() == CardColor.BLUE) {
                    gameDTO.setBlueCardsLeft(gameDTO.getBlueCardsLeft() + 1);
                }
            }
        }
        return gameDTO;
    }

    private GameDTO createDTO(Game game, boolean isSpymaster) {
        GameDTO gameDTO = GameMapper.toGameDTO(game);

        gameDTO = setDTOTeams(gameDTO);

        gameDTO = setDTOCardsRemaining(gameDTO);

        if(!isSpymaster) gameDTO = setDTOCardsHidden(gameDTO);

        return gameDTO;
    }

    private Game removeHighlightedCardsById(Game game, int playerId) {
        game.setCards(game.getCards().stream().map(card -> {
            if(card.getHighlighters().containsKey(playerId)){
                card.removeHighlighter(playerId);
            }
            return card;
        }).collect(Collectors.toList()));
        return game;
    }

    private Game removeAllHighlightedCards(Game game) {
        game.setCards(game.getCards().stream().map(card -> card.setHighlighters(new HashMap<Integer,String>())).collect(Collectors.toList()));
        return game;
    }

    private boolean isTurnValid(Player player, Game game) {
        if (GameStatus.BLUE_TEAM_OPERATIVE_ROUND.equals(game.getGameStatus())) {
            if(Team.BLUE.equals(player.getTeam()) && PlayerType.OPERATIVE.equals(player.getPlayerType())) {
                return true;
            }
        }
        if (GameStatus.RED_TEAM_OPERATIVE_ROUND.equals(game.getGameStatus())) {
            if(Team.RED.equals(player.getTeam()) && PlayerType.OPERATIVE.equals(player.getPlayerType())) {
                return true;
            }
        }
        if (GameStatus.BLUE_TEAM_SPYMASTER_ROUND.equals(game.getGameStatus())) {
            if(Team.BLUE.equals(player.getTeam()) && PlayerType.SPYMASTER.equals(player.getPlayerType())) {
                return true;
            }
        }
        if (GameStatus.RED_TEAM_SPYMASTER_ROUND.equals(game.getGameStatus())) {
            if(Team.RED.equals(player.getTeam()) && PlayerType.SPYMASTER.equals(player.getPlayerType())) {
                return true;
            }
        }
        return false;
    }

    private GameDTO changeGameStatus(Game game, Player player, Card card) {
        if(Team.BLUE.equals(player.getTeam()) && (CardColor.RED.equals(card.getCardColor()) || CardColor.NEUTRAL.equals(card.getCardColor()))) {
            game.setGameStatus(GameStatus.RED_TEAM_SPYMASTER_ROUND);
            game = removeAllHighlightedCards(game);
        }
        if(Team.RED.equals(player.getTeam()) && (CardColor.BLUE.equals(card.getCardColor()) || CardColor.NEUTRAL.equals(card.getCardColor()))) {
            game.setGameStatus(GameStatus.BLUE_TEAM_SPYMASTER_ROUND);
            game = removeAllHighlightedCards(game);

        }
        if(CardColor.BLACK.equals(card.getCardColor())) {
            if (Team.RED.equals(player.getTeam())) {
                game.setGameStatus(GameStatus.BLUE_TEAM_WON);
            } else {
                game.setGameStatus(GameStatus.RED_TEAM_WON);
            }
            game = removeAllHighlightedCards(game);
        }
        GameDTO tempGameDTO = createDTO(game, false);
        if(tempGameDTO.getBlueCardsLeft() == 0) {
            game.setGameStatus(GameStatus.BLUE_TEAM_WON);
        } else if(tempGameDTO.getRedCardsLeft() == 0) {
            game.setGameStatus(GameStatus.RED_TEAM_WON);
        }
        gameRepository.save(game);
        return createDTO(game, false);
    }

    private boolean isValidPlayer(Player player, String token) {
        return player.getToken().equals(token);
    }

    @EventListener
    public void onApplicationEvent(SessionConnectedEvent event) {
        StompHeaderAccessor stompAccessor = StompHeaderAccessor.wrap(event.getMessage());
        GenericMessage connectHeader = (GenericMessage)stompAccessor.getHeader(SimpMessageHeaderAccessor.CONNECT_MESSAGE_HEADER);
        Map<String, List<String>> nativeHeaders = (Map<String, List<String>>) connectHeader.getHeaders().get(SimpMessageHeaderAccessor.NATIVE_HEADERS);
        String playerId = nativeHeaders.get("playerId").get(0);
        String sessionId = stompAccessor.getSessionId();
        List<Game> games = (List<Game>) gameRepository.findAll();
        for (Game game : games) {
            for (Player player : game.getPlayers()) {
                if (player.getId() == Integer.valueOf(playerId)) {
                    player.setOnline(true);
                    player.setSessionId(sessionId);
                    playerRepository.save(player);
                    this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + game.getId(), "UPDATE");
                    return;
                }
            }
        }

    }

    @EventListener
    public void onApplicationEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor stompAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = stompAccessor.getSessionId();
        List<Game> games = (List<Game>) gameRepository.findAll();
        for (Game game : games) {
            for (Player player : game.getPlayers()) {
                if (player.getSessionId().equals(sessionId)) {
                    player.setOnline(false);
                    player.setTeam(Team.SPECTATOR);
                    player.setPlayerType(PlayerType.SPECTATOR);
                    playerRepository.save(player);
                    this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + game.getId(), "UPDATE");
                    return;
                }
            }
        }
    }

    @Scheduled(fixedRate = 600000)
    public void scheduledRemoveAfk() {
        List<Game> games = (List<Game>) gameRepository.findAll();
        for (Game game : games) {
            for (Player player : game.getPlayers()) {
                if (!player.isOnline()) {
                    GameDTO gameDTO = GameMapper.toGameDTO(game);
                    leaveGame(gameDTO,player.getId(),player.getToken());
                    this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + game.getId(), "UPDATE");
                    return;
                }
            }
        }
    }
}
