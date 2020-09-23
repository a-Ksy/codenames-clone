package com.ozaksoftware.CodeNames.controller.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ozaksoftware.CodeNames.DTO.model.GameDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GameRequest {
    private GameDTO gameDTO;
    private Integer playerId;
}
