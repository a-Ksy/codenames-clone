package com.ozaksoftware.CodeNames.controller;


import com.ozaksoftware.CodeNames.DTO.model.PlayerDTO;
import com.ozaksoftware.CodeNames.DTO.response.Response;
import com.ozaksoftware.CodeNames.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/player")
public class PlayerController {
    @Autowired
    PlayerService playerService;

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public Response createPlayer(@RequestBody PlayerDTO newPlayerDTO) {
        Optional<PlayerDTO> playerDTOOptional = Optional.ofNullable(playerService.createNewPlayer(newPlayerDTO));
        if(playerDTOOptional.isPresent()){
            return Response.ok().setPayload(playerDTOOptional);
        }
        return Response.badRequest().setErrors("Nickname can't be empty.");
    }

    @RequestMapping(value = "/players", method = RequestMethod.GET)
    public Response getAllPlayers() {
        List<PlayerDTO> playerDTOs = playerService.listPlayerDTOs();
        return Response.ok().setPayload(playerDTOs);
    }
}

