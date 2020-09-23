package com.ozaksoftware.CodeNames.controller;


import com.ozaksoftware.CodeNames.DTO.model.GameDTO;
import com.ozaksoftware.CodeNames.DTO.model.PlayerDTO;
import com.ozaksoftware.CodeNames.DTO.response.Response;
import com.ozaksoftware.CodeNames.controller.request.PlayerRequest;
import com.ozaksoftware.CodeNames.domain.Game;
import com.ozaksoftware.CodeNames.domain.Player;
import com.ozaksoftware.CodeNames.service.GameService;
import com.ozaksoftware.CodeNames.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/player")
public class PlayerController {
    @Autowired
    PlayerService playerService;
    @Autowired
    GameService gameService;

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity createPlayer(@RequestBody PlayerDTO newPlayerDTO) {
        Optional<PlayerDTO> playerDTOOptional = Optional.ofNullable(playerService.createNewPlayer(newPlayerDTO));
        if(playerDTOOptional.isPresent()){
            return ResponseEntity.ok().body(playerDTOOptional);
        }
        return ResponseEntity.badRequest().body("Nickname can't be empty.");
    }

    @RequestMapping(value = "/check", method = RequestMethod.GET)
    public ResponseEntity checkPlayer(@RequestParam int userId, @RequestParam String nickName) {
        Optional<PlayerDTO> playerDTOOptional = Optional.ofNullable(playerService.checkPlayer(userId,nickName));
        if(playerDTOOptional.isPresent()){
            return ResponseEntity.ok().body(playerDTOOptional);
        }
        return ResponseEntity.badRequest().body("There is no user with the id " + userId + " and the nickname " + nickName);
    }

    @RequestMapping(value = "/players", method = RequestMethod.GET)
    public ResponseEntity getAllPlayers() {
        List<PlayerDTO> playerDTOs = playerService.listPlayerDTOs();
        return ResponseEntity.ok().body(playerDTOs);
    }
}

