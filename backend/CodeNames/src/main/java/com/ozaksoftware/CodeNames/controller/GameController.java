package com.ozaksoftware.CodeNames.controller;

import com.ozaksoftware.CodeNames.DTO.model.GameDTO;
import com.ozaksoftware.CodeNames.DTO.response.Response;
import com.ozaksoftware.CodeNames.controller.request.GameRequest;
import com.ozaksoftware.CodeNames.domain.Game;
import com.ozaksoftware.CodeNames.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/game")
public class GameController {
    @Autowired
    GameService gameService;

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public Response createGame(@RequestBody GameRequest gameRequest) {
        if(gameRequest == null || gameRequest.getGameDTO() == null) {
            return Response.badRequest().setErrors("Request is null or game DTO is null");
        }
        Optional<GameDTO> gameDTOOptional = Optional.ofNullable(gameService.createNewGame(gameRequest.getGameDTO(),
                gameRequest.getPlayerId()));
        if(gameDTOOptional.isPresent()){
            return Response.ok().setPayload(gameDTOOptional);
        }
        return Response.badRequest().setErrors("Room name is empty or player with player id:" +
                gameRequest.getPlayerId() + " can not be found.");
    }

    @RequestMapping(value = "/games", method = RequestMethod.GET)
    public Response getAllGames() {
        List<GameDTO> gameDTOS = gameService.listGameDTOs();
        return Response.ok().setPayload(gameDTOS);
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
        public Response getGame(@RequestParam int gameId, @RequestParam int playerId) {
        Optional<Game> gameOptional = Optional.ofNullable(gameService.getGame(gameId));
        if(gameOptional.isPresent()){
            return Response.ok().setPayload(gameOptional);
        }
        return Response.badRequest().setErrors("Game with id: " + gameId + "can not be found.");
    }
}
