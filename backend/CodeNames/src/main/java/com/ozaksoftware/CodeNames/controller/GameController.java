package com.ozaksoftware.CodeNames.controller;

import com.ozaksoftware.CodeNames.DTO.model.GameDTO;
import com.ozaksoftware.CodeNames.controller.request.CardRequest;
import com.ozaksoftware.CodeNames.controller.request.GamePlayerTypeRequest;
import com.ozaksoftware.CodeNames.controller.request.GameRequest;
import com.ozaksoftware.CodeNames.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public ResponseEntity createGame(@RequestBody GameRequest gameRequest) {
        if(gameRequest == null || gameRequest.getGameDTO() == null) {
            return ResponseEntity.badRequest().body("Request is null or game DTO is null");
        }
        Optional<GameDTO> gameDTOOptional = Optional.ofNullable(gameService.createNewGame(gameRequest.getGameDTO(),
                gameRequest.getPlayerId()));
        if(gameDTOOptional.isPresent()){
            return ResponseEntity.ok().body(gameDTOOptional);
        }
        return ResponseEntity.badRequest().body("Room name is empty or player with player id:" +
                gameRequest.getPlayerId() + " can not be found.");
    }

    @RequestMapping(value = "/games", method = RequestMethod.GET)
    public ResponseEntity getAllGames() {
        List<GameDTO> gameDTOS = gameService.listGameDTOs();
        return ResponseEntity.ok().body(gameDTOS);
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
        public ResponseEntity getGame(@RequestParam int gameId, @RequestParam int playerId) {
        Optional<GameDTO> gameOptional = Optional.ofNullable(gameService.getGame(gameId, playerId));
        if(gameOptional.isPresent()){
            this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + gameOptional.get().getId(), "UPDATE");
            return ResponseEntity.ok().body(gameOptional);
        }
        return ResponseEntity.badRequest().body("Game with id: " + gameId + "can not be found.");
    }

    @RequestMapping(value = "/check", method = RequestMethod.GET)
    public ResponseEntity checkGame(@RequestParam int userId, @RequestParam int gameId) {
        Optional<GameDTO> gameDTOOptional = Optional.ofNullable(gameService.checkGame(userId,gameId));
        if(gameDTOOptional.isPresent()){
            return ResponseEntity.ok().body(gameDTOOptional);
        }
        return ResponseEntity.badRequest().body("There is no game with the id " + gameId + " or user id " + userId + " is not in the game");
    }

    @RequestMapping(value = "/changePlayerType", method = RequestMethod.POST)
    public ResponseEntity changePlayerType(@RequestBody GamePlayerTypeRequest gamePlayerTypeRequest) {
        if(gamePlayerTypeRequest == null || gamePlayerTypeRequest.getGameDTO() == null) {
            return ResponseEntity.badRequest().body("Request is null or game DTO is null");
        }
        Optional<GameDTO> gameDTOOptional = Optional.ofNullable(gameService.changePlayerType(gamePlayerTypeRequest.getGameDTO(),
                gamePlayerTypeRequest.getPlayerId(), gamePlayerTypeRequest.getPlayerType(), gamePlayerTypeRequest.getTeam()));
        if(gameDTOOptional.isPresent()){
            this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + gameDTOOptional.get().getId(), "UPDATE");
            return ResponseEntity.ok().body(gameDTOOptional);
        }
        return ResponseEntity.badRequest().body("Room id is empty or player with player id:" +
                gamePlayerTypeRequest.getPlayerId() + " can not be found.");
    }

    @RequestMapping(value = "/reset", method = RequestMethod.POST)
    public ResponseEntity resetGame(@RequestBody GameRequest gameRequest) {
        if(gameRequest == null || gameRequest.getGameDTO() == null) {
            return ResponseEntity.badRequest().body("Request is null or game DTO is null");
        }

        Optional<GameDTO> gameDTOOptional = Optional.ofNullable(gameService.resetGame(gameRequest.getGameDTO(), gameRequest.getPlayerId()));
        if(gameDTOOptional.isPresent()){
            this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + gameDTOOptional.get().getId(), "UPDATE");
            return ResponseEntity.ok().body(gameDTOOptional);
        }
        return ResponseEntity.badRequest().body("Room id is empty or player with player id:" +
                gameRequest.getPlayerId() + " can not be found.");
    }

    @RequestMapping(value = "/leave", method = RequestMethod.POST)
    public ResponseEntity leaveGame(@RequestBody GameRequest gameRequest) {
        if(gameRequest == null || gameRequest.getGameDTO() == null) {
            return ResponseEntity.badRequest().body("Request is null or game DTO is null");
        }
        Optional<List<GameDTO>> gameDTOListOptional = Optional.ofNullable(gameService.leaveGame(gameRequest.getGameDTO(), gameRequest.getPlayerId()));

        if(gameDTOListOptional.isPresent()){
            this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + gameRequest.getGameDTO().getId(), "UPDATE");
            return ResponseEntity.ok().body(gameDTOListOptional);
        }

        return ResponseEntity.badRequest().body("Room id is empty or player with player id:" +
                gameRequest.getPlayerId() + " can not be found.");
    }

    @RequestMapping(value = "/giveClue", method = RequestMethod.POST)
    public ResponseEntity giveClue(@RequestBody GameRequest gameRequest) {
        if(gameRequest == null || gameRequest.getGameDTO() == null) {
            return ResponseEntity.badRequest().body("Request is null or game DTO is null");
        }
        Optional<GameDTO> gameDTOOptional = Optional.ofNullable(gameService.giveClue(gameRequest.getGameDTO(), gameRequest.getPlayerId()));

        if(gameDTOOptional.isPresent()){
            this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + gameDTOOptional.get().getId(), "UPDATE");
            return ResponseEntity.ok().body(gameDTOOptional);
        }

        return ResponseEntity.badRequest().body("Room id is empty or player with player id:" +
                gameRequest.getPlayerId() + " can not be found.");
    }

    @RequestMapping(value = "/kick", method = RequestMethod.POST)
    public ResponseEntity kickPlayer(@RequestBody GameRequest gameRequest) {
        if(gameRequest == null || gameRequest.getGameDTO() == null) {
            return ResponseEntity.badRequest().body("Request is null or game DTO is null");
        }
        Optional<GameDTO> gameDTOOptional = Optional.ofNullable(gameService.kickPlayer(gameRequest.getGameDTO(), gameRequest.getPlayerId()));

        if(gameDTOOptional.isPresent()){
            this.simpMessagingTemplate.convertAndSend("/topic/kick/" + gameRequest.getPlayerId(), "KICK");
            this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + gameDTOOptional.get().getId(), "UPDATE");
            return ResponseEntity.ok().body(gameDTOOptional);
        }

        return ResponseEntity.badRequest().body("Room id is empty or player with player id:" +
                gameRequest.getPlayerId() + " can not be found.");
    }

    @RequestMapping(value = "/highlightCard", method = RequestMethod.POST)
    public ResponseEntity highlightCard(@RequestBody CardRequest cardRequest) {
        if(cardRequest == null || cardRequest.getGameDTO() == null) {
            return ResponseEntity.badRequest().body("Request is null or game DTO is null");
        }
        Optional<GameDTO> gameDTOOptional = Optional.ofNullable(gameService.highlightCard(cardRequest.getGameDTO(), cardRequest.getPlayerId(),
                cardRequest.getCardId()));

        if(gameDTOOptional.isPresent()){
            this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + gameDTOOptional.get().getId(), "UPDATE");
            return ResponseEntity.ok().body(gameDTOOptional);
        }

        return ResponseEntity.badRequest().body("Room id is empty or player with player id:" +
                cardRequest.getPlayerId() + " can not be found.");
    }

    @RequestMapping(value = "/endGuess", method = RequestMethod.POST)
    public ResponseEntity endGuess(@RequestBody GameRequest gameRequest) {
        if(gameRequest == null || gameRequest.getGameDTO() == null) {
            return ResponseEntity.badRequest().body("Request is null or game DTO is null");
        }
        Optional<GameDTO> gameDTOOptional = Optional.ofNullable(gameService.endGuess(gameRequest.getGameDTO(),
                gameRequest.getPlayerId()));

        if(gameDTOOptional.isPresent()){
            this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + gameDTOOptional.get().getId(), "UPDATE");
            return ResponseEntity.ok().body(gameDTOOptional);
        }

        return ResponseEntity.badRequest().body("Room id is empty or player with player id:" +
                gameRequest.getPlayerId() + " can not be found.");
    }

    @RequestMapping(value = "/selectCard", method = RequestMethod.POST)
    public ResponseEntity selectCard(@RequestBody CardRequest cardRequest) {
        if(cardRequest == null || cardRequest.getGameDTO() == null) {
            return ResponseEntity.badRequest().body("Request is null or game DTO is null");
        }
        Optional<GameDTO> gameDTOOptional = Optional.ofNullable(gameService.selectCard(cardRequest.getGameDTO(), cardRequest.getPlayerId(),
                cardRequest.getCardId()));

        if(gameDTOOptional.isPresent()){
            this.simpMessagingTemplate.convertAndSend("/topic/updateGame/" + gameDTOOptional.get().getId(), "UPDATE");
            return ResponseEntity.ok().body(gameDTOOptional);
        }

        return ResponseEntity.badRequest().body("Room id is empty or player with player id:" +
                cardRequest.getPlayerId() + " can not be found.");
    }
}
