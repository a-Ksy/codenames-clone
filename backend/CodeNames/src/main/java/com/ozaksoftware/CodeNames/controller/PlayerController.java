package com.ozaksoftware.CodeNames.controller;

import com.ozaksoftware.CodeNames.DTO.mapper.PlayerMapper;
import com.ozaksoftware.CodeNames.DTO.model.PlayerDTO;
import com.ozaksoftware.CodeNames.domain.Player;
import com.ozaksoftware.CodeNames.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/player")
public class PlayerController {
    @Autowired
    PlayerService playerService;

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity createPlayer(@RequestBody PlayerDTO newPlayerDTO) {
        Optional<Player> playerOptional = Optional.ofNullable(playerService.createNewPlayer(newPlayerDTO));
        if(playerOptional.isPresent()){
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.set("Token",playerOptional.get().getToken());
            return ResponseEntity.ok().headers(responseHeaders).body(PlayerMapper.toPlayerDTO(playerOptional.get()));
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
        return ResponseEntity.ok().body(playerService.listPlayerDTOs());
    }
}

