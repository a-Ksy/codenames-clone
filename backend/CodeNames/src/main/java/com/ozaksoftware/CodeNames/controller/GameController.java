package com.ozaksoftware.CodeNames.controller;

import com.ozaksoftware.CodeNames.DTO.model.GameDTO;
import com.ozaksoftware.CodeNames.DTO.model.PlayerDTO;
import com.ozaksoftware.CodeNames.DTO.response.Response;
import com.ozaksoftware.CodeNames.controller.request.GameRequest;
import com.ozaksoftware.CodeNames.domain.Game;
import com.ozaksoftware.CodeNames.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/game")
public class GameController {
    @Autowired
    GameService gameService;

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
        Optional<Game> gameOptional = Optional.ofNullable(gameService.getGame(gameId));
        if(gameOptional.isPresent()){
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

}
