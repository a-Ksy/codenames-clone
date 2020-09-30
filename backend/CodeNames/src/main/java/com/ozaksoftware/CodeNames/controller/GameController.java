package com.ozaksoftware.CodeNames.controller;

import com.ozaksoftware.CodeNames.DTO.model.GameDTO;
import com.ozaksoftware.CodeNames.controller.request.CardRequest;
import com.ozaksoftware.CodeNames.controller.request.GamePlayerTypeRequest;
import com.ozaksoftware.CodeNames.controller.request.GameRequest;
import com.ozaksoftware.CodeNames.enums.ErrorMessage;
import com.ozaksoftware.CodeNames.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/game")
public class GameController {
    @Autowired
    GameService gameService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    public GameController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity createGame(@RequestBody GameRequest gameRequest, @RequestHeader HttpHeaders headers) {

        if(!isGameValid(gameRequest,headers)) {
            return ResponseEntity.badRequest().body("Request or game DTO or header is null");
        }

        return validateGameDTO(gameService.createNewGame(gameRequest.getGameDTO(),
                gameRequest.getPlayerId(),gameRequest.getPassword(),getToken(headers)),false);
    }

    @RequestMapping(value = "/games", method = RequestMethod.GET)
    public ResponseEntity getAllGames() {
        return ResponseEntity.ok().body(gameService.listGameDTOs());
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
        public ResponseEntity getGame(@RequestParam int gameId, @RequestParam int playerId, String password, @RequestHeader HttpHeaders headers) {
        Optional<GameDTO> gameOptional = Optional.ofNullable(gameService.getGame(gameId,
                playerId,password,getToken(headers)));

        if(gameOptional.isPresent()){
            if(gameOptional.get().getGameName() == ErrorMessage.INVALID_PASSWORD.toString()) {
                return ResponseEntity.badRequest().body(ErrorMessage.INVALID_PASSWORD);
            }

            if(gameOptional.get().getGameName() == ErrorMessage.KICKED_FROM_GAME.toString()) {
                return ResponseEntity.badRequest().body(ErrorMessage.KICKED_FROM_GAME);
            }
            this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + gameOptional.get().getId(), "UPDATE");
            return ResponseEntity.ok().body(gameOptional);
        }
        return ResponseEntity.badRequest().body("Game with id: " + gameId + "can not be found.");
    }

    @RequestMapping(value = "/check", method = RequestMethod.GET)
    public ResponseEntity checkGame(@RequestParam int userId, @RequestParam int gameId, @RequestHeader HttpHeaders headers) {
        return validateGameDTO(gameService.checkGame(userId,
                gameId,getToken(headers)),false);
    }

    @RequestMapping(value = "/changePlayerType", method = RequestMethod.POST)
    public ResponseEntity changePlayerType(@RequestBody GamePlayerTypeRequest gamePlayerTypeRequest, @RequestHeader HttpHeaders headers) {
        if(gamePlayerTypeRequest == null || gamePlayerTypeRequest.getGameDTO() == null) {
            return ResponseEntity.badRequest().body("Request is null or game DTO is null");
        }
        return validateGameDTO(gameService.changePlayerType(gamePlayerTypeRequest.getGameDTO(),
                gamePlayerTypeRequest.getPlayerId(), gamePlayerTypeRequest.getPlayerType(),
                gamePlayerTypeRequest.getTeam(),getToken(headers)),true);
    }

    @RequestMapping(value = "/reset", method = RequestMethod.POST)
    public ResponseEntity resetGame(@RequestBody GameRequest gameRequest, @RequestHeader HttpHeaders headers) {
        if(!isGameValid(gameRequest,headers)) {
            return ResponseEntity.badRequest().body("Request or game DTO or header is null");
        }
        return validateGameDTO(gameService.resetGame(gameRequest.getGameDTO(),
                gameRequest.getPlayerId(), getToken(headers)),true);
    }

    @RequestMapping(value = "/leave", method = RequestMethod.POST)
    public ResponseEntity leaveGame(@RequestBody GameRequest gameRequest, @RequestHeader HttpHeaders headers) {
        if(!isGameValid(gameRequest,headers)) {
            return ResponseEntity.badRequest().body("Request or game DTO or header is null");
        }

        Optional<List<GameDTO>> gameDTOListOptional = Optional.ofNullable(gameService.leaveGame(gameRequest.getGameDTO(),
                gameRequest.getPlayerId(), getToken(headers)));

        if(gameDTOListOptional.isPresent()){
            this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + gameRequest.getGameDTO().getId(), "UPDATE");
            return ResponseEntity.ok().body(gameDTOListOptional);
        }

        return ResponseEntity.badRequest().body("Room id is empty or player with player id:" +
                gameRequest.getPlayerId() + " can not be found.");
    }

    @RequestMapping(value = "/giveClue", method = RequestMethod.POST)
    public ResponseEntity giveClue(@RequestBody GameRequest gameRequest, @RequestHeader HttpHeaders headers) {
        if(!isGameValid(gameRequest,headers)) {
            return ResponseEntity.badRequest().body("Request or game DTO or header is null");
        }
        return validateGameDTO(gameService.giveClue(gameRequest.getGameDTO(),
                gameRequest.getPlayerId(), getToken(headers)),true);
    }

    @RequestMapping(value = "/kick", method = RequestMethod.POST)
    public ResponseEntity kickPlayer(@RequestBody GameRequest gameRequest, @RequestHeader HttpHeaders headers) {
        if(!isGameValid(gameRequest,headers)) {
            return ResponseEntity.badRequest().body("Request or game DTO or header is null");
        }
        Optional<GameDTO> gameDTOOptional = Optional.ofNullable(gameService.kickPlayer(gameRequest.getGameDTO(),
                gameRequest.getPlayerId(),getToken(headers)));

        if(gameDTOOptional.isPresent()){
            this.simpMessagingTemplate.convertAndSend("/topic/kick/" + gameRequest.getPlayerId(), "KICK");
            this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + gameDTOOptional.get().getId(), "UPDATE");
            return ResponseEntity.ok().body(gameDTOOptional);
        }

        return ResponseEntity.badRequest().body("Room id is empty or player with player id:" +
                gameRequest.getPlayerId() + " can not be found.");
    }

    @RequestMapping(value = "/highlightCard", method = RequestMethod.POST)
    public ResponseEntity highlightCard(@RequestBody CardRequest cardRequest, @RequestHeader HttpHeaders headers) {
        if(!isCardValid(cardRequest,headers)) {
            return ResponseEntity.badRequest().body("Request or game DTO or header is null");
        }
        return validateGameDTO(gameService.highlightCard(cardRequest.getGameDTO(), cardRequest.getPlayerId(),
                cardRequest.getCardId(),getToken(headers)),true);
    }

    @RequestMapping(value = "/endGuess", method = RequestMethod.POST)
    public ResponseEntity endGuess(@RequestBody GameRequest gameRequest, @RequestHeader HttpHeaders headers) {
        if(!isGameValid(gameRequest,headers)) {
            return ResponseEntity.badRequest().body("Request or game DTO or header is null");
        }
        return validateGameDTO(gameService.endGuess(gameRequest.getGameDTO(),
                gameRequest.getPlayerId(),getToken(headers)),true);
    }

    @RequestMapping(value = "/selectCard", method = RequestMethod.POST)
    public ResponseEntity selectCard(@RequestBody CardRequest cardRequest, @RequestHeader HttpHeaders headers) {
        if(!isCardValid(cardRequest,headers)) {
            return ResponseEntity.badRequest().body("Request or game DTO or header is null");
        }
        return validateGameDTO(gameService.selectCard(cardRequest.getGameDTO(), cardRequest.getPlayerId(),
                cardRequest.getCardId(),getToken(headers)),true);
    }

    private boolean isHeaderValid(HttpHeaders headers) {
        if(headers != null && headers.getFirst("authorization") != null) {
            return true;
        }
        return false;
    }

    private boolean isGameValid(GameRequest gameRequest, HttpHeaders headers) {
        if(gameRequest == null || gameRequest.getGameDTO() == null || !isHeaderValid(headers)) {
            return false;
        }
        return true;
    }

    private boolean isCardValid(CardRequest cardRequest, HttpHeaders headers) {
        if(cardRequest == null || cardRequest.getGameDTO() == null || !isHeaderValid(headers)) {
            return false;
        }
        return true;
    }

    private ResponseEntity validateGameDTO(GameDTO gameDTO, boolean didUpdate) {
        Optional<GameDTO> gameDTOOptional = Optional.ofNullable(gameDTO);

        if(gameDTOOptional.isPresent()){
            if(didUpdate) {
                this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + gameDTOOptional.get().getId(), "UPDATE");
            }
            return ResponseEntity.ok().body(gameDTOOptional);
        }
        return ResponseEntity.badRequest().body("Room id is empty or player with that player id " +
                "can not be found.");
    }

    private String getToken(HttpHeaders headers) {
        return headers.getFirst("authorization");
    }

}
