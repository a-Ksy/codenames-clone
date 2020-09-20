package com.ozaksoftware.CodeNames.controller;

import com.ozaksoftware.CodeNames.DTO.model.GameDTO;
import com.ozaksoftware.CodeNames.DTO.response.Response;
import com.ozaksoftware.CodeNames.controller.request.GameRequest;
import com.ozaksoftware.CodeNames.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

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
            return Response.badRequest().setErrors("Request is null");
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
}
